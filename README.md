# Minnesota Real Estate Salesperson — Exam Practice

A practice app built for repeated drilling ahead of the Minnesota real estate
salesperson licensing exam, with the heaviest emphasis on **math**.

Everything runs in the browser. No install, no accounts, no network. Progress is
saved in the browser's local storage on that device only.

## Quick start

**Easiest:** open `dist/mn-real-estate-practice.html`. That is the whole app in one
file — double-click it, email it to yourself, drop it in Google Drive, or open it on
a phone and "Add to Home Screen." It works with no internet connection.

**From source:** open `index.html` in any browser.

## What's in it

### Math Drill (the main event)
**37 problem generators** that build fresh numbers every single time, so the same
problem type can be run over and over without memorizing answers. Every problem
gives a numbered, worked solution and a "watch out" note naming the specific trap
that question type is built around.

Covered: commission splits and working backwards from a commission check, net-to-seller,
seller's net proceeds, MN deed tax, MN mortgage registry tax, tax/rent/insurance
prorations (360- and 365-day, either side owning the closing day), LTV and low
appraisals, discount points, per-diem interest, amortization schedules, payment
factors, PITI, 28/36 qualifying ratios, equity, cap rate and NOI, GRM, cost approach,
appreciation (simple and compound), percent profit, capital gains, mill rates,
acreage, legal-description acreage, triangular lots, price per square foot,
unit conversions, and buyer's cash to close.

Answers are typed in, not picked from a list — you cannot back-solve from the choices.
"Focus on my weak spots" pulls from whichever generators have the worst accuracy.

### Quiz
**232 questions** with explanations — **189 national** and 43 Minnesota. Covers agency,
contracts, property and title, transfer of title, leases and property management, land use
and environmental, finance, valuation, fair housing, antitrust and settlement practice, and
Minnesota statute. Filter by **exam portion** (defaults to national), by topic, or re-drill
only the ones previously missed.

### Practice Exam
Mirrors the real exam's structure: **80 national + 40 Minnesota**, scored as two
separate sections, each needing **75%** (60/80 and 30/40). Because a failed section is
retaken on its own, you can run **national only (80)**, **state only (40)**, or the full
exam. A section you didn't sit is left out of the scoring rather than counted against you.
Timed, with a question grid for jumping around and changing answers. Results break down by
topic, weakest first, and list every missed question with the explanation.

All exam math questions come from the national pool, matching the real exam — the math and
the national section are the same problem.

### Formula Sheet
One-page reference for every formula in the drills, plus the Minnesota numbers worth
memorizing and a short Minnesota-vs-North-Dakota contrast.

## Minnesota figures used

Verified against the Minnesota Department of Revenue and Minnesota Statutes as of
August 2026:

| Item | Value |
| --- | --- |
| State deed tax | 0.0033 of net consideration (0.0034 in Hennepin & Ramsey with the ERF tax); $1.65 if consideration is $3,000 or less |
| Mortgage registry tax | 0.0023 of the principal debt (0.0024 in Hennepin & Ramsey) |
| Property taxes | Paid in arrears, installments May 15 and October 15 |
| Contract for deed cancellation (§ 559.21) | Under 10% paid → 30 days; 10% to under 25% → 60 days; 25%+ → 90 days |
| Foreclosure | Lien theory state; standard redemption 6 months after sheriff's sale |
| Earnest money (§ 82.75) | Into trust within 3 business days of receipt or final acceptance, whichever is later, if the agreement is silent |
| Pre-license education | 90 hours (three 30-hour courses; Course I before the exam) |
| Continuing education | 30 hours per 2-year cycle, at least 15 each year by June 30, including the required module |
| New home warranty (Ch. 327A) | 1 year workmanship / 2 years systems / 10 years major structural |
| Exam | 120 questions (80 national + 40 state), 75% required on each section separately |

Statutes and rates change. Course materials and the current statute always win over
this app.

## Development

```
node test/run.js       # 16,000+ generator and question-bank assertions
node test/browser.js   # end-to-end run in headless Chromium
node build.js          # rebuild dist/mn-real-estate-practice.html
```

`test/run.js` independently recomputes several generators from their own rendered
question text, so a wrong formula fails the build rather than quietly teaching the
wrong method. `test/browser.js` answers a full 120-question exam picking "B" every
time and asserts the score lands near chance — that is the regression guard for
answer-choice shuffling.

Adding a math generator: add one `add(id, name, category, gen)` block in
`js/mathgen.js`. Adding a question: one `q(portion, category, text, choices, answerIndex, why)`
call in `js/questions.js`. Both are picked up automatically.

## Layout

```
index.html                 app shell
css/style.css              styles (light + dark)
js/mathgen.js              37 randomized math generators
js/questions.js            232-question bank (189 national / 43 state)
js/app.js                  drill / quiz / exam / progress logic
build.js                   bundles everything into dist/
dist/                      single-file build
test/                      test suites
```

Study aid only — not legal advice, and no substitute for the official course materials.
