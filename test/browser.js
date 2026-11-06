/* End-to-end test in real Chromium. Run: node test/browser.js */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

// The preinstalled Chromium build number differs between containers, so find
// it rather than hardcoding one.
const PW = '/opt/pw-browsers';
function findChrome() {
  const stable = path.join(PW, 'chromium');                 // documented stable entry
  try { if (fs.statSync(stable).isFile()) return stable; } catch (e) { /* fall through */ }
  try {
    for (const d of fs.readdirSync(PW).filter(x => /^chromium-\d+$/.test(x)).sort().reverse()) {
      for (const sub of ['chrome-linux64', 'chrome-linux']) {
        const c = path.join(PW, d, sub, 'chrome');
        if (fs.existsSync(c)) return c;
      }
    }
  } catch (e) { /* fall through */ }
  return undefined;                                          // let playwright try its default
}
const executablePath = findChrome();

const URL = 'file://' + path.join(__dirname, '..', 'index.html');
let fails = 0;
const check = (cond, label, extra) => {
  if (cond) console.log('  ok  ' + label);
  else { fails++; console.log('  FAIL ' + label + (extra ? ' -> ' + extra : '')); }
};

(async () => {
  const browser = await chromium.launch({ executablePath });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(URL);
  await page.waitForTimeout(300);

  /* ---------------------------------------------------------- boot */
  check(errors.length === 0, 'page loads with no JS errors', errors.join(' | '));
  check(await page.isVisible('#view-exam'), 'practice exam is the default view');
  const tabOrder = await page.$$eval('.tab', e => e.map(t => t.dataset.view));
  check(tabOrder.join(',') === 'exam,quiz,drill,formulas,progress',
    'tabs run exam -> quiz -> drill -> formulas -> progress', tabOrder.join(','));

  await page.click('.tab[data-view="drill"]');
  await page.waitForTimeout(150);
  check(await page.isVisible('#view-drill'), 'math drill tab switches');
  check((await page.textContent('#drill-q')).length > 40, 'a math problem rendered');

  // topic chips must be visible, counted, and one selected
  const drillChips = await page.$$eval('#drill-cats .chip', e => e.map(c => c.textContent));
  check(drillChips.length >= 6, 'math topic chips are shown (' + drillChips.length + ')');
  check(drillChips.every(t => /\d+$/.test(t.trim())), 'every math chip shows a count');
  check(await page.$$eval('#drill-cats .chip.on', e => e.length) === 1,
    'exactly one math topic chip is active');

  /* ------------------------------------------------- drill: wrong then right */
  await page.fill('#drill-input', '1');
  await page.click('#drill-check');
  check((await page.textContent('#drill-feedback')).includes('Not quite'), 'wrong answer is rejected');
  check(await page.isVisible('#drill-work'), 'worked solution appears after answering');
  const stepCount = await page.$$eval('#drill-steps li', els => els.length);
  check(stepCount >= 1, 'solution shows numbered steps (' + stepCount + ')');

  await page.click('#drill-next');
  await page.click('#drill-reveal');
  check((await page.textContent('#drill-feedback')).includes('Answer:'), 'reveal shows the answer');

  /* ------------------------------------------------- drill: correct answer path */
  // Use a deterministic generator we can solve from the question text.
  await page.selectOption('#drill-type', 'lot-acres');
  await page.waitForTimeout(100);
  const lotQ = await page.textContent('#drill-q');
  const m = lotQ.match(/measures (\d+) feet by (\d+) feet/);
  const acres = (parseFloat(m[1]) * parseFloat(m[2]) / 43560).toFixed(2);
  await page.fill('#drill-input', acres);
  await page.click('#drill-check');
  check((await page.textContent('#drill-feedback')).includes('Correct'),
    'correct answer accepted (' + acres + ' acres)');
  check((await page.textContent('#drill-score')).includes('streak'), 'session score tracks a streak');

  /* -------------------------------------------- money formatting is accepted */
  await page.selectOption('#drill-type', 'mn-deed-tax');
  await page.waitForTimeout(100);
  const deedQ = await page.textContent('#drill-q');
  const price = parseFloat(deedQ.match(/sells for \$([\d,]+)/)[1].replace(/,/g, ''));
  const metro = /(Hennepin|Ramsey) County, Minnesota/.test(deedQ);
  const tax = price * (metro ? 0.0034 : 0.0033);
  await page.fill('#drill-input', '$' + tax.toLocaleString('en-US', { minimumFractionDigits: 2 }));
  await page.click('#drill-check');
  check((await page.textContent('#drill-feedback')).includes('Correct'),
    'a "$1,234.56"-formatted answer parses correctly');

  /* ---------------------------------------------------------------- quiz */
  await page.click('.tab[data-view="quiz"]');
  await page.waitForTimeout(150);
  check(await page.isVisible('#view-quiz'), 'quiz tab switches');
  check(/National/.test(await page.textContent('#quiz-portions .chip.on')),
    'quiz defaults to the national portion');

  // switching portion must rebuild the topic chips to that portion's topics
  const natCats = await page.$$eval('#quiz-cats .chip', o => o.map(e => e.dataset.v));
  await page.click('#quiz-portions .chip[data-v="state"]');
  await page.waitForTimeout(120);
  const stCats = await page.$$eval('#quiz-cats .chip', o => o.map(e => e.dataset.v));
  check(natCats.includes('Transfer of Title') && !stCats.includes('Transfer of Title'),
    'topic chips follow the selected portion');
  check(stCats.some(c => c.startsWith('MN')) && !natCats.some(c => c.startsWith('MN')),
    'MN topics appear only under the state portion');

  // picking a topic chip must actually narrow the questions served
  await page.click('#quiz-portions .chip[data-v="national"]');
  await page.waitForTimeout(120);
  await page.click('#quiz-cats .chip[data-v="Finance"]');
  await page.waitForTimeout(120);
  check(await page.$$eval('#quiz-cats .chip.on', e => e.length) === 1,
    'exactly one topic chip is active after picking');
  let offTopic = 0;
  for (let i = 0; i < 12; i++) {
    if (!(await page.textContent('#quiz-tag')).includes('Finance')) offTopic++;
    await page.click('#quiz-choices .choice');
    await page.click('#quiz-next');
  }
  check(offTopic === 0, 'selecting a topic serves only that topic', offTopic + ' off-topic');

  // every question served under a portion filter must belong to that portion
  await page.click('#quiz-cats .chip[data-v="All"]');
  await page.waitForTimeout(120);
  let mismatched = 0;
  for (let i = 0; i < 25; i++) {
    const tag = await page.textContent('#quiz-tag');
    if (!tag.includes('National portion')) mismatched++;
    await page.click('#quiz-choices .choice');
    await page.click('#quiz-next');
  }
  check(mismatched === 0, 'national filter never serves a state question', mismatched + ' leaked');
  const nChoices = await page.$$eval('#quiz-choices .choice', e => e.length);
  check(nChoices === 4, 'quiz question has 4 choices');
  await page.click('#quiz-choices .choice');
  check(await page.isVisible('#quiz-feedback'), 'quiz gives feedback');
  check((await page.textContent('#quiz-feedback')).length > 40, 'quiz feedback includes an explanation');
  const marked = await page.$$eval('#quiz-choices .choice.right', e => e.length);
  check(marked === 1, 'exactly one choice is marked correct');
  await page.click('#quiz-next');
  check(await page.isHidden('#quiz-feedback'), 'next question resets feedback');

  /* ---------------------------------------------------------------- exam */
  // Each mode must build the right number of questions.
  for (const [mode, expect] of [['national', 80], ['state', 40], ['full', 120]]) {
    await page.reload();
    await page.waitForTimeout(250);
    await page.click('.tab[data-view="exam"]');
    await page.selectOption('#exam-mode', mode);
    await page.click('#exam-start');
    await page.waitForTimeout(300);
    const n = await page.$$eval('#exam-grid .gridbtn', e => e.length);
    check(n === expect, `exam mode "${mode}" builds ${expect} questions (got ${n})`);
  }

  // A national-only exam must contain no state questions at all.
  await page.reload();
  await page.waitForTimeout(250);
  await page.click('.tab[data-view="exam"]');
  await page.selectOption('#exam-mode', 'national');
  await page.click('#exam-start');
  await page.waitForTimeout(300);
  let stateLeaks = 0;
  for (let i = 0; i < 80; i++) {
    await page.click(`#exam-grid .gridbtn[data-i="${i}"]`);
    if ((await page.textContent('#exam-tag')).includes('MN state')) stateLeaks++;
  }
  check(stateLeaks === 0, 'national-only exam contains zero state questions', stateLeaks + ' leaked');

  // Submitting a national-only exam must not mark the untaken state section failed.
  page.on('dialog', d => d.accept());
  await page.click('#exam-submit');
  await page.waitForTimeout(300);
  const natOnlyBreak = await page.textContent('#exam-breakdown');
  check(!natOnlyBreak.includes('Minnesota state portion'),
    'national-only results omit the untaken state section');
  const natOnlyVerdict = await page.textContent('#exam-verdict');
  check(!/Minnesota section is below/.test(natOnlyVerdict),
    'untaken state section is not reported as failed');

  /* ------------------------------- full exam, always-B regression guard */
  await page.reload();
  await page.waitForTimeout(250);
  await page.click('.tab[data-view="exam"]');
  await page.selectOption('#exam-mode', 'full');
  await page.selectOption('#exam-mins', 'fullpace');
  await page.click('#exam-start');
  await page.waitForTimeout(300);

  const total = await page.$$eval('#exam-grid .gridbtn', e => e.length);
  check(total === 120, 'full exam builds exactly 120 questions (got ' + total + ')');

  // Answer all 120 by always choosing "B" — with shuffled choices this must NOT pass.
  for (let i = 0; i < 120; i++) {
    await page.click(`#exam-grid .gridbtn[data-i="${i}"]`);
    const btns = await page.$$('#exam-choices .choice');
    await btns[1].click();
  }
  const answeredTxt = await page.textContent('#exam-progress');
  check(answeredTxt.includes('120 answered'), 'all 120 answers register', answeredTxt);

  await page.click('#exam-submit');
  await page.waitForTimeout(300);

  check(await page.isVisible('#exam-results'), 'exam results render');
  const breakdown = await page.textContent('#exam-breakdown');
  check(/National portion/.test(breakdown) && /Minnesota state portion/.test(breakdown),
    'results score the two sections separately');

  const natMatch = breakdown.match(/need 60 of (\d+)/);
  const stMatch = breakdown.match(/need 30 of (\d+)/);
  check(natMatch && natMatch[1] === '80', 'national section is 80 questions', natMatch && natMatch[1]);
  check(stMatch && stMatch[1] === '40', 'state section is 40 questions', stMatch && stMatch[1]);

  // The all-B strategy should land near chance (25%), not near passing.
  // Read the achieved score elements, not the "(75%)" threshold text.
  const pct = await page.$$eval('.scorebig span', els => els.map(e => parseInt(e.textContent)));
  check(pct.length === 2 && pct.every(p => p < 55),
    'always-picking-B scores near chance, so choices are shuffled (' + pct.join('%, ') + '%)');

  const verdict = await page.textContent('#exam-verdict');
  check(/NOT YET/.test(verdict), 'all-B run is correctly graded as not passing');
  check((await page.textContent('#exam-review')).includes('you missed'), 'missed-question review renders');

  /* ------------------------------------------------------------ progress */
  await page.click('.tab[data-view="progress"]');
  await page.waitForTimeout(200);
  check((await page.textContent('#prog-exams')).includes('PASS') ||
    (await page.textContent('#prog-exams')).includes('not yet'), 'exam history recorded');
  check((await page.textContent('#prog-math')).length > 20, 'math progress by type renders');

  // persistence across reload
  await page.reload();
  await page.waitForTimeout(300);
  await page.click('.tab[data-view="progress"]');
  await page.waitForTimeout(200);
  check((await page.textContent('#prog-exams')).includes('/80'), 'progress survives a page reload');

  /* ------------------------------------------------------------ formulas */
  await page.click('.tab[data-view="formulas"]');
  const ref = await page.textContent('#view-formulas');
  check(ref.includes('0.0033') && ref.includes('0.0023'), 'formula sheet has both MN transfer taxes');
  check(ref.includes('43,560') && ref.includes('640'), 'formula sheet has land conversions');
  check(ref.includes('North Dakota'), 'formula sheet includes the MN/ND contrast');
  const mnTaxVisible = await page.isVisible('[data-state="MN"] >> text=Minnesota transfer taxes');
  const ndTaxVisibleUnderMN = await page.isVisible('[data-state="ND"] >> text=North Dakota transfer taxes');
  check(mnTaxVisible && !ndTaxVisibleUnderMN, 'under MN the MN tax block shows and the ND block is hidden');

  /* ============================================================ NORTH DAKOTA */
  check(/Minnesota/.test(await page.textContent('#state-switch .chip.on')), 'state switch defaults to Minnesota');
  await page.click('#state-switch .chip[data-v="ND"]');
  await page.waitForTimeout(200);
  check(/North Dakota/.test(await page.textContent('#app-title')), 'title switches to North Dakota');
  check(/100 national \+ 40/.test(await page.textContent('#app-sub')), 'header states the ND 100+40 format');
  check(/70% on national/.test(await page.textContent('#app-sub')), 'header states the ND 70% national standard');

  // formula sheet flips
  const ndTaxVisible = await page.isVisible('[data-state="ND"] >> text=North Dakota transfer taxes');
  const mnTaxVisibleUnderND = await page.isVisible('[data-state="MN"] >> text=Minnesota transfer taxes');
  check(ndTaxVisible && !mnTaxVisibleUnderND, 'under ND the ND tax block shows and the MN block is hidden');

  // math drill drops the MN tax drills
  await page.click('.tab[data-view="drill"]');
  await page.waitForTimeout(150);
  const ndDrillChips = await page.$$eval('#drill-cats .chip', e => e.map(c => c.dataset.v));
  check(!ndDrillChips.includes('MN Taxes'), 'ND math drill has no "MN Taxes" topic', ndDrillChips.join(','));
  const ndTypes = await page.$$eval('#drill-type option', o => o.map(e => e.value));
  check(!ndTypes.some(v => v.startsWith('mn-')), 'ND problem-type list has no MN tax drills');
  let mnLeaks = 0;
  for (let i = 0; i < 40; i++) {
    if (/deed tax|registry tax/i.test(await page.textContent('#drill-q'))) mnLeaks++;
    await page.click('#drill-reveal');
    await page.click('#drill-next');
  }
  check(mnLeaks === 0, 'ND drill never serves a MN transfer-tax problem in 40 draws', mnLeaks + ' leaked');

  // quiz shows ND state bank and ND categories only
  await page.click('.tab[data-view="quiz"]');
  await page.waitForTimeout(150);
  const ndPortionChips = await page.$$eval('#quiz-portions .chip', e => e.map(c => c.textContent));
  check(ndPortionChips.some(t => /ND state\s*60/.test(t)), 'quiz shows "ND state" with 60 questions', ndPortionChips.join(' | '));
  await page.click('#quiz-portions .chip[data-v="state"]');
  await page.waitForTimeout(120);
  const ndCats = await page.$$eval('#quiz-cats .chip', o => o.map(e => e.dataset.v));
  check(ndCats.some(c => c.startsWith('ND ')) && !ndCats.some(c => c.startsWith('MN ')),
    'ND state topics are ND-only', ndCats.join(','));
  let mnQLeaks = 0;
  for (let i = 0; i < 30; i++) {
    const tag = await page.textContent('#quiz-tag');
    if (!/ND state portion/.test(tag) || /^MN /.test(tag)) mnQLeaks++;
    await page.click('#quiz-choices .choice');
    await page.click('#quiz-next');
  }
  check(mnQLeaks === 0, 'ND state quiz never serves a Minnesota question', mnQLeaks + ' leaked');

  // exam reshapes to 100 + 40
  for (const [mode, expect] of [['national', 100], ['state', 40], ['full', 140]]) {
    await page.click('.tab[data-view="exam"]');
    await page.selectOption('#exam-mode', mode);
    await page.click('#exam-start');
    await page.waitForTimeout(300);
    const n = await page.$$eval('#exam-grid .gridbtn', e => e.length);
    check(n === expect, `ND exam mode "${mode}" builds ${expect} questions (got ${n})`);
    // no MN state question in an ND exam
    let mnExamLeaks = 0;
    for (let i = 0; i < n; i++) {
      await page.click(`#exam-grid .gridbtn[data-i="${i}"]`);
      const tag = await page.textContent('#exam-tag');
      if (/MN state/.test(tag) || /•\s*MN /.test(tag)) mnExamLeaks++;
    }
    check(mnExamLeaks === 0, `ND "${mode}" exam contains zero Minnesota state questions`, mnExamLeaks + ' leaked');
    await page.click('#exam-submit');
    await page.waitForTimeout(300);
    await page.click('#exam-again');
  }
  // ND passing thresholds: 70 of 100 national, 30 of 40 state
  await page.selectOption('#exam-mode', 'full');
  await page.click('#exam-start');
  await page.waitForTimeout(300);
  await page.click('#exam-submit');
  await page.waitForTimeout(300);
  const ndBreak = await page.textContent('#exam-breakdown');
  check(/need 70 of 100 \(70%\)/.test(ndBreak), 'ND results grade national against 70 of 100', ndBreak.slice(0, 120));
  check(/need 30 of 40 \(75%\)/.test(ndBreak), 'ND results grade state against 30 of 40');
  check(/North Dakota state portion/.test(ndBreak), 'ND results label the state section North Dakota');

  // choice persists across reload, and switching back restores MN
  await page.reload();
  await page.waitForTimeout(300);
  check(/North Dakota/.test(await page.textContent('#state-switch .chip.on')), 'state choice survives a reload');
  await page.click('#state-switch .chip[data-v="MN"]');
  await page.waitForTimeout(200);
  check(/Minnesota/.test(await page.textContent('#app-title')), 'switching back restores Minnesota');
  await page.selectOption('#exam-mode', 'national');
  await page.click('#exam-start');
  await page.waitForTimeout(300);
  check(await page.$$eval('#exam-grid .gridbtn', e => e.length) === 80, 'MN exam is back to 80 after switching');
  const mnDrillChips = await page.$$eval('#drill-cats .chip', e => e.map(c => c.dataset.v));
  check(mnDrillChips.includes('MN Taxes'), 'MN Taxes topic returns after switching back');

  /* ============================================================ DEEP LINKS */
  // A fragment opens that tab directly; a query pins the state. Use a cache-
  // busting query so file:// navigation actually reloads.
  await page.goto(URL + '?v=a#drill');
  await page.waitForTimeout(300);
  check(await page.isVisible('#view-drill') && await page.isHidden('#view-exam'),
    '#drill in the URL opens the math drill directly');
  await page.click('.tab[data-view="quiz"]');
  await page.waitForTimeout(100);
  check(await page.evaluate(() => location.hash) === '#quiz', 'clicking a tab writes it to the URL fragment');
  await page.evaluate(() => { location.hash = '#formulas'; });
  await page.waitForTimeout(150);
  check(await page.isVisible('#view-formulas'), 'changing the fragment switches the tab');
  await page.goto(URL + '?state=ND&v=b#quiz');
  await page.waitForTimeout(300);
  check(/North Dakota/.test(await page.textContent('#app-title')) && await page.isVisible('#view-quiz'),
    '?state=ND#quiz pins North Dakota and opens the quiz');
  await page.goto(URL + '?v=c#nonsense');
  await page.waitForTimeout(300);
  check(await page.isVisible('#view-exam'), 'an unknown fragment falls back to the exam');
  await page.goto(URL + '?state=MN&v=d');
  await page.waitForTimeout(300);
  check(/Minnesota/.test(await page.textContent('#app-title')), '?state=MN restores Minnesota');

  /* ============================================================ KEYBOARD */
  await page.click('.tab[data-view="quiz"]');
  await page.waitForTimeout(150);
  await page.keyboard.press('2');
  await page.waitForTimeout(100);
  check(await page.isVisible('#quiz-feedback'), 'pressing 2 answers the quiz question');
  check(await page.$$eval('#quiz-choices .choice.right, #quiz-choices .choice.wrong', e => e.length) >= 1,
    'keyboard answer is marked like a click');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  check(await page.isHidden('#quiz-feedback'), 'Enter advances to the next quiz question');
  await page.keyboard.press('c');
  await page.waitForTimeout(100);
  check(await page.isVisible('#quiz-feedback'), 'pressing C answers the quiz question');

  await page.click('.tab[data-view="exam"]');
  await page.selectOption('#exam-mode', 'state');
  await page.click('#exam-start');
  await page.waitForTimeout(300);
  await page.keyboard.press('b');
  await page.waitForTimeout(100);
  check(await page.$$eval('#exam-choices .choice.selected', e => e.length) === 1, 'pressing B selects an exam answer');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(100);
  check(/Question 2 of/.test(await page.textContent('#exam-count')), 'right arrow moves to the next exam question');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(100);
  check(/Question 1 of/.test(await page.textContent('#exam-count')), 'left arrow moves back');
  // typing in the drill's answer box must NOT trigger shortcuts
  await page.click('.tab[data-view="drill"]');
  await page.waitForTimeout(150);
  await page.fill('#drill-input', '');
  await page.focus('#drill-input');
  await page.keyboard.type('1234');
  check(await page.inputValue('#drill-input') === '1234', 'digits typed into the answer box are not hijacked');

  /* ============================================================ RETRY MISSED */
  await page.goto(URL + '?state=MN&v=e#exam');
  await page.waitForTimeout(300);
  await page.selectOption('#exam-mode', 'state');
  await page.click('#exam-start');
  await page.waitForTimeout(300);
  await page.click('#exam-submit');                       // all 40 blank -> all missed
  await page.waitForTimeout(300);
  const retryTxt = await page.textContent('#exam-retry').catch(() => '');
  check(/Drill the 40 you missed/.test(retryTxt), 'results offer to drill the missed questions', retryTxt);
  await page.click('#exam-retry');
  await page.waitForTimeout(200);
  check(await page.isVisible('#view-quiz'), 'retry button opens the quiz');
  check(/missed on your exam/.test(await page.textContent('#quiz-count')) &&
    /1 of 40/.test(await page.textContent('#quiz-count')), 'quiz is loaded with exactly the 40 missed questions');
  check(await page.evaluate(() => location.hash) === '#quiz', 'retry updates the URL fragment');

  check(errors.length === 0, 'no JS errors across the whole run', errors.join(' | '));

  await browser.close();
  console.log('\n' + (fails ? fails + ' FAILURES' : 'all browser checks passed'));
  process.exit(fails ? 1 : 0);
})();
