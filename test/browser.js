/* End-to-end test in real Chromium. Run: node test/browser.js */
const { chromium } = require('playwright-core');
const path = require('path');

const URL = 'file://' + path.join(__dirname, '..', 'index.html');
let fails = 0;
const check = (cond, label, extra) => {
  if (cond) console.log('  ok  ' + label);
  else { fails++; console.log('  FAIL ' + label + (extra ? ' -> ' + extra : '')); }
};

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(URL);
  await page.waitForTimeout(300);

  /* ---------------------------------------------------------- boot */
  check(errors.length === 0, 'page loads with no JS errors', errors.join(' | '));
  check(await page.isVisible('#view-drill'), 'math drill is the default view');
  check((await page.textContent('#drill-q')).length > 40, 'a math problem rendered');

  /* ------------------------------------------------- drill: wrong then right */
  await page.fill('#drill-input', '1');
  await page.click('#drill-check');
  check((await page.textContent('#drill-feedback')).includes('Not quite'), 'wrong answer is rejected');
  check(await page.isVisible('#drill-work'), 'worked solution appears after answering');
  const stepCount = await page.$$eval('#drill-steps li', els => els.length);
  check(stepCount >= 1, 'solution shows numbered steps (' + stepCount + ')');

  await page.click('#drill-next');
  // read the correct answer straight out of the app and submit it
  let ans = await page.evaluate(() => window.__p ? null : null);
  // expose the current problem for the test by recomputing through MathGen is not
  // possible (state is closed over), so instead drive the reveal path:
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
  check(await page.inputValue('#quiz-portion') === 'national',
    'quiz defaults to the national portion');

  // switching portion must rebuild the category list to that portion's topics
  const natCats = await page.$$eval('#quiz-cat option', o => o.map(e => e.value));
  await page.selectOption('#quiz-portion', 'state');
  await page.waitForTimeout(100);
  const stCats = await page.$$eval('#quiz-cat option', o => o.map(e => e.value));
  check(natCats.includes('Transfer of Title') && !stCats.includes('Transfer of Title'),
    'category list follows the selected portion');
  check(stCats.some(c => c.startsWith('MN')) && !natCats.some(c => c.startsWith('MN')),
    'MN categories appear only under the state portion');

  // every question served under a portion filter must belong to that portion
  await page.selectOption('#quiz-portion', 'national');
  await page.waitForTimeout(100);
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
  await page.selectOption('#exam-mins', '240');
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

  check(errors.length === 0, 'no JS errors across the whole run', errors.join(' | '));

  await browser.close();
  console.log('\n' + (fails ? fails + ' FAILURES' : 'all browser checks passed'));
  process.exit(fails ? 1 : 0);
})();
