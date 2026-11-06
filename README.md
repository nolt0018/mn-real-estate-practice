# MN / ND Real Estate Salesperson — Exam Practice

A practice app built for repeated drilling ahead of the **Minnesota** or **North
Dakota** real estate salesperson licensing exam, with the heaviest emphasis on
**math**.

A switch in the header picks the state. The national portion — all the math and
189 national questions — is identical in both. What follows the switch is the state
question bank, the exam shape and passing standards, the formula sheet, and the
Minnesota-only transfer-tax drills (North Dakota constitutionally bans transfer
taxes, so those must not be practiced there). The choice is remembered.

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
**292 questions** with explanations — **189 national**, 43 Minnesota, and 60 North
Dakota. Covers agency,
contracts, property and title, transfer of title, leases and property management, land use
and environmental, finance, valuation, fair housing, antitrust and settlement practice, and
state statute. North Dakota adds deeds, title and claims; minerals, surface and water; license
law; and disclosures — every explanation carries the Century Code cite. Filter by **exam
portion** (defaults to national), by topic, or re-drill only the ones previously missed.

### Practice Exam
Mirrors the real exam's structure. **Minnesota:** 80 national + 40 state, 75% on each
(60/80 and 30/40). **North Dakota:** 100 national + 40 state, with different standards
per section — **70%** national (70/100) but 75% state (30/40). Because a failed section is
retaken on its own, you can run **national only (80)**, **state only (40)**, or the full
exam. A section you didn't sit is left out of the scoring rather than counted against you.
Timed, with a question grid for jumping around and changing answers. Results break down by
topic, weakest first, and list every missed question with the explanation.

All exam math questions come from the national pool, matching the real exam — the math and
the national section are the same problem.

### Formula Sheet
One-page reference for every formula in the drills, plus the state's own numbers worth
memorizing and a Minnesota-vs-North-Dakota border-trap table (regulator, exam shape,
transfer tax, judicial vs non-judicial foreclosure, 6-month vs 60-day redemption, 15 vs
20-year adverse possession, mechanic's vs construction lien, riparian vs prior
appropriation, severed minerals).

## Links and shortcuts

**Deep links.** The tab lives in the URL fragment and the state in the query, so a link
can open exactly where you want it — handy for a Notion embed or a link texted to a phone:

```
https://nolt0018.github.io/mn-real-estate-practice/#drill            math drill
https://nolt0018.github.io/mn-real-estate-practice/#quiz             quiz
https://nolt0018.github.io/mn-real-estate-practice/?state=ND#exam    North Dakota exam
https://nolt0018.github.io/mn-real-estate-practice/?state=MN#quiz    Minnesota quiz
```

Tabs are `#exam`, `#quiz`, `#drill`, `#formulas`, `#progress`. `?state=` pins the state
for that link and overrides the remembered choice.

**Keyboard.** In the quiz and the exam, **1–4** or **A–D** picks an answer, **Enter** or
**→** advances, and **←** goes back in the exam. Shortcuts are ignored while typing in a
field, so the math drill's answer box is unaffected.

**After an exam.** The results page offers *Drill the N you missed*, which loads exactly
those questions into the quiz. Missed math problems are randomized, so they are queued
instead under *Focus on my weak spots* in the Math Drill.

## State figures used

### North Dakota

Verified against the North Dakota Century Code, the ND Real Estate Commission, and the
ND Constitution:

| Item | Value |
| --- | --- |
| Exam (PSI) | 100 national + 40 state; **70%** national (70/100), 75% state (30/40), scored separately |
| Transfer / mortgage tax | **None** — N.D. Const. art. X, § 27 (Measure 2, 2014) prohibits any transfer or mortgage tax |
| Regulator | North Dakota Real Estate Commission, N.D.C.C. ch. 43-23 |
| Trust account | Broker may keep up to $500 of personal funds to cover service charges |
| Foreclosure (ch. 32-19) | Judicial; 30-day pre-foreclosure notice to cure; 60-day redemption for most residential property |
| Adverse possession | Generally 20 years |
| Dormant Mineral Act (ch. 38-18.1) | Severed minerals unused 20 years may lapse to the surface owner; preserved by production, recorded lease/deed, or statement of claim |
| Surface Damage Compensation Act | ch. 38-11.1 |
| Pore space | Belongs to the surface owner (ch. 47-31) |
| Water | Prior appropriation under state permit |

### Minnesota

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
css/style.css              styles (light + dark, state-scoped formula blocks)
js/mathgen.js              37 randomized math generators
js/questions.js            292-question bank (189 national / 43 MN / 60 ND)
js/app.js                  drill / quiz / exam / progress logic
build.js                   bundles everything into dist/
dist/                      single-file build
test/                      test suites
```

Study aid only — not legal advice, and no substitute for the official course materials.
