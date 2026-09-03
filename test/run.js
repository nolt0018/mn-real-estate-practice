/* Smoke + sanity tests. Run: node test/run.js */
var fs = require('fs'), path = require('path'), vm = require('vm');

var sandbox = { window: {}, console: console, Math: Math, Date: Date, parseFloat: parseFloat, isFinite: isFinite };
sandbox.global = sandbox;
vm.createContext(sandbox);

['js/mathgen.js', 'js/questions.js'].forEach(function (f) {
  var src = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  vm.runInContext(src, sandbox, { filename: f });
});

var MathGen = sandbox.window.MathGen;
var QBank = sandbox.window.QBank;

var fails = 0, checks = 0;
function fail(msg) { fails++; console.log('  FAIL: ' + msg); }
function ok() { checks++; }

/* ---------------------------------------------------------- math gens */
console.log('Math generators: ' + MathGen.generators.length);
var ITER = 400;

MathGen.generators.forEach(function (g) {
  var seenAnswers = {};
  for (var i = 0; i < ITER; i++) {
    var p;
    try { p = g.gen(); } catch (e) { fail(g.id + ' threw: ' + e.message); break; }

    if (typeof p.q !== 'string' || !p.q.length) fail(g.id + ': empty question');
    if (typeof p.answer !== 'number' || !isFinite(p.answer)) {
      fail(g.id + ': non-finite answer ' + p.answer); break;
    }
    if (!(p.tol > 0)) fail(g.id + ': bad tolerance');
    if (!Array.isArray(p.steps) || p.steps.length < 1) fail(g.id + ': no steps');
    if (!p.formula || !p.tip) fail(g.id + ': missing formula/tip');
    if (/undefined|NaN|\[object/.test(p.q)) fail(g.id + ': junk in question -> ' + p.q.slice(0, 120));
    p.steps.forEach(function (s) {
      if (/undefined|NaN|\[object/.test(s)) fail(g.id + ': junk in step -> ' + s.slice(0, 120));
    });

    // multiple-choice construction must always contain the right answer exactly once
    var ch = MathGen.choicesFor(p);
    if (ch.length !== 4) fail(g.id + ': choicesFor returned ' + ch.length + ' options');
    var hits = ch.filter(function (v) { return Math.abs(v - p.answer) <= p.tol; });
    if (hits.length !== 1) {
      fail(g.id + ': ' + hits.length + ' choices match the answer (need exactly 1) ' +
        JSON.stringify(ch) + ' ans=' + p.answer);
      break;
    }
    var idx = ch.findIndex(function (v) { return Math.abs(v - p.answer) <= p.tol; });
    if (idx < 0) fail(g.id + ': answer not locatable in choices');

    // parse round-trip: the formatted answer must parse back to the answer
    var back = MathGen.parseAnswer(MathGen.fmt(p.answer, p.unit));
    if (isNaN(back)) fail(g.id + ': fmt/parse round trip produced NaN for unit ' + p.unit);
    else if (Math.abs(back - p.answer) > Math.max(p.tol, 0.01)) {
      fail(g.id + ': round trip drift ' + p.answer + ' -> ' + back + ' (unit ' + p.unit + ')');
    }

    seenAnswers[Math.round(p.answer * 100)] = 1;
    ok();
  }
  // randomization check: the same generator must not keep producing one answer.
  // Percent-unit answers legitimately come from a small set of round rates.
  var distinct = Object.keys(seenAnswers).length;
  var floor = g.gen().unit === 'percent' ? 6 : 10;
  if (distinct < floor) fail(g.id + ': only ' + distinct + ' distinct answers in ' + ITER + ' runs');
});

/* -------------------------------------------------- generator math audit
   Independently recompute a few generators to be sure the stated answer is
   the arithmetic the steps describe, not just a self-consistent variable.   */
function approx(a, b, t, label) {
  checks++;
  if (Math.abs(a - b) > t) { fails++; console.log('  FAIL ' + label + ': ' + a + ' vs ' + b); }
}

// deed tax: pull the price and county out of the rendered question and recompute
for (var i = 0; i < 200; i++) {
  var p = MathGen.fromId('mn-deed-tax');
  var m = p.q.match(/sells for \$([\d,]+)/);
  var price = parseFloat(m[1].replace(/,/g, ''));
  // read the county from the property location, NOT the explanatory parenthetical
  // (which always names Hennepin and Ramsey)
  var metro = /<b>(Hennepin|Ramsey) County, Minnesota<\/b>/.test(p.q);
  approx(p.answer, price * (metro ? 0.0034 : 0.0033), 0.01, 'deed tax');
}

// mortgage registry tax
for (i = 0; i < 200; i++) {
  p = MathGen.fromId('mn-mortgage-tax');
  m = p.q.match(/purchases for \$([\d,]+) with an (\d+)% loan-to-value/);
  price = parseFloat(m[1].replace(/,/g, ''));
  var ltv = parseFloat(m[2]);
  var metro2 = /<b>(Hennepin|Ramsey) County, Minnesota<\/b>/.test(p.q);
  approx(p.answer, price * ltv / 100 * (metro2 ? 0.0024 : 0.0023), 0.01, 'registry tax');
}

// net to seller must actually produce the requested net
for (i = 0; i < 200; i++) {
  p = MathGen.fromId('net-to-seller');
  m = p.q.match(/net \$([\d,]+)<\/b> after paying a ([\d.]+)% commission and \$([\d,]+)/);
  var net = parseFloat(m[1].replace(/,/g, ''));
  var rate = parseFloat(m[2]);
  var costs = parseFloat(m[3].replace(/,/g, ''));
  approx(p.answer - p.answer * rate / 100 - costs, net, 0.02, 'net to seller round trip');
}

// acreage from legal description
for (i = 0; i < 200; i++) {
  p = MathGen.fromId('section-acres');
  var halves = (p.q.match(/1\/2/g) || []).length;
  var quarters = (p.q.match(/1\/4/g) || []).length;
  var frac = Math.pow(0.5, halves) * Math.pow(0.25, quarters);
  var acres = 640 * frac;
  if (/How many acres/.test(p.q)) approx(p.answer, acres, 0.01, 'section acres');
  else {
    var pm = p.q.match(/sells for \$([\d,]+) per acre/);
    approx(p.answer, acres * parseFloat(pm[1].replace(/,/g, '')), 0.01, 'section value');
  }
}

// qualifying ratios: answer must equal the lower of the two ratios
for (i = 0; i < 200; i++) {
  p = MathGen.fromId('qualifying');
  m = p.q.match(/income is \$([\d,]+) and monthly recurring debts total \$([\d,]+)/);
  var inc = parseFloat(m[1].replace(/,/g, ''));
  var debts = parseFloat(m[2].replace(/,/g, ''));
  approx(p.answer, Math.min(inc * 0.28, inc * 0.36 - debts), 0.01, 'qualifying ratio');
}

// lot acreage
for (i = 0; i < 200; i++) {
  p = MathGen.fromId('lot-acres');
  m = p.q.match(/measures <b>(\d+) feet by (\d+) feet/);
  approx(p.answer, parseFloat(m[1]) * parseFloat(m[2]) / 43560, 0.0001, 'lot acres');
}

// tax proration: recompute day count independently
var MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
for (i = 0; i < 300; i++) {
  p = MathGen.fromId('tax-proration');
  m = p.q.match(/taxes are \$([\d,]+),/);
  var taxes = parseFloat(m[1].replace(/,/g, ''));
  var cm = p.q.match(/Closing is (\w+) (\d+)\./);
  var mi = MONTHS.indexOf(cm[1]) + 1, dd = parseFloat(cm[2]);
  var basis = /360-day year/.test(p.q) ? 360 : 365;
  var days;
  if (basis === 360) days = (mi - 1) * 30 + dd;
  else { days = dd; for (var k = 0; k < mi - 1; k++) days += MDAYS[k]; }
  approx(p.answer, taxes / basis * days, 0.01, 'tax proration');
}

/* ------------------------------------------------------------- q bank */
console.log('Quiz questions: ' + QBank.count +
  ' (national ' + QBank.byPortion('national').length +
  ', state ' + QBank.byPortion('state').length + ')');

if (QBank.byPortion('state').length < 40) {
  fail('state bank has ' + QBank.byPortion('state').length + ' — a 40-question state section will repeat');
}
// The national section is the one being drilled hardest, so it needs enough
// depth that a full 80-question exam is not near-total repetition.
if (QBank.byPortion('national').length < 150) {
  fail('national bank has only ' + QBank.byPortion('national').length +
    ' — too shallow to drill the national section repeatedly');
}

// portion filtering must actually partition the bank
checks++;
if (QBank.filter('All', 'national').length + QBank.filter('All', 'state').length !== QBank.count) {
  fails++; console.log('  FAIL: portion filter does not partition the bank');
}
QBank.catsFor('national').forEach(function (c) {
  checks++;
  if (QBank.filter(c, 'national').length === 0) {
    fails++; console.log('  FAIL: catsFor(national) offers "' + c + '" but it yields no questions');
  }
});
QBank.catsFor('state').forEach(function (c) {
  checks++;
  if (QBank.filter(c, 'state').length === 0) {
    fails++; console.log('  FAIL: catsFor(state) offers "' + c + '" but it yields no questions');
  }
});

var ids = {};
QBank.all.forEach(function (x) {
  if (ids[x.id]) fail('duplicate id ' + x.id);
  ids[x.id] = 1;
  if (!x.q || !x.q.length) fail(x.id + ': empty question');
  if (!Array.isArray(x.choices) || x.choices.length !== 4) fail(x.id + ': needs exactly 4 choices');
  if (!(x.a >= 0 && x.a < 4)) fail(x.id + ': answer index out of range');
  if (!x.why || x.why.length < 20) fail(x.id + ': explanation too thin');
  if (['national', 'state'].indexOf(x.portion) < 0) fail(x.id + ': bad portion');
  var seen = {};
  x.choices.forEach(function (c) {
    if (seen[c]) fail(x.id + ': duplicate choice "' + c + '"');
    seen[c] = 1;
    if (!c || !c.length) fail(x.id + ': empty choice');
  });
  ok();
});

/* ------------------------------------------------------------ states
   The national portion is shared; each state's own law must be sealed off
   from the other. A Minnesota question served under North Dakota (or vice
   versa) would teach the wrong statute for the exam being sat.            */
function eq(a, b, label) {
  checks++;
  if (a !== b) { fails++; console.log('  FAIL ' + label + ': ' + a + ' !== ' + b); }
}
var natN = QBank.byPortion('national').length;
var mnSt = QBank.byPortion('state', 'MN'), ndSt = QBank.byPortion('state', 'ND');
console.log('State banks: MN ' + mnSt.length + ', ND ' + ndSt.length);

eq(QBank.countFor('MN'), natN + mnSt.length, 'MN scope = national + MN state');
eq(QBank.countFor('ND'), natN + ndSt.length, 'ND scope = national + ND state');
eq(mnSt.length + ndSt.length, QBank.byPortion('state').length, 'state banks partition the state portion');
eq(mnSt.filter(function (x) { return x.state !== 'MN'; }).length, 0, 'no non-MN question in MN state bank');
eq(ndSt.filter(function (x) { return x.state !== 'ND'; }).length, 0, 'no non-ND question in ND state bank');
eq(QBank.byPortion('national').filter(function (x) { return x.state !== null; }).length, 0,
  'every national question is state-neutral');
if (ndSt.length < 40) fail('ND state bank has ' + ndSt.length + ' — a 40-question ND section will repeat');
QBank.catsFor('state', 'ND').forEach(function (c) {
  eq(QBank.filter(c, 'state', 'ND').length > 0, true, 'ND category "' + c + '" yields questions');
  eq(/^ND /.test(c), true, 'ND category "' + c + '" is labelled as ND');
});
QBank.catsFor('state', 'MN').forEach(function (c) {
  eq(/^ND /.test(c), false, 'MN category "' + c + '" is not an ND category');
});
// national categories are identical under both states
eq(QBank.catsFor('national', 'MN').join('|'), QBank.catsFor('national', 'ND').join('|'),
  'national categories identical under both states');

// North Dakota bans transfer taxes, so the MN tax drills must vanish under ND
var mnGens = MathGen.forState('MN'), ndGens = MathGen.forState('ND');
eq(mnGens.length, MathGen.generators.length, 'MN gets every generator');
eq(ndGens.length, MathGen.generators.length - 3, 'ND drops exactly the three MN tax generators');
eq(ndGens.some(function (g) { return /^mn-/.test(g.id); }), false, 'no mn-* generator under ND');
eq(mnGens.some(function (g) { return g.id === 'mn-deed-tax'; }), true, 'MN keeps the deed tax drill');
eq(MathGen.catsForState('ND').indexOf('MN Taxes'), -1, 'ND has no "MN Taxes" category');
eq(MathGen.catsForState('MN').indexOf('MN Taxes') >= 0, true, 'MN has the "MN Taxes" category');
for (var si = 0; si < 300; si++) {
  var rp = MathGen.random('All', 'ND');
  if (/^mn-/.test(rp.genId)) { fail('random(All, ND) served ' + rp.genId); break; }
}
ok();
// Content-level guard: no problem served under ND may mention a transfer tax
// anywhere in its text or worked solution, whichever generator produced it.
var taxRe = /deed tax|registry tax|0\.0033|0\.0023/i;
var taxLeaks = {};
ndGens.forEach(function (g) {
  for (var t = 0; t < 60; t++) {
    var gp = MathGen.fromId(g.id, 'ND');
    var text = gp.q + ' ' + gp.steps.join(' ') + ' ' + gp.formula + ' ' + gp.tip;
    if (taxRe.test(text)) { taxLeaks[g.id] = true; break; }
  }
});
eq(Object.keys(taxLeaks).join(','), '', 'no ND-scope generator mentions a transfer tax');
// ...and the same generators under MN must still be able to mention it where relevant
var mnMentions = 0;
for (var t2 = 0; t2 < 60; t2++) {
  var mp = MathGen.fromId('seller-proceeds', 'MN');
  if (taxRe.test(mp.q + mp.steps.join(' '))) { mnMentions++; break; }
}
eq(mnMentions, 1, 'seller-proceeds still includes MN deed tax under MN');

// the ND transfer-tax question must say there is none
var ndTax = ndSt.filter(function (x) { return /transfer tax or deed tax/.test(x.q); })[0];
eq(!!ndTax && /constitutionally prohibited/.test(ndTax.choices[ndTax.a]), true,
  'ND transfer-tax question answers "none"');

// answer position should not be predictable
var pos = [0, 0, 0, 0];
QBank.all.forEach(function (x) { pos[x.a]++; });
console.log('Answer key distribution A/B/C/D: ' + pos.join(' / '));

console.log('\n' + checks + ' checks run, ' + fails + ' failures.');
process.exit(fails ? 1 : 0);
