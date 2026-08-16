/* ==========================================================================
   mathgen.js — randomized real estate math problem generators
   Every generator returns a fresh problem with new numbers each call, so the
   same drill can be run forever without memorizing answers.

   Each generator: { id, name, cat, gen() -> problem }
   A problem: {
     q       : question text (may contain simple HTML)
     answer  : correct numeric value
     unit    : 'money' | 'money2' | 'percent' | 'number' | 'acres' | 'sqft' | 'years'
     tol     : accepted +/- tolerance
     formula : the rule being tested
     steps   : array of worked-solution lines
     tip     : the trap most people fall into
     traps   : (optional) plausible wrong answers, used to build multiple choice
   }
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  function rnd(min, max, step) {
    step = step || 1;
    var n = Math.floor((max - min) / step) + 1;
    return min + step * Math.floor(Math.random() * n);
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function r2(n) { return Math.round(n * 100) / 100; }

  function money(n) {
    var neg = n < 0;
    var s = '$' + Math.abs(r2(n)).toLocaleString('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    return neg ? '-' + s : s;
  }
  function money0(n) {
    var neg = n < 0;
    var s = '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
    return neg ? '-' + s : s;
  }
  function num(n) { return n.toLocaleString('en-US'); }
  function pctStr(n) { return (Math.round(n * 1000) / 1000) + '%'; }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  /* Days elapsed from Jan 1 through month m (1-12), day d, inclusive. */
  function daysElapsed(m, d, basis) {
    if (basis === 360) return (m - 1) * 30 + d;
    var t = 0;
    for (var i = 0; i < m - 1; i++) t += MDAYS[i];
    return t + d;
  }

  var MN_METRO = ['Hennepin', 'Ramsey'];
  var MN_OTHER = ['Stearns', 'Olmsted', 'St. Louis', 'Clay', 'Polk', 'Otter Tail',
    'Blue Earth', 'Crow Wing', 'Wright', 'Sherburne'];
  var CITIES = ['Moorhead', 'Fargo-adjacent Dilworth', 'East Grand Forks',
    'St. Cloud', 'Rochester', 'Duluth', 'Mankato', 'Bemidji', 'Alexandria',
    'Brainerd', 'Willmar', 'Winona'];

  var GEN = [];
  function add(id, name, cat, gen) { GEN.push({ id: id, name: name, cat: cat, gen: gen }); }

  /* ====================================================================
     COMMISSION
     ==================================================================== */

  add('comm-split', 'Commission — agent\'s share', 'Commission', function () {
    var price = rnd(180000, 625000, 5000);
    var rate = pick([5, 5.5, 6, 6.5, 7]);
    var coop = pick([50, 50, 50, 60, 40]);          // listing side keeps this %
    var agentSplit = pick([50, 60, 65, 70, 75, 80]);
    var total = price * rate / 100;
    var side = total * coop / 100;
    var agent = side * agentSplit / 100;

    return {
      q: 'A home in ' + pick(CITIES) + ' sells for ' + money0(price) + '. The total commission is ' +
        rate + '%, split ' + coop + '/' + (100 - coop) + ' between the listing brokerage and the ' +
        'cooperating brokerage. The listing agent\'s split with her broker is ' + agentSplit + '/' +
        (100 - agentSplit) + ' in the agent\'s favor. <b>How much does the listing agent receive?</b>',
      answer: agent, unit: 'money', tol: 1,
      formula: 'Sale price x total rate = total commission -> x brokerage side % -> x agent split %',
      steps: [
        'Total commission: ' + money0(price) + ' x ' + rate + '% = ' + money(total),
        'Listing brokerage side: ' + money(total) + ' x ' + coop + '% = ' + money(side),
        'Agent\'s share: ' + money(side) + ' x ' + agentSplit + '% = ' + money(agent)
      ],
      tip: 'Work outside-in, one split at a time. Never multiply the two splits together first ' +
        'and never apply the agent split to the full commission.',
      traps: [total, side, total * agentSplit / 100]
    };
  });

  add('comm-price', 'Commission — find the sale price', 'Commission', function () {
    var rate = pick([5, 6, 7]);
    var agentSplit = pick([50, 60, 70]);
    var price = rnd(200000, 500000, 5000);
    var agent = price * rate / 100 * 0.5 * agentSplit / 100;

    return {
      q: 'An agent received ' + money(agent) + ' on a sale. The total commission was ' + rate +
        '%, the two brokerages split it 50/50, and the agent\'s split with his broker is ' +
        agentSplit + '/' + (100 - agentSplit) + '. <b>What was the sale price?</b>',
      answer: price, unit: 'money', tol: 2,
      formula: 'Work backwards: divide by each split, then divide by the commission rate',
      steps: [
        'Undo the agent split: ' + money(agent) + ' / ' + (agentSplit / 100) + ' = ' +
          money(agent / (agentSplit / 100)) + ' (the brokerage side)',
        'Undo the 50/50 co-op split: ' + money(agent / (agentSplit / 100)) + ' / 0.50 = ' +
          money(price * rate / 100) + ' (total commission)',
        'Undo the rate: ' + money(price * rate / 100) + ' / ' + (rate / 100) + ' = ' + money0(price)
      ],
      tip: 'Going backwards means DIVIDE at every step. If your answer is smaller than the ' +
        'commission you multiplied somewhere.',
      traps: [price / 2, price * 2, agent / (rate / 100)]
    };
  });

  add('net-to-seller', 'Net to seller (the classic trap)', 'Commission', function () {
    var netWanted = rnd(180000, 400000, 1000);
    var rate = pick([5, 6, 7]);
    var costs = rnd(2200, 6800, 100);
    var price = (netWanted + costs) / (1 - rate / 100);

    return {
      q: 'A seller in ' + pick(CITIES) + ' wants to <b>net ' + money0(netWanted) + '</b> after paying a ' +
        rate + '% commission and ' + money0(costs) + ' in closing costs (there is no mortgage payoff). ' +
        '<b>What must the property sell for?</b> Round to the nearest dollar.',
      answer: price, unit: 'money', tol: 2,
      formula: 'Price = (net wanted + costs) / (100% - commission rate)',
      steps: [
        'Add what the seller must cover: ' + money0(netWanted) + ' + ' + money0(costs) + ' = ' +
          money0(netWanted + costs),
        'The seller keeps 100% - ' + rate + '% = ' + (100 - rate) + '% of the price',
        'Price = ' + money0(netWanted + costs) + ' / ' + (1 - rate / 100) + ' = ' + money(price),
        'Check: ' + money(price) + ' x ' + rate + '% = ' + money(price * rate / 100) +
          ' commission; ' + money(price) + ' - ' + money(price * rate / 100) + ' - ' + money0(costs) +
          ' = ' + money(netWanted)
      ],
      tip: 'DIVIDE by (1 - rate). Do NOT add ' + rate + '% to the net — that is the #1 wrong ' +
        'answer on this question type and it is always one of the choices.',
      traps: [(netWanted + costs) * (1 + rate / 100), netWanted / (1 - rate / 100), netWanted + costs]
    };
  });

  add('seller-proceeds', 'Seller\'s net proceeds at closing', 'Commission', function () {
    var price = rnd(220000, 520000, 5000);
    var rate = pick([5, 6, 6.5]);
    var payoff = Math.round(price * rnd(45, 75) / 100 / 1000) * 1000;
    var taxes = rnd(2400, 6000, 60);
    var closeM = rnd(3, 10), closeD = rnd(2, 27);
    var sellerDays = daysElapsed(closeM, closeD, 365);
    var taxShare = taxes / 365 * sellerDays;
    var deed = price * 0.0033;
    var misc = rnd(600, 2400, 50);
    var net = price - price * rate / 100 - payoff - taxShare - deed - misc;

    return {
      q: 'Closing is ' + MONTHS[closeM - 1] + ' ' + closeD + '. Sale price ' + money0(price) +
        '. Commission ' + rate + '%. Loan payoff ' + money0(payoff) + '. Annual real estate taxes ' +
        'of ' + money0(taxes) + ' are paid in arrears and the seller is charged through the day of ' +
        'closing (365-day year). MN state deed tax is 0.0033. Other seller costs ' + money0(misc) +
        '. <b>What are the seller\'s net proceeds?</b>',
      answer: net, unit: 'money', tol: 3,
      formula: 'Net = price - commission - payoff - prorated taxes - deed tax - other costs',
      steps: [
        'Commission: ' + money0(price) + ' x ' + rate + '% = ' + money(price * rate / 100),
        'Tax proration: ' + money0(taxes) + ' / 365 = ' + money(taxes / 365) + '/day x ' +
          sellerDays + ' days (Jan 1 - ' + MONTHS[closeM - 1] + ' ' + closeD + ') = ' + money(taxShare),
        'Deed tax: ' + money0(price) + ' x 0.0033 = ' + money(deed),
        'Net: ' + money0(price) + ' - ' + money(price * rate / 100) + ' - ' + money0(payoff) +
          ' - ' + money(taxShare) + ' - ' + money(deed) + ' - ' + money0(misc) + ' = ' + money(net)
      ],
      tip: 'Taxes paid in arrears means the seller OWES the buyer for the time the seller owned ' +
        'the property — it comes out of the seller\'s proceeds.',
      traps: [net + taxShare, net + deed, price - payoff - price * rate / 100]
    };
  });

  /* ====================================================================
     MINNESOTA TRANSFER TAXES
     ==================================================================== */

  add('mn-deed-tax', 'MN state deed tax', 'MN Taxes', function () {
    var metro = Math.random() < 0.4;
    var county = metro ? pick(MN_METRO) : pick(MN_OTHER);
    var price = rnd(155000, 780000, 1000);
    var rate = metro ? 0.0034 : 0.0033;
    var tax = price * rate;

    return {
      q: 'A property in <b>' + county + ' County, Minnesota</b> sells for ' + money0(price) +
        '. <b>What is the deed tax due?</b> (State deed tax is 0.0033; Hennepin and Ramsey ' +
        'counties add a 0.0001 Environmental Response Fund tax.)',
      answer: tax, unit: 'money', tol: 0.5,
      formula: 'Deed tax = net consideration x 0.0033 (x 0.0034 in Hennepin & Ramsey)',
      steps: [
        county + ' County rate: ' + rate + (metro ? ' (0.0033 state + 0.0001 ERF)' : ' (no ERF tax)'),
        money0(price) + ' x ' + rate + ' = ' + money(tax)
      ],
      tip: 'Deed tax is on the SALE PRICE and is customarily paid by the SELLER. Only Hennepin ' +
        'and Ramsey add the 0.0001 ERF tax. If consideration is $3,000 or less, the tax is $1.65.',
      traps: [price * 0.0023, price * (metro ? 0.0033 : 0.0034), price * 0.033]
    };
  });

  add('mn-mortgage-tax', 'MN mortgage registry tax', 'MN Taxes', function () {
    var metro = Math.random() < 0.4;
    var county = metro ? pick(MN_METRO) : pick(MN_OTHER);
    var price = rnd(200000, 600000, 5000);
    var ltv = pick([80, 85, 90, 95]);
    var loan = price * ltv / 100;
    var rate = metro ? 0.0024 : 0.0023;
    var tax = loan * rate;

    return {
      q: 'A buyer in <b>' + county + ' County, Minnesota</b> purchases for ' + money0(price) +
        ' with an ' + ltv + '% loan-to-value mortgage. <b>What is the mortgage registry tax?</b> ' +
        '(State rate 0.0023; Hennepin and Ramsey add 0.0001 ERF.)',
      answer: tax, unit: 'money', tol: 0.5,
      formula: 'Mortgage registry tax = principal debt secured x 0.0023 (0.0024 in Hennepin & Ramsey)',
      steps: [
        'Loan amount: ' + money0(price) + ' x ' + ltv + '% = ' + money0(loan),
        county + ' County rate: ' + rate,
        money0(loan) + ' x ' + rate + ' = ' + money(tax)
      ],
      tip: 'Registry tax is on the LOAN, not the price, and is customarily paid by the BUYER. ' +
        'Deed tax = seller/price/0.0033. Registry tax = buyer/loan/0.0023. Do not swap them.',
      traps: [price * rate, loan * 0.0033, loan * 0.023]
    };
  });

  add('mn-both-taxes', 'MN deed + registry tax together', 'MN Taxes', function () {
    var county = pick(MN_OTHER);
    var price = rnd(210000, 545000, 5000);
    var down = pick([5, 10, 15, 20]);
    var loan = price * (100 - down) / 100;
    var deed = price * 0.0033;
    var reg = loan * 0.0023;

    return {
      q: 'In ' + county + ' County, Minnesota a buyer purchases a home for ' + money0(price) +
        ' with ' + down + '% down. <b>What is the combined total of the state deed tax and the ' +
        'mortgage registry tax?</b>',
      answer: deed + reg, unit: 'money', tol: 0.5,
      formula: 'Deed tax (price x 0.0033) + registry tax (loan x 0.0023)',
      steps: [
        'Loan: ' + money0(price) + ' x ' + (100 - down) + '% = ' + money0(loan),
        'Deed tax: ' + money0(price) + ' x 0.0033 = ' + money(deed),
        'Registry tax: ' + money0(loan) + ' x 0.0023 = ' + money(reg),
        'Total: ' + money(deed) + ' + ' + money(reg) + ' = ' + money(deed + reg)
      ],
      tip: 'Two different bases. Deed tax uses the price; registry tax uses the loan amount.',
      traps: [price * 0.0033 + price * 0.0023, deed, reg]
    };
  });

  /* ====================================================================
     PRORATIONS
     ==================================================================== */

  add('tax-proration', 'Property tax proration', 'Proration', function () {
    var basis = pick([365, 360]);
    var taxes = basis === 360 ? rnd(2160, 7200, 360) : rnd(2190, 7300, 365);
    var m = rnd(2, 11), d = rnd(3, 27);
    var sellerDays = daysElapsed(m, d, basis);
    var daily = taxes / basis;
    var sellerShare = daily * sellerDays;

    return {
      q: 'Annual real estate taxes are ' + money0(taxes) + ', <b>paid in arrears</b>. Closing is ' +
        MONTHS[m - 1] + ' ' + d + '. The seller is responsible <b>through the day of closing</b>. ' +
        'Using a <b>' + basis + '-day year</b>' + (basis === 360 ? ' (30-day months)' : '') +
        ', <b>what is the seller\'s share of the taxes?</b>',
      answer: sellerShare, unit: 'money', tol: 1,
      formula: 'Daily rate = annual / ' + basis + '; seller\'s days = Jan 1 through closing day',
      steps: [
        'Daily rate: ' + money0(taxes) + ' / ' + basis + ' = ' + money(daily),
        'Seller\'s days: Jan 1 through ' + MONTHS[m - 1] + ' ' + d +
          (basis === 360
            ? ' = (' + (m - 1) + ' months x 30) + ' + d + ' = ' + sellerDays + ' days'
            : ' = ' + sellerDays + ' days'),
        'Seller\'s share: ' + money(daily) + ' x ' + sellerDays + ' = ' + money(sellerShare),
        'Because taxes are paid in arrears this is a <b>debit to the seller / credit to the buyer</b>.'
      ],
      tip: 'Two questions to answer first: (1) how many days in the year — 360 or 365? ' +
        '(2) does the seller own the closing day? Here yes, so count it.',
      traps: [taxes - sellerShare, daily * (sellerDays - 1), taxes / 12 * m]
    };
  });

  add('tax-proration-buyer', 'Tax proration — buyer\'s share', 'Proration', function () {
    var basis = 365;
    var taxes = rnd(2190, 7300, 365);
    var m = rnd(2, 11), d = rnd(3, 27);
    var sellerDays = daysElapsed(m, d, basis) - 1; // buyer owns closing day
    var buyerDays = 365 - sellerDays;
    var daily = taxes / 365;

    return {
      q: 'Annual taxes are ' + money0(taxes) + '. Closing is ' + MONTHS[m - 1] + ' ' + d +
        ' and <b>the buyer is responsible for the day of closing</b>. Using a 365-day year, ' +
        '<b>what is the buyer\'s share of the annual taxes?</b>',
      answer: daily * buyerDays, unit: 'money', tol: 1,
      formula: 'Buyer days = 365 - seller days; seller stops the day BEFORE closing here',
      steps: [
        'Daily rate: ' + money0(taxes) + ' / 365 = ' + money(daily),
        'Seller owns Jan 1 through ' + MONTHS[m - 1] + ' ' + (d - 1) + ' = ' + sellerDays + ' days',
        'Buyer owns 365 - ' + sellerDays + ' = ' + buyerDays + ' days',
        'Buyer\'s share: ' + money(daily) + ' x ' + buyerDays + ' = ' + money(daily * buyerDays)
      ],
      tip: 'Read who owns the closing day. It moves the answer by exactly one day\'s worth — ' +
        'and the exam always offers that off-by-one-day answer as a choice.',
      traps: [daily * (buyerDays - 1), daily * sellerDays, taxes - daily * buyerDays]
    };
  });

  add('rent-proration', 'Rent proration', 'Proration', function () {
    var m = rnd(1, 12), d = rnd(4, 25);
    var dim = MDAYS[m - 1];
    var rent = rnd(950, 2400, 25);
    var units = pick([1, 1, 2, 3, 4]);
    var total = rent * units;
    var buyerDays = dim - d;
    var credit = total / dim * buyerDays;

    return {
      q: 'A ' + (units === 1 ? 'rental home' : units + '-unit building') + ' rents for ' +
        money0(rent) + ' per unit per month, <b>collected in advance on the 1st</b>. The seller ' +
        'collected ' + MONTHS[m - 1] + '\'s rent. Closing is ' + MONTHS[m - 1] + ' ' + d +
        ' and the <b>seller owns the day of closing</b>. Using the actual ' + dim + ' days in ' +
        MONTHS[m - 1] + ', <b>how much rent is credited to the buyer?</b>',
      answer: credit, unit: 'money', tol: 1,
      formula: 'Buyer credit = total rent collected / days in month x days buyer owns',
      steps: [
        'Rent collected: ' + money0(rent) + (units > 1 ? ' x ' + units + ' units = ' + money0(total) : ''),
        'Daily rent: ' + money0(total) + ' / ' + dim + ' = ' + money(total / dim),
        'Buyer\'s days: ' + dim + ' - ' + d + ' = ' + buyerDays + ' days (the ' + (d + 1) +
          'th through the end of the month)',
        'Credit to buyer: ' + money(total / dim) + ' x ' + buyerDays + ' = ' + money(credit)
      ],
      tip: 'Rent is collected IN ADVANCE, so the seller is holding money for days the buyer will ' +
        'own — the buyer gets a credit and the seller gets a debit. Opposite direction from taxes.',
      traps: [total - credit, total / dim * d, credit / units]
    };
  });

  add('insurance-proration', 'Insurance / HOA proration', 'Proration', function () {
    var annual = rnd(900, 2600, 12);
    var m = rnd(2, 11), d = rnd(5, 25);
    var used = daysElapsed(m, d, 360);
    var remaining = 360 - used;
    var refund = annual / 360 * remaining;

    return {
      q: 'A seller prepaid a full year of hazard insurance on January 1 costing ' + money0(annual) +
        '. The buyer assumes the policy at closing on ' + MONTHS[m - 1] + ' ' + d +
        ' (seller owns the closing day). Using a <b>360-day year with 30-day months</b>, ' +
        '<b>how much is the seller reimbursed?</b>',
      answer: refund, unit: 'money', tol: 1,
      formula: 'Prepaid item: seller is credited for the unused portion remaining after closing',
      steps: [
        'Daily: ' + money0(annual) + ' / 360 = ' + money(annual / 360),
        'Seller used: (' + (m - 1) + ' x 30) + ' + d + ' = ' + used + ' days',
        'Unused: 360 - ' + used + ' = ' + remaining + ' days',
        'Credit to seller: ' + money(annual / 360) + ' x ' + remaining + ' = ' + money(refund)
      ],
      tip: 'PREPAID (insurance, HOA dues) -> credit seller. ARREARS (taxes) -> credit buyer. ' +
        'Ask "has this already been paid?" before you pick a direction.',
      traps: [annual - refund, annual / 12 * (12 - m), refund / 2]
    };
  });

  /* ====================================================================
     FINANCE
     ==================================================================== */

  add('ltv', 'Loan-to-value & down payment', 'Finance', function () {
    var price = rnd(165000, 585000, 5000);
    var ltv = pick([75, 80, 85, 90, 95, 97]);
    var loan = price * ltv / 100;

    return {
      q: 'A buyer purchases a home for ' + money0(price) + ' with an <b>' + ltv +
        '% LTV</b> loan. <b>How much cash is the down payment?</b>',
      answer: price - loan, unit: 'money', tol: 1,
      formula: 'Loan = value x LTV; Down payment = price - loan',
      steps: [
        'Loan: ' + money0(price) + ' x ' + ltv + '% = ' + money0(loan),
        'Down payment: ' + money0(price) + ' - ' + money0(loan) + ' = ' + money0(price - loan),
        'Shortcut: the down payment is simply ' + (100 - ltv) + '% of ' + money0(price)
      ],
      tip: 'LTV is the LOAN percentage. The down payment is what is left over: 100% - LTV.',
      traps: [loan, price * ltv / 100 / 2, price * (100 - ltv) / 100 / 2]
    };
  });

  add('ltv-appraisal', 'Low appraisal — loan amount', 'Finance', function () {
    var price = rnd(250000, 500000, 5000);
    var appraisal = price - rnd(5000, 25000, 1000);
    var ltv = pick([80, 90, 95]);
    var loan = appraisal * ltv / 100;
    var cash = price - loan;

    return {
      q: 'A buyer agrees to pay ' + money0(price) + '. The appraisal comes in at ' +
        money0(appraisal) + '. The lender will loan ' + ltv + '% LTV and the buyer proceeds at ' +
        'the contract price. <b>How much cash must the buyer bring?</b>',
      answer: cash, unit: 'money', tol: 1,
      formula: 'Lenders lend on the LESSER of sale price or appraised value',
      steps: [
        'Lender uses the lesser figure: ' + money0(appraisal) + ' (the appraisal)',
        'Loan: ' + money0(appraisal) + ' x ' + ltv + '% = ' + money0(loan),
        'Cash needed: ' + money0(price) + ' - ' + money0(loan) + ' = ' + money0(cash),
        'The buyer covers the ' + money0(price - appraisal) + ' appraisal gap plus the normal down payment.'
      ],
      tip: 'LESSER OF price or appraised value — always. A low appraisal does not lower the price, ' +
        'it raises the buyer\'s cash.',
      traps: [price - price * ltv / 100, price * (100 - ltv) / 100, price - appraisal]
    };
  });

  add('points', 'Discount points', 'Finance', function () {
    var price = rnd(200000, 520000, 5000);
    var ltv = pick([80, 90, 95]);
    var loan = price * ltv / 100;
    var pts = pick([1, 1.5, 2, 2.5, 3]);
    var cost = loan * pts / 100;

    return {
      q: 'A buyer purchases at ' + money0(price) + ' with a ' + ltv + '% LTV loan and pays <b>' +
        pts + ' discount points</b>. <b>What do the points cost?</b>',
      answer: cost, unit: 'money', tol: 1,
      formula: 'One point = 1% of the LOAN amount',
      steps: [
        'Loan: ' + money0(price) + ' x ' + ltv + '% = ' + money0(loan),
        'Points: ' + money0(loan) + ' x ' + pts + '% = ' + money(cost)
      ],
      tip: 'Points are a percentage of the LOAN, never the sale price. Each point paid up front ' +
        'buys down the interest rate (roughly 1/8% per point, but the exam tests the cost).',
      traps: [price * pts / 100, loan * pts / 1000, loan * pts]
    };
  });

  add('per-diem', 'Prepaid (per diem) interest', 'Finance', function () {
    var loan = rnd(160000, 480000, 1000);
    var rate = pick([5.25, 5.5, 5.75, 6, 6.25, 6.5, 7]);
    var m = rnd(1, 12), d = rnd(8, 24);
    var dim = MDAYS[m - 1];
    var days = dim - d + 1; // closing day through end of month
    var daily = loan * rate / 100 / 365;

    return {
      q: 'A loan of ' + money0(loan) + ' at ' + rate + '% closes on ' + MONTHS[m - 1] + ' ' + d +
        '. The lender collects interest <b>from the day of closing through the end of the month</b>. ' +
        'Using a 365-day year, <b>how much prepaid interest is collected?</b>',
      answer: daily * days, unit: 'money', tol: 1,
      formula: 'Per diem = loan x rate / 365; multiply by days of interest',
      steps: [
        'Annual interest: ' + money0(loan) + ' x ' + rate + '% = ' + money(loan * rate / 100),
        'Per diem: ' + money(loan * rate / 100) + ' / 365 = ' + money(daily),
        'Days: ' + MONTHS[m - 1] + ' ' + d + ' through ' + MONTHS[m - 1] + ' ' + dim + ' = ' +
          dim + ' - ' + d + ' + 1 = ' + days + ' days',
        'Prepaid interest: ' + money(daily) + ' x ' + days + ' = ' + money(daily * days)
      ],
      tip: 'Counting "through the end of the month" includes the closing day, so add 1. ' +
        'Mortgage interest is paid in ARREARS, which is why the first payment is skipped a month.',
      traps: [daily * (days - 1), loan * rate / 100 / 360 * days, daily * d]
    };
  });

  add('amort-first', 'Amortization — first payment split', 'Finance', function () {
    var loan = rnd(150000, 425000, 1000);
    var rate = pick([5.5, 6, 6.25, 6.5, 7, 7.5]);
    var pmt = rnd(Math.round(loan * rate / 100 / 12 * 1.18 / 10) * 10,
      Math.round(loan * rate / 100 / 12 * 1.45 / 10) * 10, 10);
    var interest = loan * rate / 100 / 12;
    var principal = pmt - interest;

    return {
      q: 'A ' + money0(loan) + ' loan at <b>' + rate + '%</b> has a monthly principal-and-interest ' +
        'payment of ' + money0(pmt) + '. <b>How much of the FIRST payment goes to principal?</b>',
      answer: principal, unit: 'money', tol: 1,
      formula: 'Interest = balance x annual rate / 12; principal = payment - interest',
      steps: [
        'Annual interest on the full balance: ' + money0(loan) + ' x ' + rate + '% = ' +
          money(loan * rate / 100),
        'One month of interest: ' + money(loan * rate / 100) + ' / 12 = ' + money(interest),
        'Principal portion: ' + money0(pmt) + ' - ' + money(interest) + ' = ' + money(principal),
        'New balance: ' + money0(loan) + ' - ' + money(principal) + ' = ' + money(loan - principal)
      ],
      tip: 'Interest is always computed on the CURRENT balance. Whatever is left of the payment ' +
        'is principal. Early payments are mostly interest.',
      traps: [interest, pmt - interest * 2, loan * rate / 100 / 12 / 12]
    };
  });

  add('amort-second', 'Amortization — second month balance', 'Finance', function () {
    var loan = rnd(180000, 400000, 1000);
    var rate = pick([5.5, 6, 6.5, 7]);
    var pmt = Math.round(loan * rate / 100 / 12 * 1.3 / 10) * 10;
    var i1 = loan * rate / 100 / 12;
    var p1 = pmt - i1;
    var b1 = loan - p1;
    var i2 = b1 * rate / 100 / 12;
    var p2 = pmt - i2;
    var b2 = b1 - p2;

    return {
      q: 'A ' + money0(loan) + ' loan at ' + rate + '% has a monthly P&I payment of ' + money0(pmt) +
        '. <b>What is the loan balance after TWO payments?</b>',
      answer: b2, unit: 'money', tol: 2,
      formula: 'Repeat each month: interest = balance x rate / 12, principal = payment - interest',
      steps: [
        'Month 1 interest: ' + money0(loan) + ' x ' + rate + '% / 12 = ' + money(i1),
        'Month 1 principal: ' + money0(pmt) + ' - ' + money(i1) + ' = ' + money(p1) +
          ' -> balance ' + money(b1),
        'Month 2 interest: ' + money(b1) + ' x ' + rate + '% / 12 = ' + money(i2),
        'Month 2 principal: ' + money0(pmt) + ' - ' + money(i2) + ' = ' + money(p2) +
          ' -> balance ' + money(b2)
      ],
      tip: 'You must recalculate interest on the NEW balance each month. Doubling month one\'s ' +
        'principal gives a wrong (too low) balance.',
      traps: [loan - p1 * 2, b1, loan - pmt * 2]
    };
  });

  add('amort-factor', 'Payment from an amortization factor', 'Finance', function () {
    var loan = rnd(150000, 480000, 1000);
    var factor = pick([5.68, 5.996, 6.32, 6.65, 7.34, 8.05, 6.00]);
    var pmt = loan / 1000 * factor;

    return {
      q: 'Using an amortization factor of <b>' + factor + ' per $1,000</b> of loan, ' +
        '<b>what is the monthly principal-and-interest payment on a ' + money0(loan) + ' loan?</b>',
      answer: pmt, unit: 'money', tol: 1,
      formula: 'Payment = (loan / 1,000) x factor',
      steps: [
        'Thousands: ' + money0(loan) + ' / 1,000 = ' + (loan / 1000),
        'Payment: ' + (loan / 1000) + ' x ' + factor + ' = ' + money(pmt)
      ],
      tip: 'The factor is "dollars of payment per $1,000 borrowed." Divide the loan by 1,000 FIRST.',
      traps: [loan * factor, loan / factor, loan / 1000 * factor * 12]
    };
  });

  add('piti', 'PITI monthly payment', 'Finance', function () {
    var loan = rnd(180000, 420000, 1000);
    var factor = pick([5.99, 6.32, 6.65, 7.34]);
    var pi = loan / 1000 * factor;
    var taxes = rnd(2400, 6600, 60);
    var ins = rnd(900, 2100, 12);
    var pmiRate = pick([0.5, 0.55, 0.62, 0.75]);
    var pmi = loan * pmiRate / 100 / 12;
    var total = pi + taxes / 12 + ins / 12 + pmi;

    return {
      q: 'Loan ' + money0(loan) + '; amortization factor ' + factor + ' per $1,000; annual taxes ' +
        money0(taxes) + '; annual hazard insurance ' + money0(ins) + '; annual PMI of ' + pmiRate +
        '% of the loan. <b>What is the total monthly PITI payment?</b>',
      answer: total, unit: 'money', tol: 2,
      formula: 'PITI = P&I + (taxes / 12) + (insurance / 12) + (PMI / 12)',
      steps: [
        'P&I: ' + (loan / 1000) + ' x ' + factor + ' = ' + money(pi),
        'Taxes: ' + money0(taxes) + ' / 12 = ' + money(taxes / 12),
        'Insurance: ' + money0(ins) + ' / 12 = ' + money(ins / 12),
        'PMI: ' + money0(loan) + ' x ' + pmiRate + '% = ' + money(loan * pmiRate / 100) +
          ' / 12 = ' + money(pmi),
        'Total: ' + money(total)
      ],
      tip: 'Everything must be MONTHLY before you add. Annual figures get divided by 12.',
      traps: [pi + taxes + ins, pi, total - pmi]
    };
  });

  add('qualifying', 'Qualifying ratios (28/36)', 'Finance', function () {
    var income = rnd(4200, 9600, 100);
    var debts = rnd(250, 900, 25);
    var front = income * 0.28;
    var back = income * 0.36 - debts;
    var max = Math.min(front, back);

    return {
      q: 'A buyer\'s gross monthly income is ' + money0(income) + ' and monthly recurring debts ' +
        'total ' + money0(debts) + '. Using <b>28/36 qualifying ratios</b>, <b>what is the maximum ' +
        'monthly PITI payment the buyer qualifies for?</b>',
      answer: max, unit: 'money', tol: 1,
      formula: 'Front-end: income x 28%. Back-end: (income x 36%) - debts. Use the LOWER.',
      steps: [
        'Front-end (housing) ratio: ' + money0(income) + ' x 28% = ' + money(front),
        'Back-end (total debt) ratio: ' + money0(income) + ' x 36% = ' + money(income * 0.36) +
          ' - ' + money0(debts) + ' = ' + money(back),
        'The lender uses the LOWER: ' + money(max) +
          (front < back ? ' (front-end governs)' : ' (back-end governs)')
      ],
      tip: 'Compute BOTH ratios and take the smaller. Remember to subtract other debts from the ' +
        '36% figure — that is the step people forget.',
      traps: [front === max ? back : front, income * 0.36, income * 0.28 - debts]
    };
  });

  add('interest-solve', 'Solve for rate, principal, or time', 'Finance', function () {
    var principal = rnd(60000, 340000, 1000);
    var rate = pick([4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8]);
    var annual = principal * rate / 100;
    var mode = pick(['rate', 'principal', 'months']);

    if (mode === 'rate') {
      return {
        q: 'A straight (interest-only) loan of ' + money0(principal) + ' generates ' + money(annual) +
          ' of interest in one year. <b>What is the interest rate?</b> Answer as a percent.',
        answer: rate, unit: 'percent', tol: 0.02,
        formula: 'Rate = interest / principal',
        steps: [
          money(annual) + ' / ' + money0(principal) + ' = ' + (annual / principal),
          'Move the decimal two places: ' + rate + '%'
        ],
        tip: 'I = P x R x T. Cover the piece you want and the other two tell you to multiply or divide.',
        traps: [rate / 12, rate * 12, rate / 100]
      };
    }
    if (mode === 'principal') {
      return {
        q: 'A straight (interest-only) loan at ' + rate + '% produces ' + money(annual) +
          ' of interest per year. <b>What is the principal?</b>',
        answer: principal, unit: 'money', tol: 2,
        formula: 'Principal = interest / rate',
        steps: [
          money(annual) + ' / ' + (rate / 100) + ' = ' + money0(principal)
        ],
        tip: 'Dividing by a decimal smaller than 1 makes the answer bigger. If your answer shrank, ' +
          'you multiplied.',
        traps: [annual * rate / 100, principal / 12, annual * 12]
      };
    }
    var months = pick([3, 4, 6, 8, 9, 18]);
    var paid = annual / 12 * months;
    return {
      q: 'A straight loan of ' + money0(principal) + ' at ' + rate + '% ran for <b>' + months +
        ' months</b>. <b>How much interest was paid?</b>',
      answer: paid, unit: 'money', tol: 1,
      formula: 'I = P x R x T (T in years, or annual interest / 12 x months)',
      steps: [
        'Annual interest: ' + money0(principal) + ' x ' + rate + '% = ' + money(annual),
        'Monthly: ' + money(annual) + ' / 12 = ' + money(annual / 12),
        months + ' months: ' + money(annual / 12) + ' x ' + months + ' = ' + money(paid)
      ],
      tip: 'Time must match the rate. An annual rate needs the time expressed in years (or ' +
        'convert the interest to monthly first).',
      traps: [annual, annual * months, paid / 2]
    };
  });

  add('equity', 'Owner\'s equity', 'Finance', function () {
    var value = rnd(230000, 560000, 5000);
    var first = Math.round(value * rnd(40, 70) / 100 / 1000) * 1000;
    var second = pick([0, rnd(15000, 55000, 1000)]);
    var lien = pick([0, 0, rnd(3000, 14000, 500)]);
    var equity = value - first - second - lien;

    return {
      q: 'A home is worth ' + money0(value) + '. The owner owes ' + money0(first) +
        ' on the first mortgage' + (second ? ', ' + money0(second) + ' on a home equity loan' : '') +
        (lien ? ', and there is a ' + money0(lien) + ' mechanic\'s lien' : '') +
        '. <b>What is the owner\'s equity?</b>',
      answer: equity, unit: 'money', tol: 1,
      formula: 'Equity = current market value - all liens against the property',
      steps: [
        'Total owed: ' + money0(first) + (second ? ' + ' + money0(second) : '') +
          (lien ? ' + ' + money0(lien) : '') + ' = ' + money0(first + second + lien),
        'Equity: ' + money0(value) + ' - ' + money0(first + second + lien) + ' = ' + money0(equity)
      ],
      tip: 'Equity uses CURRENT market value, not what the owner originally paid, and subtracts ' +
        'every lien — not just the first mortgage.',
      traps: [value - first, first + second + lien, value - first + second]
    };
  });

  /* ====================================================================
     VALUATION & INVESTMENT
     ==================================================================== */

  add('cap-rate-value', 'Income approach — value from NOI', 'Valuation', function () {
    var gross = rnd(48000, 190000, 1000);
    var vac = pick([4, 5, 6, 7, 8, 10]);
    var expPct = pick([30, 35, 38, 40, 42]);
    var egi = gross * (1 - vac / 100);
    var noi = egi * (1 - expPct / 100);
    var cap = pick([6, 6.5, 7, 7.5, 8, 8.5, 9]);
    var value = noi / (cap / 100);

    return {
      q: 'An apartment building has potential gross income of ' + money0(gross) +
        ', a vacancy and collection loss of ' + vac + '%, and operating expenses equal to ' +
        expPct + '% of effective gross income. At a <b>' + cap + '% capitalization rate</b>, ' +
        '<b>what is the indicated value?</b>',
      answer: value, unit: 'money', tol: 50,
      formula: 'PGI - vacancy = EGI; EGI - operating expenses = NOI; Value = NOI / cap rate',
      steps: [
        'Vacancy: ' + money0(gross) + ' x ' + vac + '% = ' + money(gross * vac / 100),
        'Effective gross income: ' + money0(gross) + ' - ' + money(gross * vac / 100) + ' = ' + money(egi),
        'Operating expenses: ' + money(egi) + ' x ' + expPct + '% = ' + money(egi * expPct / 100),
        'NOI: ' + money(egi) + ' - ' + money(egi * expPct / 100) + ' = ' + money(noi),
        'Value: ' + money(noi) + ' / ' + (cap / 100) + ' = ' + money(value)
      ],
      tip: 'NOI is BEFORE debt service. Never subtract the mortgage payment. Value = NOI / Rate — ' +
        'remember "IRV": Income = Rate x Value.',
      traps: [gross / (cap / 100), egi / (cap / 100), noi * (cap / 100)]
    };
  });

  add('cap-rate-solve', 'Income approach — solve for the cap rate', 'Valuation', function () {
    var value = rnd(400000, 1800000, 25000);
    var cap = pick([5, 5.25, 5.5, 6, 6.25, 6.5, 7, 7.25, 7.5, 8, 8.5, 9, 9.5, 10]);
    var noi = value * cap / 100;

    return {
      q: 'An investment property producing an NOI of ' + money0(noi) + ' sold for ' + money0(value) +
        '. <b>What was the capitalization rate?</b> Answer as a percent.',
      answer: cap, unit: 'percent', tol: 0.05,
      formula: 'Cap rate = NOI / value',
      steps: [
        money0(noi) + ' / ' + money0(value) + ' = ' + r2(noi / value * 1000) / 1000,
        'As a percent: ' + cap + '%'
      ],
      tip: 'IRV triangle: I on top, R and V on the bottom. Cover R and you get I / V.',
      traps: [cap / 12, cap * 2, value / noi]
    };
  });

  add('grm', 'Gross rent multiplier', 'Valuation', function () {
    var monthly = rnd(1400, 3600, 25);
    var grm = pick([110, 120, 132, 140, 150, 160]);
    var value = monthly * grm;
    var mode = pick(['value', 'grm']);

    if (mode === 'value') {
      return {
        q: 'Comparable properties in the neighborhood indicate a <b>monthly gross rent multiplier ' +
          'of ' + grm + '</b>. A rental home produces ' + money0(monthly) + ' per month. ' +
          '<b>What is its indicated value?</b>',
        answer: value, unit: 'money', tol: 5,
        formula: 'Value = monthly gross rent x GRM',
        steps: [money0(monthly) + ' x ' + grm + ' = ' + money0(value)],
        tip: 'Check whether the multiplier is MONTHLY (GRM, typically 100-200) or ANNUAL ' +
          '(GIM, typically 6-12). Using the wrong one is off by a factor of 12.',
        traps: [monthly * 12 * grm, monthly * grm / 12, value / 12]
      };
    }
    return {
      q: 'A rental property sold for ' + money0(value) + ' and rents for ' + money0(monthly) +
        ' per month. <b>What is the monthly gross rent multiplier?</b>',
      answer: grm, unit: 'number', tol: 0.5,
      formula: 'GRM = sale price / monthly gross rent',
      steps: [money0(value) + ' / ' + money0(monthly) + ' = ' + grm],
      tip: 'GRM uses GROSS rent — expenses and vacancy are ignored. That is why it is a rough tool.',
      traps: [grm / 12, grm * 12, value / (monthly * 12)]
    };
  });

  add('cost-approach', 'Cost approach with depreciation', 'Valuation', function () {
    var rcn = rnd(190000, 480000, 5000);
    var life = pick([40, 50, 60]);
    var age = rnd(4, 25);
    var land = rnd(40000, 130000, 5000);
    var dep = rcn * age / life;
    var value = rcn - dep + land;

    return {
      q: 'Reproduction cost new of a building is ' + money0(rcn) + '. It has an effective age of <b>' +
        age + ' years</b> and a total economic life of <b>' + life + ' years</b>. The site is worth ' +
        money0(land) + '. Using the <b>cost approach with straight-line depreciation</b>, ' +
        '<b>what is the indicated value?</b>',
      answer: value, unit: 'money', tol: 5,
      formula: 'Value = reproduction cost new - accrued depreciation + land value',
      steps: [
        'Depreciation rate: ' + age + ' / ' + life + ' = ' + r2(age / life * 100) + '%',
        'Accrued depreciation: ' + money0(rcn) + ' x ' + r2(age / life * 100) + '% = ' + money(dep),
        'Depreciated building: ' + money0(rcn) + ' - ' + money(dep) + ' = ' + money(rcn - dep),
        'Add land (land does NOT depreciate): ' + money(rcn - dep) + ' + ' + money0(land) +
          ' = ' + money(value)
      ],
      tip: 'LAND NEVER DEPRECIATES. Depreciate the building only, then add the site value back in.',
      traps: [(rcn + land) - (rcn + land) * age / life, rcn - dep, value - land * 2]
    };
  });

  add('appreciation', 'Appreciation / depreciation over time', 'Valuation', function () {
    var start = rnd(180000, 420000, 5000);
    var rate = pick([2, 3, 3.5, 4, 5]);
    var years = pick([2, 3, 4, 5]);
    var compound = Math.random() < 0.5;
    var end = compound ? start * Math.pow(1 + rate / 100, years) : start * (1 + rate * years / 100);

    return {
      q: 'A home purchased for ' + money0(start) + ' appreciates <b>' + rate + '% per year, ' +
        (compound ? 'compounded annually' : 'on a simple (straight-line) basis') + '</b>, for ' +
        years + ' years. <b>What is it worth at the end?</b>',
      answer: end, unit: 'money', tol: 10,
      formula: compound
        ? 'Value = start x (1 + rate)^years — each year builds on the last'
        : 'Value = start x (1 + rate x years) — always off the ORIGINAL value',
      steps: compound
        ? (function () {
          var s = [], v = start;
          for (var y = 1; y <= years; y++) {
            var nv = v * (1 + rate / 100);
            s.push('Year ' + y + ': ' + money(v) + ' x 1.0' + (rate < 10 ? String(rate).replace('.', '') : rate) +
              ' = ' + money(nv));
            v = nv;
          }
          s.push('Value after ' + years + ' years: ' + money(end));
          return s;
        })()
        : [
          'Total appreciation: ' + rate + '% x ' + years + ' years = ' + (rate * years) + '%',
          money0(start) + ' x ' + (1 + rate * years / 100) + ' = ' + money(end)
        ],
      tip: compound
        ? 'Compounded means you must run it year by year — you cannot just multiply the rate by ' +
          'the number of years (that answer is always offered and is always slightly low).'
        : 'Straight-line always applies the percentage to the ORIGINAL value, never the new one.',
      traps: [compound ? start * (1 + rate * years / 100) : start * Math.pow(1 + rate / 100, years),
        start * rate * years / 100, start * (1 + rate / 100)]
    };
  });

  add('profit-percent', 'Percent of profit / original price', 'Valuation', function () {
    var mode = pick(['findOriginal', 'findPercent']);
    var orig = rnd(140000, 380000, 1000);
    var pct = pick([8, 10, 12, 15, 20, 25]);
    var sold = orig * (1 + pct / 100);

    if (mode === 'findOriginal') {
      return {
        q: 'A homeowner sold a property for ' + money0(sold) + ', which was <b>' + pct +
          '% more than she paid</b> for it. <b>What did she originally pay?</b>',
        answer: orig, unit: 'money', tol: 2,
        formula: 'Original = sale price / (1 + percent gain)',
        steps: [
          'She sold for 100% + ' + pct + '% = ' + (100 + pct) + '% of what she paid',
          money0(sold) + ' / ' + (1 + pct / 100) + ' = ' + money0(orig)
        ],
        tip: 'DIVIDE by 1.' + (pct < 10 ? '0' + pct : pct) + '. Subtracting ' + pct +
          '% from the sale price gives a different (wrong) number — and it is always a choice.',
        traps: [sold * (1 - pct / 100), sold - orig, sold - pct / 100 * sold]
      };
    }
    return {
      q: 'A property was purchased for ' + money0(orig) + ' and later sold for ' + money0(sold) +
        '. <b>What was the percent of profit?</b>',
      answer: pct, unit: 'percent', tol: 0.05,
      formula: 'Percent change = (new - old) / OLD',
      steps: [
        'Profit: ' + money0(sold) + ' - ' + money0(orig) + ' = ' + money0(sold - orig),
        'Percent: ' + money0(sold - orig) + ' / ' + money0(orig) + ' = ' + (pct / 100) + ' = ' + pct + '%'
      ],
      tip: 'Divide by the OLD number — what you started with. Dividing by the sale price is the ' +
        'classic wrong answer.',
      traps: [(sold - orig) / sold * 100, pct / 2, 100 - pct]
    };
  });

  add('capital-gain', 'Capital gain on sale', 'Valuation', function () {
    var purchase = rnd(150000, 320000, 5000);
    var improve = rnd(15000, 70000, 1000);
    var sale = rnd(purchase + improve + 40000, purchase + improve + 190000, 5000);
    var costPct = pick([6, 7, 8]);
    var costs = sale * costPct / 100;
    var basis = purchase + improve;
    var realized = sale - costs;
    var gain = realized - basis;

    return {
      q: 'An owner bought a property for ' + money0(purchase) + ' and made ' + money0(improve) +
        ' of capital improvements. It sold for ' + money0(sale) + ' with selling costs of ' +
        costPct + '% of the sale price. <b>What is the capital gain?</b>',
      answer: gain, unit: 'money', tol: 5,
      formula: 'Adjusted basis = purchase + improvements. Gain = (sale - selling costs) - adjusted basis',
      steps: [
        'Adjusted basis: ' + money0(purchase) + ' + ' + money0(improve) + ' = ' + money0(basis),
        'Selling costs: ' + money0(sale) + ' x ' + costPct + '% = ' + money(costs),
        'Amount realized: ' + money0(sale) + ' - ' + money(costs) + ' = ' + money(realized),
        'Gain: ' + money(realized) + ' - ' + money0(basis) + ' = ' + money(gain)
      ],
      tip: 'Improvements RAISE the basis (lowering the gain). Selling costs LOWER the amount ' +
        'realized. Both work in the seller\'s favor.',
      traps: [sale - purchase, realized - purchase, sale - basis]
    };
  });

  add('assessed-mills', 'Property tax from a mill rate', 'Valuation', function () {
    var market = rnd(180000, 520000, 5000);
    var ratio = pick([100, 100, 60, 50, 40]);
    var assessed = market * ratio / 100;
    var mills = rnd(28, 96);
    var tax = assessed / 1000 * mills;

    return {
      q: 'A property has a market value of ' + money0(market) +
        (ratio === 100 ? '' : ' and is assessed at ' + ratio + '% of market value') +
        '. The tax rate is <b>' + mills + ' mills</b>. <b>What is the annual property tax?</b>',
      answer: tax, unit: 'money', tol: 1,
      formula: 'One mill = $1 per $1,000 of assessed value = 0.001',
      steps: [
        (ratio === 100 ? 'Assessed value equals market value: ' + money0(assessed)
          : 'Assessed value: ' + money0(market) + ' x ' + ratio + '% = ' + money0(assessed)),
        'Thousands: ' + money0(assessed) + ' / 1,000 = ' + (assessed / 1000),
        'Tax: ' + (assessed / 1000) + ' x ' + mills + ' = ' + money(tax)
      ],
      tip: 'A mill is one-tenth of one cent (0.001). Divide the assessed value by 1,000 first, ' +
        'then multiply by the mills. Note: Minnesota actually uses a "tax capacity" system rather ' +
        'than mills, but the national portion of the exam tests mills.',
      traps: [market / 1000 * mills, assessed * mills / 100, assessed * mills]
    };
  });

  /* ====================================================================
     AREA, ACREAGE & LEGAL DESCRIPTIONS
     ==================================================================== */

  add('lot-acres', 'Lot size in acres', 'Area', function () {
    var w = rnd(80, 400, 5);
    var d = rnd(110, 600, 5);
    var sq = w * d;
    var acres = sq / 43560;

    return {
      q: 'A rectangular lot measures <b>' + w + ' feet by ' + d + ' feet</b>. ' +
        '<b>How many acres is it?</b> Round to two decimals.',
      answer: acres, unit: 'acres', tol: 0.02,
      formula: '1 acre = 43,560 square feet',
      steps: [
        'Area: ' + w + ' x ' + d + ' = ' + num(sq) + ' sq ft',
        'Acres: ' + num(sq) + ' / 43,560 = ' + r2(acres) + ' acres'
      ],
      tip: '43,560 is the number to memorize cold. To go from sq ft to acres you DIVIDE.',
      traps: [sq / 4356, sq / 5280, acres * 43560]
    };
  });

  add('lot-value-sqft', 'Price per square foot / per acre', 'Area', function () {
    var acres = pick([0.5, 0.75, 1, 1.5, 2, 2.5, 5]);
    var perAcre = rnd(12000, 48000, 500);
    var total = acres * perAcre;
    var sq = acres * 43560;

    return {
      q: 'A ' + acres + '-acre parcel near ' + pick(CITIES) + ' is valued at ' + money0(perAcre) +
        ' per acre. <b>What is the value per square foot?</b> Round to the nearest cent.',
      answer: total / sq, unit: 'money2', tol: 0.02,
      formula: 'Value per sq ft = total value / total square feet',
      steps: [
        'Total value: ' + acres + ' x ' + money0(perAcre) + ' = ' + money0(total),
        'Total square feet: ' + acres + ' x 43,560 = ' + num(sq),
        'Per square foot: ' + money0(total) + ' / ' + num(sq) + ' = ' + money(total / sq),
        'Shortcut: price per acre / 43,560 gives the same answer.'
      ],
      tip: 'The acreage cancels out — you can just divide the per-acre price by 43,560.',
      traps: [perAcre / 43560 * 10, total / acres, sq / total]
    };
  });

  add('section-acres', 'Legal description — acreage', 'Area', function () {
    var parts = pick([
      { t: 'the NW1/4 of the SE1/4', f: [1 / 4, 1 / 4] },
      { t: 'the N1/2 of the SW1/4', f: [1 / 2, 1 / 4] },
      { t: 'the SE1/4 of the NE1/4 of the SW1/4', f: [1 / 4, 1 / 4, 1 / 4] },
      { t: 'the E1/2 of the NW1/4 of the NE1/4', f: [1 / 2, 1 / 4, 1 / 4] },
      { t: 'the S1/2 of the SE1/4', f: [1 / 2, 1 / 4] },
      { t: 'the W1/2 of the SW1/4 of the SE1/4', f: [1 / 2, 1 / 4, 1 / 4] }
    ]);
    var frac = parts.f.reduce(function (a, b) { return a * b; }, 1);
    var acres = 640 * frac;
    var sec = rnd(1, 36);
    var perAcre = rnd(3500, 11000, 250);
    var wantValue = Math.random() < 0.45;

    if (wantValue) {
      return {
        q: 'Farmland described as <b>' + parts.t + ' of Section ' + sec + '</b> sells for ' +
          money0(perAcre) + ' per acre. <b>What is the total sale price?</b>',
        answer: acres * perAcre, unit: 'money', tol: 5,
        formula: 'A section = 640 acres. Multiply the fractions together, then by 640.',
        steps: [
          'Multiply the fractions: ' + parts.f.map(function (x) {
            return x === 0.5 ? '1/2' : '1/4';
          }).join(' x ') + ' = 1/' + Math.round(1 / frac),
          'Acres: 640 / ' + Math.round(1 / frac) + ' = ' + acres + ' acres',
          'Price: ' + acres + ' x ' + money0(perAcre) + ' = ' + money0(acres * perAcre)
        ],
        tip: 'Read the description RIGHT TO LEFT, but for acreage you can just multiply all the ' +
          'fractions and apply them to 640.',
        traps: [640 * perAcre, acres * perAcre / 2, acres * perAcre * 2]
      };
    }
    return {
      q: 'How many acres are in <b>' + parts.t + ' of Section ' + sec + '</b>?',
      answer: acres, unit: 'acres', tol: 0.01,
      formula: 'Section = 640 acres = 1 square mile. Multiply all the fractions by 640.',
      steps: [
        'Fractions: ' + parts.f.map(function (x) { return x === 0.5 ? '1/2' : '1/4'; }).join(' x ') +
          ' = 1/' + Math.round(1 / frac),
        '640 x 1/' + Math.round(1 / frac) + ' = ' + acres + ' acres'
      ],
      tip: 'Memorize: section = 640 acres; township = 36 sections = 36 sq miles; ' +
        'a quarter-quarter (40 acres) is the smallest common farm parcel.',
      traps: [acres * 2, acres / 2, 640 - acres]
    };
  });

  add('triangle-lot', 'Triangular / irregular lot', 'Area', function () {
    var b = rnd(90, 320, 10);
    var h = rnd(80, 300, 10);
    var area = b * h / 2;
    var perSq = rnd(3, 14);

    return {
      q: 'A triangular corner lot has a base of <b>' + b + ' feet</b> and a height of <b>' + h +
        ' feet</b>. At ' + money0(perSq) + ' per square foot, <b>what is the lot worth?</b>',
      answer: area * perSq, unit: 'money', tol: 2,
      formula: 'Triangle area = 1/2 x base x height',
      steps: [
        'Area: (' + b + ' x ' + h + ') / 2 = ' + num(area) + ' sq ft',
        'Value: ' + num(area) + ' x ' + money0(perSq) + ' = ' + money0(area * perSq)
      ],
      tip: 'Do not forget to divide by 2. Forgetting it doubles your answer — and that number is ' +
        'always one of the choices.',
      traps: [b * h * perSq, area, b * h]
    };
  });

  add('house-sqft', 'Square footage & price per square foot', 'Area', function () {
    var l = rnd(28, 60, 2), w = rnd(24, 44, 2);
    var stories = pick([1, 1, 2]);
    var sq = l * w * stories;
    var price = rnd(180000, 450000, 5000);

    return {
      q: 'A ' + (stories === 2 ? 'two-story' : 'one-story') + ' home measures <b>' + l +
        ' feet by ' + w + ' feet</b>' + (stories === 2 ? ' on each floor' : '') +
        ' and is listed at ' + money0(price) + '. <b>What is the price per square foot ' +
        'of living area?</b> Round to the nearest cent.',
      answer: price / sq, unit: 'money2', tol: 0.05,
      formula: 'Price per sq ft = price / gross living area',
      steps: [
        'Area per floor: ' + l + ' x ' + w + ' = ' + num(l * w) + ' sq ft',
        (stories === 2 ? 'Two floors: ' + num(l * w) + ' x 2 = ' + num(sq) + ' sq ft'
          : 'Total living area: ' + num(sq) + ' sq ft'),
        'Price per sq ft: ' + money0(price) + ' / ' + num(sq) + ' = ' + money(price / sq)
      ],
      tip: 'Gross living area counts finished ABOVE-GRADE space. A Minnesota basement — even a ' +
        'finished one — is valued separately, not added into GLA.',
      traps: [price / (l * w), price / (sq * 2), sq / price]
    };
  });

  add('conversions', 'Measurement conversions', 'Area', function () {
    var mode = pick(['sqyd', 'acres2sq', 'mile', 'frontfoot']);
    if (mode === 'sqyd') {
      var l = rnd(12, 40, 2), w = rnd(10, 30, 2);
      var sq = l * w, yd = sq / 9;
      var cost = rnd(28, 65);
      return {
        q: 'A room measures ' + l + ' feet by ' + w + ' feet. Carpet costs ' + money0(cost) +
          ' per square YARD. <b>What is the carpet cost?</b>',
        answer: yd * cost, unit: 'money', tol: 1,
        formula: '1 square yard = 9 square feet',
        steps: [
          'Area: ' + l + ' x ' + w + ' = ' + num(sq) + ' sq ft',
          'Square yards: ' + num(sq) + ' / 9 = ' + r2(yd),
          'Cost: ' + r2(yd) + ' x ' + money0(cost) + ' = ' + money(yd * cost)
        ],
        tip: '9 sq ft per sq yard (3 ft x 3 ft), not 3. Carpet and flooring questions live on this.',
        traps: [sq * cost, sq / 3 * cost, yd * cost / 3]
      };
    }
    if (mode === 'acres2sq') {
      var ac = pick([0.25, 0.33, 0.5, 1.25, 2.5, 3, 4.5]);
      return {
        q: 'How many <b>square feet</b> are in a ' + ac + '-acre parcel?',
        answer: ac * 43560, unit: 'sqft', tol: 1,
        formula: '1 acre = 43,560 square feet',
        steps: [ac + ' x 43,560 = ' + num(ac * 43560) + ' sq ft'],
        tip: 'Acres to square feet: MULTIPLY. Square feet to acres: DIVIDE.',
        traps: [ac * 4356, ac / 43560, 43560]
      };
    }
    if (mode === 'mile') {
      var sides = pick([1, 2, 3, 4, 6]);
      return {
        q: 'A square parcel contains exactly <b>' + (sides * sides) + ' square miles</b>. ' +
          '<b>How many acres is it?</b>',
        answer: sides * sides * 640, unit: 'acres', tol: 1,
        formula: '1 square mile = 640 acres = 1 section',
        steps: [(sides * sides) + ' sq mi x 640 acres = ' + num(sides * sides * 640) + ' acres'],
        tip: '640 acres per section/square mile; 5,280 feet per mile; 36 sections per township.',
        traps: [sides * 640, sides * sides * 43560, 640]
      };
    }
    var ff = rnd(60, 180, 5);
    var depth = rnd(120, 300, 10);
    var perFF = rnd(600, 3200, 50);
    return {
      q: 'A commercial lot has <b>' + ff + ' front feet</b> and a depth of ' + depth +
        ' feet. Land in the area sells for ' + money0(perFF) + ' <b>per front foot</b>. ' +
        '<b>What is the lot worth?</b>',
      answer: ff * perFF, unit: 'money', tol: 2,
      formula: 'Front-foot value = front footage x price per front foot (depth is a distractor)',
      steps: [
        ff + ' front feet x ' + money0(perFF) + ' = ' + money0(ff * perFF),
        'The ' + depth + '-foot depth is not used — front-foot pricing ignores it.'
      ],
      tip: 'Front footage is the side ON THE STREET. When a problem prices per front foot, the ' +
        'depth is deliberately there to bait you into computing square footage.',
      traps: [ff * depth * perFF, ff * depth, depth * perFF]
    };
  });

  /* ====================================================================
     CLOSING STATEMENT LOGIC
     ==================================================================== */

  add('buyer-cash', 'Cash the buyer needs at closing', 'Closing', function () {
    var price = rnd(215000, 495000, 5000);
    var ltv = pick([80, 90, 95]);
    var loan = price * ltv / 100;
    var em = rnd(2000, 12000, 500);
    var costs = rnd(3800, 9500, 100);
    var prepaids = rnd(1200, 3600, 50);
    var taxCredit = rnd(900, 3200, 50);
    var cash = price - loan - em + costs + prepaids - taxCredit;

    return {
      q: 'Sale price ' + money0(price) + ' with an ' + ltv + '% LTV loan. The buyer already paid ' +
        money0(em) + ' earnest money, owes ' + money0(costs) + ' in closing costs and ' +
        money0(prepaids) + ' in prepaids, and receives a ' + money0(taxCredit) +
        ' credit for taxes the seller owes. <b>How much cash must the buyer bring to closing?</b>',
      answer: cash, unit: 'money', tol: 2,
      formula: 'Cash due = (debits: price + costs + prepaids) - (credits: loan + earnest money + prorations)',
      steps: [
        'Buyer DEBITS: ' + money0(price) + ' + ' + money0(costs) + ' + ' + money0(prepaids) +
          ' = ' + money0(price + costs + prepaids),
        'Buyer CREDITS: loan ' + money0(loan) + ' + earnest money ' + money0(em) +
          ' + tax proration ' + money0(taxCredit) + ' = ' + money0(loan + em + taxCredit),
        'Cash to close: ' + money0(price + costs + prepaids) + ' - ' + money0(loan + em + taxCredit) +
          ' = ' + money0(cash)
      ],
      tip: 'Debit = what you owe. Credit = what you already have or are given. Earnest money is a ' +
        'buyer CREDIT because it is already paid — do not add it again.',
      traps: [cash + em, cash + taxCredit * 2, price - loan + costs]
    };
  });

  /* ================================================================== API */

  var CATS = [];
  GEN.forEach(function (g) { if (CATS.indexOf(g.cat) < 0) CATS.push(g.cat); });

  function byId(id) {
    for (var i = 0; i < GEN.length; i++) if (GEN[i].id === id) return GEN[i];
    return null;
  }

  /* Build 4 multiple-choice options around the correct answer. */
  function choicesFor(p) {
    var out = [p.answer];
    var pool = (p.traps || []).slice();
    // pad with plausible perturbations
    pool.push(p.answer * 1.1, p.answer * 0.9, p.answer * 1.25, p.answer / 2, p.answer * 2);
    for (var i = 0; i < pool.length && out.length < 4; i++) {
      var v = pool[i];
      if (!isFinite(v) || v <= 0) continue;
      var dup = out.some(function (o) { return Math.abs(o - v) < Math.max(p.tol, Math.abs(p.answer) * 0.004); });
      if (!dup) out.push(v);
    }
    // shuffle
    for (var j = out.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = out[j]; out[j] = out[k]; out[k] = t;
    }
    return out;
  }

  function fmt(v, unit) {
    switch (unit) {
      case 'money': return money(v);
      case 'money2': return money(v);
      case 'percent': return (Math.round(v * 1000) / 1000) + '%';
      case 'acres': return (Math.round(v * 100) / 100) + ' acres';
      case 'sqft': return num(Math.round(v)) + ' sq ft';
      default: return String(Math.round(v * 100) / 100);
    }
  }

  /* Parse whatever the student types: "$1,234.50", "6.5%", "1234.5" */
  function parseAnswer(s) {
    if (s === null || s === undefined) return NaN;
    var clean = String(s).replace(/[$,\s]/g, '').replace(/%/g, '')
      .replace(/acres?/ig, '').replace(/sq\.?\s*ft\.?/ig, '');
    if (clean === '' || clean === '-') return NaN;
    return parseFloat(clean);
  }

  global.MathGen = {
    generators: GEN,
    cats: CATS,
    byId: byId,
    random: function (cat) {
      var pool = cat && cat !== 'All' ? GEN.filter(function (g) { return g.cat === cat; }) : GEN;
      var g = pick(pool);
      var p = g.gen();
      p.genId = g.id;
      p.genName = g.name;
      p.cat = g.cat;
      return p;
    },
    fromId: function (id) {
      var g = byId(id);
      if (!g) return null;
      var p = g.gen();
      p.genId = g.id; p.genName = g.name; p.cat = g.cat;
      return p;
    },
    choicesFor: choicesFor,
    fmt: fmt,
    parseAnswer: parseAnswer,
    money: money, money0: money0
  };
})(window);
