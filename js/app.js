/* ==========================================================================
   app.js — UI + state for the MN Real Estate Salesperson practice app
   No dependencies, no build step, no network. Progress lives in localStorage.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var STORE = 'mnre.practice.v1';

  /* ------------------------------------------------------------ storage */
  var blank = { math: {}, quiz: {}, exams: [], totals: { mathSeen: 0, mathRight: 0, quizSeen: 0, quizRight: 0 } };
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return JSON.parse(JSON.stringify(blank));
      var s = JSON.parse(raw);
      s.math = s.math || {}; s.quiz = s.quiz || {}; s.exams = s.exams || [];
      s.totals = s.totals || { mathSeen: 0, mathRight: 0, quizSeen: 0, quizRight: 0 };
      return s;
    } catch (e) { return JSON.parse(JSON.stringify(blank)); }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }
  function record(bucket, key, right) {
    var b = state[bucket];
    if (!b[key]) b[key] = { seen: 0, right: 0 };
    b[key].seen++;
    if (right) b[key].right++;
    state.totals[bucket + 'Seen']++;
    if (right) state.totals[bucket + 'Right']++;
    save();
  }

  /* ------------------------------------------------------------ state */
  /* Which state's exam is being practiced. The national portion is identical
     in both; the state bank, exam shape, passing standards, and the MN-only
     tax drills all follow this switch. Persisted so the choice sticks. */
  var STATE_KEY = 'mnre.practice.state';
  var appState = (function () {
    try { return localStorage.getItem(STATE_KEY) === 'ND' ? 'ND' : 'MN'; } catch (e) { return 'MN'; }
  })();

  var EXAM = {
    MN: { name: 'Minnesota', abbr: 'MN', nat: 80, st: 40, natPass: 0.75, stPass: 0.75,
      natMins: 160, fullMins: 240, provider: 'PSI' },
    ND: { name: 'North Dakota', abbr: 'ND', nat: 100, st: 40, natPass: 0.70, stPass: 0.75,
      natMins: 150, fullMins: 240, provider: 'PSI' }
  };
  function cfg() { return EXAM[appState]; }

  function setState(st) {
    if (st !== 'MN' && st !== 'ND') return;
    appState = st;
    try { localStorage.setItem(STATE_KEY, st); } catch (e) { /* private mode */ }
    applyState();
  }

  /* Re-render everything that depends on the state. Safe to call at boot and
     after every switch. A running exam keeps its questions; the NEXT exam
     picks up the new state. */
  function applyState() {
    var c = cfg();
    renderChips($('#state-switch'), [
      { value: 'MN', label: 'Minnesota' },
      { value: 'ND', label: 'North Dakota' }
    ], appState, setState);

    $('#app-title').textContent = c.name + ' Real Estate Salesperson — Exam Practice';
    $('#app-sub').innerHTML = (c.nat + c.st) + ' questions on the real exam: ' + c.nat + ' national + ' +
      c.st + ' ' + c.name + '. You need ' + Math.round(c.natPass * 100) + '% on national and ' +
      Math.round(c.stPass * 100) + '% on state, scored separately.';

    $('#exam-intro').innerHTML = 'The real ' + c.name + ' exam (' + c.provider + ') is ' + c.nat +
      ' national + ' + c.st + ' state questions, each section scored on its own. National needs <b>' +
      Math.round(c.natPass * 100) + '%</b> (' + Math.ceil(c.nat * c.natPass) + ' of ' + c.nat +
      '); state needs <b>' + Math.round(c.stPass * 100) + '%</b> (' + Math.ceil(c.st * c.stPass) +
      ' of ' + c.st + '). <b>If you already passed one section, you only retake the other</b>, so you ' +
      'can drill just that one here.';
    var modeSel = $('#exam-mode');
    modeSel.options[0].text = 'National only — ' + c.nat + ' questions';
    modeSel.options[1].text = 'Full exam — ' + c.nat + ' national + ' + c.st + ' state';
    modeSel.options[2].text = c.abbr + ' state only — ' + c.st + ' questions';
    var minSel = $('#exam-mins');
    minSel.options[0].text = c.natMins + ' minutes (national pace)';
    minSel.options[1].text = c.fullMins + ' minutes (full exam)';

    $$('[data-state]').forEach(function (el) {
      el.classList.toggle('show', el.dataset.state === appState);
    });

    drillCat = 'All';
    fillDrillCats();
    fillDrillTypes();
    newDrill();
    quizCat = 'All';
    fillQuizPortions();
    fillQuizCats();
    startQuiz();
    $$('.qcount').forEach(function (e) { e.textContent = QBank.countFor(appState); });
    $$('.gcount').forEach(function (e) { e.textContent = MathGen.forState(appState).length; });
  }

  /* ------------------------------------------------------------ tabs */
  function showView(name) {
    $$('.view').forEach(function (v) { v.hidden = v.id !== 'view-' + name; });
    $$('.tab').forEach(function (t) {
      var on = t.dataset.view === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (name === 'progress') renderProgress();
    window.scrollTo(0, 0);
  }
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () { showView(t.dataset.view); });
  });

  /* ======================================================================
     MATH DRILL
     ====================================================================== */
  var drill = { p: null, answered: false, streak: 0, best: 0, session: { seen: 0, right: 0 } };

  /* Render a row of topic chips. Each shows how many items it holds so the
     choice is visible at a glance instead of hidden inside a dropdown. */
  function renderChips(container, items, current, onPick) {
    container.innerHTML = items.map(function (it) {
      return '<button class="chip' + (it.value === current ? ' on' : '') + '" data-v="' +
        it.value.replace(/"/g, '&quot;') + '" aria-pressed="' + (it.value === current) + '">' +
        it.label + (it.n === undefined ? '' : '<span class="n">' + it.n + '</span>') + '</button>';
    }).join('');
    $$('.chip', container).forEach(function (b) {
      b.addEventListener('click', function () { onPick(b.dataset.v); });
    });
  }

  var drillCat = 'All';

  function fillDrillCats() {
    var gens = MathGen.forState(appState);
    var items = [{ value: 'All', label: 'All math', n: gens.length }]
      .concat(MathGen.catsForState(appState).map(function (c) {
        return {
          value: c, label: c,
          n: gens.filter(function (g) { return g.cat === c; }).length
        };
      }));
    renderChips($('#drill-cats'), items, drillCat, function (v) {
      drillCat = v;
      fillDrillCats();
      fillDrillTypes();
      newDrill();
    });
  }

  /* The problem-type list follows the chosen topic, so it never offers a type
     that the current topic filter excludes. */
  function fillDrillTypes() {
    var gens = MathGen.forState(appState);
    var pool = drillCat === 'All' ? gens : gens.filter(function (g) { return g.cat === drillCat; });
    $('#drill-type').innerHTML =
      '<option value="">Any ' + (drillCat === 'All' ? 'problem type' : drillCat.toLowerCase() + ' problem') + '</option>' +
      pool.map(function (g) {
        return '<option value="' + g.id + '">' + g.name + '</option>';
      }).join('');
  }

  function weakestGenIds(n) {
    var scored = MathGen.forState(appState).map(function (g) {
      var s = state.math[g.id] || { seen: 0, right: 0 };
      // unseen counts as maximally weak; otherwise accuracy, ties broken by low volume
      var acc = s.seen ? s.right / s.seen : -1;
      return { id: g.id, acc: acc, seen: s.seen };
    });
    scored.sort(function (a, b) {
      if (a.acc !== b.acc) return a.acc - b.acc;
      return a.seen - b.seen;
    });
    return scored.slice(0, n).map(function (x) { return x.id; });
  }

  function newDrill(forceId) {
    var p;
    if (forceId) p = MathGen.fromId(forceId);
    else if ($('#drill-weak').checked) {
      var weak = weakestGenIds(8);
      p = MathGen.fromId(weak[Math.floor(Math.random() * weak.length)]);
    } else p = MathGen.random(drillCat, appState);

    drill.p = p; drill.answered = false;
    $('#drill-tag').textContent = p.cat + '  •  ' + p.genName;
    $('#drill-q').innerHTML = p.q;
    $('#drill-input').value = '';
    $('#drill-input').disabled = false;
    $('#drill-hint-unit').textContent = unitHint(p.unit);
    $('#drill-feedback').hidden = true;
    $('#drill-feedback').className = 'feedback';
    $('#drill-work').hidden = true;
    $('#drill-check').hidden = false;
    $('#drill-next').hidden = true;
    $('#drill-formula').textContent = p.formula;
    $('#drill-input').focus();
  }

  function unitHint(u) {
    switch (u) {
      case 'money': return 'Answer in dollars (e.g. 12500 or $12,500.00)';
      case 'money2': return 'Answer in dollars and cents (e.g. 4.25)';
      case 'percent': return 'Answer as a percent (e.g. 6.5)';
      case 'acres': return 'Answer in acres';
      case 'sqft': return 'Answer in square feet';
      default: return 'Enter a number';
    }
  }

  function checkDrill() {
    if (drill.answered) return;
    var p = drill.p;
    var val = MathGen.parseAnswer($('#drill-input').value);
    if (isNaN(val)) { $('#drill-input').focus(); return; }

    var ok = Math.abs(val - p.answer) <= p.tol;
    drill.answered = true;
    drill.session.seen++;
    if (ok) { drill.session.right++; drill.streak++; drill.best = Math.max(drill.best, drill.streak); }
    else drill.streak = 0;
    record('math', p.genId, ok);

    var fb = $('#drill-feedback');
    fb.hidden = false;
    fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = ok
      ? '<b>Correct.</b> ' + MathGen.fmt(p.answer, p.unit)
      : '<b>Not quite.</b> You answered ' + MathGen.fmt(val, p.unit) +
        '. The correct answer is <b>' + MathGen.fmt(p.answer, p.unit) + '</b>.';

    $('#drill-steps').innerHTML = p.steps.map(function (s, i) {
      return '<li><span class="stepn">' + (i + 1) + '</span><span>' + s + '</span></li>';
    }).join('');
    $('#drill-tip').innerHTML = '<b>Watch out:</b> ' + p.tip;
    $('#drill-work').hidden = false;
    $('#drill-input').disabled = true;
    $('#drill-check').hidden = true;
    $('#drill-next').hidden = false;
    $('#drill-next').focus();
    updateDrillScore();
  }

  function updateDrillScore() {
    var s = drill.session;
    $('#drill-score').textContent = s.seen
      ? s.right + ' / ' + s.seen + ' this session  •  streak ' + drill.streak + ' (best ' + drill.best + ')'
      : '';
  }

  $('#drill-check').addEventListener('click', checkDrill);
  $('#drill-next').addEventListener('click', function () { newDrill($('#drill-type').value || null); });
  $('#drill-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); drill.answered ? newDrill($('#drill-type').value || null) : checkDrill(); }
  });
  $('#drill-reveal').addEventListener('click', function () {
    if (drill.answered) return;
    drill.answered = true;
    var p = drill.p;
    record('math', p.genId, false);
    drill.streak = 0;
    $('#drill-feedback').hidden = false;
    $('#drill-feedback').className = 'feedback bad';
    $('#drill-feedback').innerHTML = '<b>Answer:</b> ' + MathGen.fmt(p.answer, p.unit) +
      ' <span class="muted">(counted as missed — try the same type again)</span>';
    $('#drill-steps').innerHTML = p.steps.map(function (s, i) {
      return '<li><span class="stepn">' + (i + 1) + '</span><span>' + s + '</span></li>';
    }).join('');
    $('#drill-tip').innerHTML = '<b>Watch out:</b> ' + p.tip;
    $('#drill-work').hidden = false;
    $('#drill-input').disabled = true;
    $('#drill-check').hidden = true;
    $('#drill-next').hidden = false;
    updateDrillScore();
  });
  $('#drill-again').addEventListener('click', function () { newDrill(drill.p ? drill.p.genId : null); });
  $('#drill-type').addEventListener('change', function () { newDrill($('#drill-type').value || null); });
  $('#drill-weak').addEventListener('change', function () { newDrill(); });

  /* ======================================================================
     QUIZ
     ====================================================================== */
  var quiz = { list: [], i: 0, answered: false, session: { seen: 0, right: 0 } };

  var quizPortion = 'national';
  var quizCat = 'All';

  function fillQuizPortions() {
    renderChips($('#quiz-portions'), [
      { value: 'national', label: 'National', n: QBank.byPortion('national', appState).length },
      { value: 'state', label: appState + ' state', n: QBank.byPortion('state', appState).length },
      { value: 'All', label: 'Both', n: QBank.countFor(appState) }
    ], quizPortion, function (v) {
      quizPortion = v;
      quizCat = 'All';
      fillQuizPortions();
      fillQuizCats();
      startQuiz();
    });
  }

  /* Topic chips depend on the chosen portion — MN statute topics are
     meaningless when drilling the national section, and vice versa. */
  function fillQuizCats() {
    var cats = QBank.catsFor(quizPortion, appState);
    if (cats.indexOf(quizCat) < 0) quizCat = 'All';
    var items = [{ value: 'All', label: 'All topics', n: QBank.filter('All', quizPortion, appState).length }]
      .concat(cats.map(function (c) {
        return { value: c, label: c, n: QBank.filter(c, quizPortion, appState).length };
      }));
    renderChips($('#quiz-cats'), items, quizCat, function (v) {
      quizCat = v;
      fillQuizCats();
      startQuiz();
    });
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function startQuiz() {
    var pool = QBank.filter(quizCat, quizPortion, appState);
    if ($('#quiz-missed').checked) {
      var missed = pool.filter(function (x) {
        var s = state.quiz[x.id];
        return s && s.right < s.seen;
      });
      if (missed.length) pool = missed;
    }
    quiz.list = shuffle(pool);
    quiz.i = 0;
    quiz.session = { seen: 0, right: 0 };
    renderQuiz();
  }

  function renderQuiz() {
    if (!quiz.list.length) { $('#quiz-q').textContent = 'No questions in that filter yet.'; return; }
    if (quiz.i >= quiz.list.length) quiz.i = 0;
    var x = quiz.list[quiz.i];
    quiz.answered = false;
    quiz.order = shuffle(x.choices.map(function (c, i) { return i; }));

    $('#quiz-tag').textContent = x.cat + '  •  ' + (x.portion === 'state' ? appState + ' state portion' : 'National portion');
    $('#quiz-count').textContent = (quiz.i + 1) + ' of ' + quiz.list.length;
    $('#quiz-q').innerHTML = x.q;
    $('#quiz-choices').innerHTML = quiz.order.map(function (origIdx, pos) {
      return '<button class="choice" data-orig="' + origIdx + '">' +
        '<span class="letter">' + 'ABCD'[pos] + '</span>' +
        '<span>' + x.choices[origIdx] + '</span></button>';
    }).join('');
    $('#quiz-feedback').hidden = true;
    $('#quiz-next').hidden = true;
    $$('#quiz-choices .choice').forEach(function (b) {
      b.addEventListener('click', function () { answerQuiz(parseInt(b.dataset.orig, 10), b); });
    });
    updateQuizScore();
  }

  function answerQuiz(origIdx, btn) {
    if (quiz.answered) return;
    quiz.answered = true;
    var x = quiz.list[quiz.i];
    var ok = origIdx === x.a;
    quiz.session.seen++;
    if (ok) quiz.session.right++;
    record('quiz', x.id, ok);

    $$('#quiz-choices .choice').forEach(function (b) {
      var oi = parseInt(b.dataset.orig, 10);
      b.disabled = true;
      if (oi === x.a) b.classList.add('right');
      else if (b === btn) b.classList.add('wrong');
    });
    var fb = $('#quiz-feedback');
    fb.hidden = false;
    fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = (ok ? '<b>Correct.</b> ' : '<b>Incorrect.</b> The answer is <b>' +
      x.choices[x.a] + '</b>. ') + '<div class="why">' + x.why + '</div>';
    $('#quiz-next').hidden = false;
    $('#quiz-next').focus();
    updateQuizScore();
  }

  function updateQuizScore() {
    var s = quiz.session;
    $('#quiz-score').textContent = s.seen ? s.right + ' / ' + s.seen + ' this session' : '';
  }

  $('#quiz-next').addEventListener('click', function () { quiz.i++; renderQuiz(); });
  $('#quiz-missed').addEventListener('change', startQuiz);
  $('#quiz-restart').addEventListener('click', startQuiz);

  /* ======================================================================
     EXAM SIMULATOR — 80 national + 40 state, 75% required on EACH
     ====================================================================== */
  var exam = { items: [], answers: [], i: 0, timer: null, endAt: 0, running: false };

  function mathAsMC() {
    var p = MathGen.random('All', appState);
    var ch = MathGen.choicesFor(p);
    return {
      kind: 'math',
      id: 'math:' + p.genId,
      portion: 'national',
      cat: p.cat,
      q: p.q,
      choices: ch.map(function (v) { return MathGen.fmt(v, p.unit); }),
      a: ch.findIndex(function (v) { return Math.abs(v - p.answer) <= p.tol; }),
      why: '<b>' + p.formula + '</b><ol class="mini">' + p.steps.map(function (s) {
        return '<li>' + s + '</li>';
      }).join('') + '</ol><p><b>Watch out:</b> ' + p.tip + '</p>',
      genId: p.genId
    };
  }

  /* Permute a question's choices and remap the answer index. Without this the
     bank's answer key skews heavily toward one letter and the exam is gameable. */
  function withShuffledChoices(x, portion) {
    var order = shuffle(x.choices.map(function (_, i) { return i; }));
    return {
      kind: 'bank', id: x.id, portion: portion, cat: x.cat, q: x.q,
      choices: order.map(function (oi) { return x.choices[oi]; }),
      a: order.indexOf(x.a),
      why: x.why
    };
  }

  /* mode: 'full' (80 national + 40 state), 'national' (80), 'state' (40).
     Since a failed section is retaken alone, drilling one section is realistic. */
  function buildExam(mathCount, mode) {
    mathCount = mathCount === undefined ? 14 : mathCount;
    mode = mode || 'national';
    var c = cfg();
    var out = [];

    if (mode !== 'state') {
      var natPool = QBank.byPortion('national', appState);
      var natN = c.nat;
      var nat = shuffle(natPool);
      while (nat.length < natN - mathCount) nat = nat.concat(shuffle(natPool));
      nat = nat.slice(0, natN - mathCount).map(function (x) {
        return withShuffledChoices(x, 'national');
      });
      for (var i = 0; i < mathCount; i++) nat.push(mathAsMC());
      out = out.concat(shuffle(nat));
    }

    if (mode !== 'national') {
      var stPool = QBank.byPortion('state', appState);
      var st = shuffle(stPool);
      while (st.length < c.st) st = st.concat(shuffle(stPool));  // repeat if bank is short
      st = st.slice(0, c.st).map(function (x) { return withShuffledChoices(x, 'state'); });
      out = out.concat(shuffle(st));
    }

    return out;
  }

  function startExam() {
    var mv = $('#exam-mins').value;
    var mins = mv === 'natpace' ? cfg().natMins : mv === 'fullpace' ? cfg().fullMins : (parseInt(mv, 10) || 240);
    exam.items = buildExam(parseInt($('#exam-math').value, 10), $('#exam-mode').value);
    exam.answers = new Array(exam.items.length).fill(null);
    exam.i = 0;
    exam.running = true;
    exam.endAt = Date.now() + mins * 60000;
    $('#exam-setup').hidden = true;
    $('#exam-run').hidden = false;
    $('#exam-results').hidden = true;
    if (exam.timer) clearInterval(exam.timer);
    exam.timer = setInterval(tickExam, 500);
    tickExam();
    renderExam();
  }

  function tickExam() {
    var left = Math.max(0, exam.endAt - Date.now());
    var m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    $('#exam-clock').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    $('#exam-clock').classList.toggle('warn', left < 15 * 60000);
    if (left <= 0) finishExam();
  }

  function renderExam() {
    var x = exam.items[exam.i];
    $('#exam-count').textContent = 'Question ' + (exam.i + 1) + ' of ' + exam.items.length;
    $('#exam-tag').textContent = (x.portion === 'state' ? appState + ' state' : 'National') + '  •  ' + x.cat;
    $('#exam-q').innerHTML = x.q;
    $('#exam-choices').innerHTML = x.choices.map(function (c, i) {
      var sel = exam.answers[exam.i] === i ? ' selected' : '';
      return '<button class="choice' + sel + '" data-i="' + i + '">' +
        '<span class="letter">' + 'ABCD'[i] + '</span><span>' + c + '</span></button>';
    }).join('');
    $$('#exam-choices .choice').forEach(function (b) {
      b.addEventListener('click', function () {
        exam.answers[exam.i] = parseInt(b.dataset.i, 10);
        renderExam();
        renderExamGrid();
      });
    });
    $('#exam-prev').disabled = exam.i === 0;
    $('#exam-nextq').disabled = exam.i === exam.items.length - 1;
    renderExamGrid();
  }

  function renderExamGrid() {
    var answered = exam.answers.filter(function (a) { return a !== null; }).length;
    $('#exam-progress').textContent = answered + ' answered, ' + (exam.items.length - answered) + ' left';
    $('#exam-grid').innerHTML = exam.items.map(function (x, i) {
      var cls = 'gridbtn' + (exam.answers[i] !== null ? ' done' : '') + (i === exam.i ? ' cur' : '');
      return '<button class="' + cls + '" data-i="' + i + '">' + (i + 1) + '</button>';
    }).join('');
    $$('#exam-grid .gridbtn').forEach(function (b) {
      b.addEventListener('click', function () { exam.i = parseInt(b.dataset.i, 10); renderExam(); });
    });
  }

  function finishExam() {
    if (!exam.running) return;
    exam.running = false;
    clearInterval(exam.timer);

    var natR = 0, natT = 0, stR = 0, stT = 0, byCat = {};
    exam.items.forEach(function (x, i) {
      var ok = exam.answers[i] === x.a;
      if (x.portion === 'state') { stT++; if (ok) stR++; } else { natT++; if (ok) natR++; }
      if (!byCat[x.cat]) byCat[x.cat] = { r: 0, t: 0 };
      byCat[x.cat].t++; if (ok) byCat[x.cat].r++;
      if (x.kind === 'bank') record('quiz', x.id, ok);
      else record('math', x.genId, ok);
    });

    // A section that was not part of this exam must not count as failed.
    // Passing standards differ by state (ND national is 70%, everything else 75%).
    var c = cfg();
    var natPass = natT === 0 || natR / natT >= c.natPass;
    var stPass = stT === 0 || stR / stT >= c.stPass;
    var passed = natPass && stPass;

    state.exams.push({
      date: new Date().toISOString().slice(0, 10), st: appState,
      natR: natR, natT: natT, stR: stR, stT: stT, pass: passed
    });
    save();

    $('#exam-run').hidden = true;
    $('#exam-results').hidden = false;
    $('#exam-verdict').className = 'verdict ' + (passed ? 'ok' : 'bad');
    var failed = [];
    if (natT && !natPass) failed.push('national');
    if (stT && !stPass) failed.push(c.name);
    $('#exam-verdict').innerHTML = passed
      ? '<b>PASS</b> — ' + (natT && stT ? 'both sections cleared their passing score.' : 'cleared the passing score.')
      : '<b>NOT YET</b> — the ' + failed.join(' and ') +
        (failed.length > 1 ? ' sections are' : ' section is') + ' below the passing score.';

    $('#exam-breakdown').innerHTML =
      (natT ? scoreRow('National portion', natR, natT, Math.ceil(natT * c.natPass), c.natPass) : '') +
      (stT ? scoreRow(c.name + ' state portion', stR, stT, Math.ceil(stT * c.stPass), c.stPass) : '') +
      '<p class="muted">Each section is scored separately on the real exam. ' +
      'Whichever section you already passed is the one you do not have to retake.</p>';

    var cats = Object.keys(byCat).sort(function (a, b) {
      return (byCat[a].r / byCat[a].t) - (byCat[b].r / byCat[b].t);
    });
    $('#exam-cats').innerHTML = '<h3>By topic — weakest first</h3>' + cats.map(function (c) {
      var v = byCat[c], pct = Math.round(v.r / v.t * 100);
      return '<div class="bar"><span class="barlabel">' + c + '</span>' +
        '<span class="bartrack"><span class="barfill ' + (pct >= 75 ? 'good' : 'poor') +
        '" style="width:' + pct + '%"></span></span>' +
        '<span class="barval">' + v.r + '/' + v.t + '</span></div>';
    }).join('');

    var missed = exam.items.map(function (x, i) { return { x: x, i: i }; })
      .filter(function (o) { return exam.answers[o.i] !== o.x.a; });
    $('#exam-review').innerHTML = '<h3>Review the ' + missed.length + ' you missed</h3>' +
      (missed.length === 0 ? '<p class="muted">Nothing missed. Clean sheet.</p>' :
        missed.map(function (o) {
          var picked = exam.answers[o.i];
          return '<details class="rev"><summary>' + (o.i + 1) + '. ' + stripTags(o.x.q).slice(0, 110) +
            '...</summary><div class="revbody"><p>' + o.x.q + '</p>' +
            '<p class="muted">You answered: ' + (picked === null ? '<i>left blank</i>' : o.x.choices[picked]) + '</p>' +
            '<p><b>Correct: ' + o.x.choices[o.x.a] + '</b></p><div class="why">' + o.x.why + '</div></div></details>';
        }).join(''));
  }

  function scoreRow(label, r, t, need, passFrac) {
    var pct = Math.round(r / t * 100);
    var ok = r / t >= passFrac;
    return '<div class="scorerow"><div><b>' + label + '</b><div class="muted">need ' + need +
      ' of ' + t + ' (' + Math.round(passFrac * 100) + '%)</div></div><div class="scorebig ' +
      (ok ? 'good' : 'poor') + '">' + r + '/' + t + '<span>' + pct + '%</span></div></div>';
  }

  function stripTags(s) { return s.replace(/<[^>]*>/g, ''); }

  $('#exam-start').addEventListener('click', startExam);
  $('#exam-prev').addEventListener('click', function () { if (exam.i > 0) { exam.i--; renderExam(); } });
  $('#exam-nextq').addEventListener('click', function () {
    if (exam.i < exam.items.length - 1) { exam.i++; renderExam(); }
  });
  $('#exam-submit').addEventListener('click', function () {
    var left = exam.answers.filter(function (a) { return a === null; }).length;
    if (left && !confirm(left + ' question(s) are still blank. Submit anyway?')) return;
    finishExam();
  });
  $('#exam-again').addEventListener('click', function () {
    $('#exam-results').hidden = true;
    $('#exam-setup').hidden = false;
  });

  /* ======================================================================
     PROGRESS
     ====================================================================== */
  function renderProgress() {
    var t = state.totals;
    $('#prog-summary').innerHTML =
      statCard('Math problems', t.mathSeen, t.mathRight) +
      statCard('Quiz questions', t.quizSeen, t.quizRight);

    // math by generator
    var rows = MathGen.generators.map(function (g) {
      var s = state.math[g.id] || { seen: 0, right: 0 };
      return { name: g.cat + ': ' + g.name, seen: s.seen, right: s.right };
    }).filter(function (r) { return r.seen > 0; });
    rows.sort(function (a, b) { return (a.right / a.seen) - (b.right / b.seen); });

    $('#prog-math').innerHTML = rows.length === 0
      ? '<p class="muted">No math attempted yet. Start with the Math Drill tab.</p>'
      : rows.map(function (r) {
        var pct = Math.round(r.right / r.seen * 100);
        return '<div class="bar"><span class="barlabel">' + r.name + '</span>' +
          '<span class="bartrack"><span class="barfill ' + (pct >= 75 ? 'good' : 'poor') +
          '" style="width:' + pct + '%"></span></span><span class="barval">' +
          r.right + '/' + r.seen + '</span></div>';
      }).join('');

    // quiz by category
    var cats = {};
    QBank.all.forEach(function (x) {
      var s = state.quiz[x.id];
      if (!s || !s.seen) return;
      if (!cats[x.cat]) cats[x.cat] = { seen: 0, right: 0 };
      cats[x.cat].seen += s.seen; cats[x.cat].right += s.right;
    });
    var ck = Object.keys(cats).sort(function (a, b) {
      return (cats[a].right / cats[a].seen) - (cats[b].right / cats[b].seen);
    });
    $('#prog-quiz').innerHTML = ck.length === 0
      ? '<p class="muted">No quiz questions attempted yet.</p>'
      : ck.map(function (c) {
        var v = cats[c], pct = Math.round(v.right / v.seen * 100);
        return '<div class="bar"><span class="barlabel">' + c + '</span>' +
          '<span class="bartrack"><span class="barfill ' + (pct >= 75 ? 'good' : 'poor') +
          '" style="width:' + pct + '%"></span></span><span class="barval">' +
          v.right + '/' + v.seen + '</span></div>';
      }).join('');

    // exam history
    $('#prog-exams').innerHTML = state.exams.length === 0
      ? '<p class="muted">No practice exams taken yet.</p>'
      : '<table class="tbl"><tr><th>Date</th><th>State</th><th>National</th><th>State portion</th><th>Result</th></tr>' +
        state.exams.slice().reverse().map(function (e) {
          var cell = function (r, t) {
            return t ? r + '/' + t + ' (' + Math.round(r / t * 100) + '%)'
              : '<span class="muted">not taken</span>';
          };
          return '<tr><td>' + e.date + '</td><td>' + (e.st || 'MN') + '</td><td>' + cell(e.natR, e.natT) + '</td><td>' +
            cell(e.stR, e.stT) + '</td><td class="' + (e.pass ? 'good' : 'poor') +
            '">' + (e.pass ? 'PASS' : 'not yet') + '</td></tr>';
        }).join('') + '</table>';
  }

  function statCard(label, seen, right) {
    var pct = seen ? Math.round(right / seen * 100) : 0;
    return '<div class="statcard"><div class="statnum ' + (seen && pct >= 75 ? 'good' : '') + '">' +
      (seen ? pct + '%' : '—') + '</div><div class="statlabel">' + label + '</div>' +
      '<div class="muted">' + right + ' right of ' + seen + '</div></div>';
  }

  $('#prog-reset').addEventListener('click', function () {
    if (!confirm('Erase all saved progress? This cannot be undone.')) return;
    state = JSON.parse(JSON.stringify(blank));
    save();
    renderProgress();
  });

  /* ------------------------------------------------------------ boot */
  applyState();
  showView('exam');
})();
