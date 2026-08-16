/* ==========================================================================
   questions.js — multiple-choice bank for the MN Real Estate Salesperson exam
   portion: 'national' (80 of the 120 exam questions) or 'state' (the other 40)
   a: index of the correct choice
   why: explanation shown after answering
   ========================================================================== */
(function (global) {
  'use strict';

  var Q = [];
  function q(portion, cat, text, choices, a, why) {
    Q.push({ id: 'q' + (Q.length + 1), portion: portion, cat: cat, q: text, choices: choices, a: a, why: why });
  }

  /* ======================================================================
     AGENCY  (national)
     ====================================================================== */

  q('national', 'Agency', 'An agent owes the duties of loyalty, obedience, disclosure, confidentiality, accounting, and reasonable care. To whom are these fiduciary duties owed?',
    ['The client (principal)', 'The customer', 'Both parties equally', 'The broker only'], 0,
    'Fiduciary duties run to the CLIENT. A customer receives honesty and fair dealing plus disclosure of material facts, but not fiduciary duties.');

  q('national', 'Agency', 'A buyer tells a listing agent, "I am willing to go up to $340,000, but offer $315,000." The listing agent represents the seller. What must the agent do?',
    ['Keep the information confidential from the seller',
      'Disclose the buyer\'s top price to the seller',
      'Refuse to present the low offer',
      'Advise the buyer to raise the offer'], 1,
    'The listing agent owes disclosure and loyalty to the SELLER. Anything material learned about the buyer\'s position must be passed to the client. This is exactly why buyers should not confide in the listing agent.');

  q('national', 'Agency', 'Which duty survives the termination of the agency relationship?',
    ['Obedience', 'Confidentiality', 'Loyalty', 'Accounting for the client\'s time'], 1,
    'Confidentiality continues after the relationship ends. The other fiduciary duties end when the agency terminates.');

  q('national', 'Agency', 'An agency relationship created by the words and conduct of the parties, without a written agreement, is:',
    ['Express agency', 'Implied agency', 'Ostensible agency', 'Universal agency'], 1,
    'Implied agency arises from conduct. Express agency is created by words, written or oral. Accidentally creating implied agency with a buyer is a common liability trap.');

  q('national', 'Agency', 'A licensee who represents neither party but assists both in a transaction is generally called:',
    ['A dual agent', 'A subagent', 'A facilitator or transaction broker', 'A designated agent'], 2,
    'A facilitator/transaction broker is a non-agent who helps the transaction along. Minnesota specifically recognizes and defines the FACILITATOR status by statute.');

  q('national', 'Agency', 'Puffing differs from misrepresentation because puffing is:',
    ['A statement of opinion that a reasonable person would not rely on',
      'A false statement made innocently',
      'Always illegal',
      'A material fact stated incorrectly'], 0,
    '"Best view in town" is opinion (puffing). "The roof is three years old" when it is twenty is a misrepresentation of material fact and creates liability.');

  q('national', 'Agency', 'A latent defect is one that:',
    ['Is obvious upon reasonable inspection',
      'Is hidden and not discoverable by ordinary inspection',
      'Only affects the exterior of the property',
      'Has been repaired'], 1,
    'Latent = hidden. Known latent material defects must be disclosed; that duty is owed even to a customer and cannot be waived by an "as-is" clause.');

  q('national', 'Agency', 'A seller instructs the listing agent not to show the property to families with children. The agent should:',
    ['Comply, because the seller is the client',
      'Comply but document the instruction',
      'Refuse and explain that the instruction is an illegal discriminatory act',
      'Withdraw quietly without explanation'], 2,
    'The duty of obedience covers only LAWFUL instructions. Following this one would violate the familial status protection in federal fair housing law.');

  q('national', 'Agency', 'Which of these would terminate an agency relationship by operation of law?',
    ['Mutual agreement of the parties', 'Death or incapacity of the principal',
      'The agent finding a buyer', 'The client changing brokerages'], 1,
    'Death, incapacity, bankruptcy, or destruction of the property terminate agency by operation of law — no action by the parties is needed.');

  q('national', 'Agency', 'A designated agency arrangement means:',
    ['The broker designates one licensee to represent the buyer and another to represent the seller',
      'The broker represents both parties personally',
      'The seller designates which agent may show the home',
      'The buyer designates a preferred lender'], 0,
    'In designated agency the broker names individual licensees for each side. The broker typically remains a dual agent while the designated licensees each advocate for their own client.');

  /* ======================================================================
     CONTRACTS  (national)
     ====================================================================== */

  q('national', 'Contracts', 'The essential elements of a valid contract include all of the following EXCEPT:',
    ['Offer and acceptance', 'Consideration', 'Legal purpose', 'Written form'], 3,
    'Writing is a requirement of the STATUTE OF FRAUDS for certain contracts (like real estate sales), not an element of validity itself. The four elements are competent parties, mutual assent, consideration, and legal purpose.');

  q('national', 'Contracts', 'A contract that is missing a required element and has no legal effect whatsoever is:',
    ['Voidable', 'Void', 'Unenforceable', 'Executory'], 1,
    'Void = never a contract at all. Voidable = valid until the injured party disaffirms (e.g., a minor\'s contract). Unenforceable = valid but a court will not enforce it (e.g., not in writing).');

  q('national', 'Contracts', 'A seller receives an offer and returns it with the price changed. This is:',
    ['An acceptance with conditions', 'A counteroffer that terminates the original offer',
      'A binding contract at the new price', 'An option'], 1,
    'Any change to the terms is a counteroffer. It REJECTS the original offer — the seller cannot later go back and accept the first offer unless the buyer re-extends it.');

  q('national', 'Contracts', 'Which contract requires the offeree to perform, not merely to promise to perform?',
    ['Bilateral contract', 'Unilateral contract', 'Executed contract', 'Implied contract'], 1,
    'Unilateral = a promise in exchange for an ACT. An open listing and a reward offer are classic examples. A bilateral contract is a promise for a promise.');

  q('national', 'Contracts', 'Earnest money in a purchase agreement is best described as:',
    ['A required element of contract validity',
      'Evidence of the buyer\'s good faith that also becomes part of consideration',
      'The broker\'s commission', 'A non-refundable fee'], 1,
    'Earnest money is NOT required to form a valid contract — the mutual promises are the consideration. It shows good faith and is usually applied to the purchase price at closing.');

  q('national', 'Contracts', 'A purchase agreement contains a financing contingency. If the buyer makes a good-faith effort and cannot obtain the loan, the buyer:',
    ['Forfeits the earnest money', 'May generally cancel and recover the earnest money',
      'Must buy the property for cash', 'Must accept any loan offered'], 1,
    'A contingency is a condition. If the condition genuinely fails despite good-faith effort, the contract terminates and the earnest money is returned.');

  q('national', 'Contracts', 'The legal remedy that forces a party to actually convey the property, rather than pay money damages, is:',
    ['Liquidated damages', 'Rescission', 'Specific performance', 'Novation'], 2,
    'Because every parcel of real estate is legally unique, courts will order SPECIFIC PERFORMANCE — money damages are considered inadequate.');

  q('national', 'Contracts', 'Substituting a new party into a contract, releasing the original party from liability, is:',
    ['Assignment', 'Novation', 'Subordination', 'Rescission'], 1,
    'Novation RELEASES the original party. Assignment transfers rights but the original party usually remains secondarily liable — that distinction is heavily tested.');

  q('national', 'Contracts', 'An option contract gives the optionee:',
    ['The obligation to buy at a set price', 'The right, but not the obligation, to buy within a set time',
      'Title to the property', 'A lien on the property'], 1,
    'An option is unilateral: the optionor (owner) is bound; the optionee may walk away and simply lose the option consideration.');

  q('national', 'Contracts', 'A listing agreement in which the broker earns a commission no matter who sells the property, including the owner, is:',
    ['An open listing', 'An exclusive agency listing', 'An exclusive right to sell listing', 'A net listing'], 2,
    'Exclusive RIGHT TO SELL = broker paid regardless of who procures the buyer. Exclusive AGENCY = owner can sell it themselves commission-free.');

  q('national', 'Contracts', 'A net listing, in which the broker keeps everything above a price set by the seller, is:',
    ['Preferred by most brokers', 'Illegal or discouraged in most states because of the conflict of interest',
      'The same as an open listing', 'Required to be in writing only'], 1,
    'Net listings create a direct conflict between the broker\'s profit and the client\'s interest. They are prohibited or strongly restricted in most states.');

  q('national', 'Contracts', 'Time is of the essence in a contract means:',
    ['Deadlines are approximate', 'Deadlines must be met exactly or a party is in breach',
      'The contract expires in 30 days', 'Closing must occur at a specific hour'], 1,
    'With this clause, missing a stated deadline is a breach — no reasonable-time grace is implied.');

  q('national', 'Contracts', 'Which of the following would NOT terminate an offer?',
    ['The offeror revokes it before acceptance', 'The offeree makes a counteroffer',
      'The offeree tells a friend she likes the offer', 'The offeror dies before acceptance'], 2,
    'Only communication to the OFFEROR matters. Private thoughts or statements to third parties have no legal effect on the offer.');

  q('national', 'Contracts', 'Liquidated damages in a purchase agreement typically means:',
    ['The seller may sue for unlimited damages',
      'The parties agreed in advance on the amount recoverable, often the earnest money',
      'The buyer receives the property', 'The broker keeps the entire deposit'], 1,
    'Liquidated damages is a pre-agreed, capped remedy. Retaining the earnest money as the seller\'s sole remedy is the most common form.');

  q('national', 'Contracts', 'A contract signed by a person who has been declared legally incompetent by a court is:',
    ['Valid', 'Voidable by that person', 'Void', 'Enforceable against both parties'], 2,
    'ADJUDICATED incompetent = VOID. Someone who is merely impaired but not adjudicated creates a VOIDABLE contract. The exam tests that distinction.');

  q('national', 'Contracts', 'Under the parol evidence rule:',
    ['Oral agreements always override written ones',
      'Prior oral agreements generally cannot contradict a complete written contract',
      'All contracts must be notarized', 'Only licensed attorneys may draft contracts'], 1,
    'Once the parties reduce the deal to a complete written contract, earlier oral side deals cannot be used to contradict it. Get every promise in the written agreement.');

  q('national', 'Contracts', 'An "as-is" clause in a purchase agreement:',
    ['Relieves the seller of the duty to disclose known material defects',
      'Does not relieve the seller of the duty to disclose known material defects',
      'Makes the contract void', 'Is prohibited in residential transactions'], 1,
    '"As-is" addresses who pays for REPAIRS. It never licenses concealment of known material defects, and it does not override Minnesota\'s statutory seller disclosure duty.');

  /* ======================================================================
     PROPERTY, OWNERSHIP & TITLE  (national)
     ====================================================================== */

  q('national', 'Property & Title', 'The bundle of rights in real property includes all EXCEPT:',
    ['Possession', 'Enjoyment', 'Exclusion', 'Taxation'], 3,
    'The bundle is possession, enjoyment, control, exclusion, and disposition. Taxation is a GOVERNMENT power (PETE), not an owner\'s right.');

  q('national', 'Property & Title', 'The government powers that limit private ownership are remembered as PETE. The "E" powers are:',
    ['Escrow and encumbrance', 'Eminent domain and escheat', 'Easement and estate', 'Equity and encroachment'], 1,
    'PETE = Police power, Eminent domain, Taxation, Escheat. Escheat is the state taking property when an owner dies with no heirs and no will.');

  q('national', 'Property & Title', 'Ownership by two or more people with right of survivorship, requiring the four unities, is:',
    ['Tenancy in common', 'Joint tenancy', 'Tenancy by the entirety', 'Severalty'], 1,
    'Joint tenancy requires unity of Possession, Interest, Time, Title (PITT) and carries survivorship. Tenancy in common has no survivorship and interests may be unequal.');

  q('national', 'Property & Title', 'Ownership by one person or one legal entity alone is:',
    ['Severalty', 'Tenancy in common', 'Community property', 'Partition'], 0,
    'Severalty comes from "severed" — the owner is severed from all others. Despite sounding plural, it means sole ownership.');

  q('national', 'Property & Title', 'The highest and most complete form of ownership is:',
    ['Life estate', 'Fee simple absolute', 'Leasehold estate', 'Fee simple determinable'], 1,
    'Fee simple absolute is unlimited in duration and inheritable, subject only to government powers and private restrictions.');

  q('national', 'Property & Title', 'A right to cross a neighbor\'s land to reach your own is a(n):',
    ['License', 'Easement appurtenant', 'Easement in gross', 'Encroachment'], 1,
    'Appurtenant easements involve two adjoining parcels (dominant and servient) and RUN WITH THE LAND. Easement in gross benefits a person or company (utility lines).');

  q('national', 'Property & Title', 'A deed that provides the greatest protection to the grantee is a:',
    ['Quitclaim deed', 'Special warranty deed', 'General warranty deed', 'Bargain and sale deed'], 2,
    'General warranty deed warrants title back through the entire chain. A quitclaim conveys only whatever interest the grantor may have, with no warranties.');

  q('national', 'Property & Title', 'Which deed is most commonly used to clear a cloud on the title?',
    ['General warranty deed', 'Quitclaim deed', 'Sheriff\'s deed', 'Trustee\'s deed'], 1,
    'A quitclaim releases any possible claim without warranting anything, which makes it the standard tool for curing title defects.');

  q('national', 'Property & Title', 'For a deed to be valid it must be:',
    ['Recorded', 'Delivered to and accepted by the grantee', 'Signed by the grantee', 'Notarized'], 1,
    'Delivery and acceptance make the deed effective. Recording gives CONSTRUCTIVE NOTICE to the world and protects priority, but a deed is valid between the parties without it.');

  q('national', 'Property & Title', 'Recording a deed provides:',
    ['Actual notice', 'Constructive notice', 'Marketable title', 'A title guarantee'], 1,
    'Constructive (legal) notice = the public record charges everyone with knowledge. Actual notice is what a person genuinely knows.');

  q('national', 'Property & Title', 'An encroachment is:',
    ['A permitted use of another\'s land', 'An unauthorized physical intrusion onto another\'s land',
      'A lien', 'A zoning violation only'], 1,
    'A fence or garage built over the boundary line is an encroachment; it is discovered by a SURVEY and can make title unmarketable.');

  q('national', 'Property & Title', 'Which lien takes priority over all others, regardless of when it was recorded?',
    ['First mortgage', 'Mechanic\'s lien', 'Real property tax lien', 'Judgment lien'], 2,
    'Ad valorem property tax liens (and special assessments) are superior to everything, including a first mortgage recorded earlier.');

  q('national', 'Property & Title', 'A mechanic\'s lien secures payment for:',
    ['Auto repairs performed on the property', 'Labor and materials furnished to improve the property',
      'Unpaid income taxes', 'Homeowners association dues'], 1,
    'Contractors, subcontractors, and suppliers who improve real property may file a mechanic\'s lien. Priority often relates back to when work began, which is why lien waivers matter.');

  q('national', 'Property & Title', 'Personal property that has become permanently attached to real property is a:',
    ['Trade fixture', 'Fixture', 'Chattel', 'Emblement'], 1,
    'The tests are Method of attachment, Adaptability, Relationship of the parties, Intent, and Agreement (MARIA), with INTENT weighing most heavily.');

  q('national', 'Property & Title', 'A tenant installs shelving and display counters to run a retail store. At lease end these are:',
    ['Fixtures that stay with the property', 'Trade fixtures the tenant may remove',
      'Property of the lender', 'Emblements'], 1,
    'Trade fixtures installed for business use remain the tenant\'s property and may be removed before the lease ends, with the tenant repairing any damage.');

  q('national', 'Property & Title', 'A lease for a definite period that ends automatically without notice is a:',
    ['Estate at will', 'Estate for years', 'Periodic tenancy', 'Estate at sufferance'], 1,
    'Estate for years has a definite start and end date — even if the term is only six months. No notice is required for it to end.');

  q('national', 'Property & Title', 'A tenant remains in possession after the lease expires, without the landlord\'s permission. This is a(n):',
    ['Estate at sufferance', 'Periodic tenancy', 'Estate for years', 'Estate at will'], 0,
    'A holdover tenant with no consent has an estate at SUFFERANCE — the lowest estate, just above trespass.');

  q('national', 'Property & Title', 'Zoning is an exercise of which government power?',
    ['Eminent domain', 'Police power', 'Escheat', 'Taxation'], 1,
    'Police power protects public health, safety, and welfare. It requires no compensation, unlike eminent domain.');

  q('national', 'Property & Title', 'A property use that lawfully predates a new zoning ordinance and is allowed to continue is:',
    ['A variance', 'A special use permit', 'A legal nonconforming use', 'Spot zoning'], 2,
    '"Grandfathered in." A VARIANCE is permission to deviate from current zoning going forward; a nonconforming use already existed lawfully.');

  q('national', 'Property & Title', 'Private restrictions placed on all lots in a subdivision by the developer are:',
    ['Zoning ordinances', 'Restrictive covenants (CC&Rs)', 'Easements in gross', 'Police power'], 1,
    'CC&Rs are PRIVATE and enforced by injunction among owners or the HOA. When a covenant and zoning conflict, the more restrictive one controls.');

  /* ======================================================================
     FINANCE  (national)
     ====================================================================== */

  q('national', 'Finance', 'In a lien theory state, the mortgage gives the lender:',
    ['Legal title until the debt is paid', 'A lien against the property while the borrower keeps title',
      'The right to occupy the property', 'A leasehold interest'], 1,
    'Minnesota is a LIEN THEORY state: the borrower holds title and possession; the lender holds only a security interest until foreclosure is complete.');

  q('national', 'Finance', 'The clause that lets a lender declare the entire balance due upon default is the:',
    ['Defeasance clause', 'Acceleration clause', 'Alienation clause', 'Subordination clause'], 1,
    'ACCELERATION makes the whole balance due immediately. The ALIENATION (due-on-sale) clause triggers on transfer of the property, not default.');

  q('national', 'Finance', 'A due-on-sale clause prevents:',
    ['Prepaying the loan', 'A buyer from assuming the existing loan without lender consent',
      'The lender from foreclosing', 'Refinancing'], 1,
    'Also called the alienation clause. It is why most conventional loans cannot simply be taken over by a buyer.');

  q('national', 'Finance', 'Which loan type typically requires a funding fee and allows qualified veterans to purchase with no down payment?',
    ['FHA', 'VA', 'USDA', 'Conventional'], 1,
    'VA loans offer a guaranty to the lender and charge a funding fee. FHA insures loans and charges MIP; USDA serves eligible rural areas.');

  q('national', 'Finance', 'Private mortgage insurance (PMI) on a conventional loan protects:',
    ['The borrower', 'The lender against borrower default', 'The seller', 'The appraiser'], 1,
    'PMI protects the LENDER. It is typically required above 80% LTV and, under federal law, must automatically terminate at 78% LTV on most loans.');

  q('national', 'Finance', 'The secondary mortgage market does which of the following?',
    ['Originates loans to consumers', 'Buys and sells existing loans, providing lenders with liquidity',
      'Sets federal interest rates', 'Insures FHA loans'], 1,
    'Fannie Mae, Freddie Mac, and Ginnie Mae purchase loans so originating lenders can lend again. They do not lend to consumers directly.');

  q('national', 'Finance', 'Usury laws set:',
    ['Minimum down payments', 'Maximum interest rates a lender may charge',
      'Maximum loan amounts', 'Appraisal standards'], 1,
    'Usury = charging interest above the legal maximum.');

  q('national', 'Finance', 'RESPA applies to:',
    ['All real estate transactions', 'Federally related residential mortgage loans',
      'Commercial loans only', 'Cash sales'], 1,
    'RESPA governs settlement services on federally related residential loans. It bans KICKBACKS and unearned fees (Section 8) and requires the Loan Estimate and Closing Disclosure.');

  q('national', 'Finance', 'Under RESPA, a title company pays a real estate broker $500 for each referred client. This is:',
    ['Legal if disclosed', 'An illegal kickback', 'A permitted marketing expense', 'Legal if under $1,000'], 1,
    'Section 8 of RESPA prohibits fees for referrals of settlement service business. Disclosure does not cure it, and there is no dollar threshold.');

  q('national', 'Finance', 'The Truth in Lending Act (Regulation Z) requires disclosure of the:',
    ['Sale price', 'Annual percentage rate and total finance charge', 'Property taxes', 'Appraised value'], 1,
    'TILA/Reg Z is about the COST OF CREDIT — APR, finance charge, amount financed, total of payments. It also governs advertising trigger terms.');

  q('national', 'Finance', 'An advertisement states "assume a 6% loan with only $5,000 down." Under Regulation Z this triggers:',
    ['Nothing, it is general information', 'The requirement to disclose additional credit terms including APR',
      'A fair housing violation', 'A RESPA violation'], 1,
    'Stating a specific down payment, payment amount, term, or finance charge is a TRIGGER TERM requiring full disclosure of the other key credit terms.');

  q('national', 'Finance', 'The Equal Credit Opportunity Act prohibits discrimination in lending based on all EXCEPT:',
    ['Marital status', 'Receipt of public assistance income', 'Age (if of legal contracting age)',
      'The applicant\'s credit score'], 3,
    'ECOA protects race, color, religion, national origin, sex, marital status, age, and receipt of public assistance. Creditworthiness itself is a legitimate basis for a decision.');

  q('national', 'Finance', 'A buyer takes title "subject to" the existing mortgage. This means:',
    ['The buyer becomes personally liable for the debt',
      'The seller remains personally liable; the buyer risks losing the property if payments stop',
      'The lender released the seller', 'The loan is paid off at closing'], 1,
    '"Subject to" = no personal liability for the buyer, seller still on the hook. ASSUMPTION with a release (novation) is what frees the seller.');

  q('national', 'Finance', 'In a contract for deed (land contract), during the contract term the seller holds:',
    ['Equitable title', 'Legal title, while the buyer holds equitable title',
      'No interest', 'A leasehold'], 1,
    'The vendor (seller) keeps LEGAL title until the contract is paid; the vendee (buyer) has EQUITABLE title and possession. Contracts for deed are very common in Minnesota.');

  q('national', 'Finance', 'A loan in which the payment covers interest only, leaving the principal due at the end, is a:',
    ['Fully amortized loan', 'Straight (term) loan', 'Graduated payment loan', 'Reverse mortgage'], 1,
    'A straight/term loan has interest-only payments and a balloon of the full principal. A fully amortized loan pays to zero over the term.');

  q('national', 'Finance', 'Discount points are paid to:',
    ['Lower the interest rate by prepaying interest to the lender',
      'Cover the appraisal', 'Pay the broker', 'Fund the escrow account'], 0,
    'Points are prepaid interest that buys down the rate. One point = 1% OF THE LOAN AMOUNT.');

  /* ======================================================================
     VALUATION  (national)
     ====================================================================== */

  q('national', 'Valuation', 'The principle stating that value tends to be set by the cost of acquiring an equally desirable substitute is:',
    ['Progression', 'Substitution', 'Conformity', 'Anticipation'], 1,
    'SUBSTITUTION underlies all three appraisal approaches, and it is the entire logic of the sales comparison approach.');

  q('national', 'Valuation', 'A modest home located among much larger, more expensive homes will tend to be worth more. This is:',
    ['Regression', 'Progression', 'Contribution', 'Plottage'], 1,
    'PROGRESSION: the lesser property is pulled UP by better neighbors. REGRESSION: the better property is pulled DOWN by lesser neighbors.');

  q('national', 'Valuation', 'In the sales comparison approach, adjustments are made to:',
    ['The subject property', 'The comparable properties', 'Both equally', 'The listing price'], 1,
    'Never adjust the subject. If the COMP is better, subtract from the comp; if the comp is inferior, add. Remember: "CBS" — Comp Better, Subtract.');

  q('national', 'Valuation', 'A four-bedroom home is in a neighborhood of two-bedroom homes and does not gain full value from the extra rooms. This illustrates:',
    ['Highest and best use', 'Over-improvement / the principle of conformity',
      'External obsolescence', 'Physical deterioration'], 1,
    'Conformity holds that maximum value arises when properties are reasonably similar. An over-improvement does not return its cost.');

  q('national', 'Valuation', 'Loss in value from an outdated floor plan or a one-car garage is:',
    ['Physical deterioration', 'Functional obsolescence', 'External obsolescence', 'Curable physical wear'], 1,
    'FUNCTIONAL = something wrong INSIDE the property\'s design or utility. PHYSICAL = wear and tear. EXTERNAL = caused by something off-site.');

  q('national', 'Valuation', 'A new landfill opens next to a subdivision, reducing home values. This is:',
    ['Functional obsolescence', 'Physical deterioration', 'External (economic) obsolescence', 'Curable depreciation'], 2,
    'External obsolescence comes from OUTSIDE the property line and is always considered INCURABLE — the owner cannot fix it.');

  q('national', 'Valuation', 'Which approach to value is most reliable for a single-family owner-occupied home?',
    ['Cost approach', 'Income approach', 'Sales comparison approach', 'Gross rent multiplier'], 2,
    'Sales comparison (market) approach is the primary method for residential. Cost approach is best for new or special-purpose buildings; income for investment property.');

  q('national', 'Valuation', 'The cost approach is MOST appropriate for:',
    ['A 60-year-old farmhouse', 'A new school or church with few comparable sales',
      'A rented duplex', 'A condominium'], 1,
    'Special-purpose and brand-new properties lack good comps and income, so reproduction/replacement cost minus depreciation plus land is the best indicator.');

  q('national', 'Valuation', 'Highest and best use must be all of the following EXCEPT:',
    ['Legally permissible', 'Physically possible', 'Financially feasible', 'The current use'], 3,
    'Highest and best use is the legally permissible, physically possible, financially feasible, and maximally productive use — which is frequently NOT the current use.');

  q('national', 'Valuation', 'A competitive market analysis (CMA) prepared by a licensee differs from an appraisal because it:',
    ['Is a certified opinion of value', 'Is not an appraisal and may not be represented as one',
      'Requires a USPAP report', 'Must be ordered by a lender'], 1,
    'A CMA helps set a listing or offer price. Calling it an appraisal, or charging a fee as though it were one, is a licensing violation.');

  q('national', 'Valuation', 'Market value differs from market price in that market value is:',
    ['What the property actually sold for', 'The most probable price under typical, arm\'s-length conditions',
      'Always higher than market price', 'Set by the county assessor'], 1,
    'Market PRICE is the historical fact of what was paid. Market VALUE is an opinion of what should be paid by a willing buyer and willing seller, neither under duress.');

  /* ======================================================================
     FAIR HOUSING  (national)
     ====================================================================== */

  q('national', 'Fair Housing', 'The seven protected classes under the federal Fair Housing Act are race, color, religion, sex, national origin, disability, and:',
    ['Age', 'Familial status', 'Marital status', 'Source of income'], 1,
    'Familial status (children under 18, pregnant women, those securing custody) was added in 1988 along with disability. Age and marital status are NOT federal classes — but marital status IS protected in Minnesota.');

  q('national', 'Fair Housing', 'Directing buyers of a particular race toward or away from certain neighborhoods is:',
    ['Blockbusting', 'Steering', 'Redlining', 'Panic selling'], 1,
    'STEERING = channeling people based on a protected class. BLOCKBUSTING = inducing panic selling. REDLINING = a lender or insurer denying service to an area.');

  q('national', 'Fair Housing', 'Telling homeowners that property values will drop because minority families are moving in, to induce listings, is:',
    ['Steering', 'Blockbusting', 'Redlining', 'A legitimate market opinion'], 1,
    'Blockbusting (panic peddling) is a serious federal violation, whether or not the statement is true.');

  q('national', 'Fair Housing', 'A landlord must permit a tenant with a disability to install a wheelchair ramp. Under federal law:',
    ['The landlord pays for the modification', 'The tenant generally pays for the reasonable modification',
      'The request may be denied', 'Only new buildings are covered'], 1,
    'Reasonable MODIFICATIONS (physical changes) are generally at the TENANT\'s expense; reasonable ACCOMMODATIONS (rule changes, like waiving a no-pets policy for a service animal) are at the landlord\'s expense.');

  q('national', 'Fair Housing', 'A tenant with a documented need requests an assistance animal in a "no pets" building. The landlord should:',
    ['Charge a pet deposit', 'Deny the request', 'Grant a reasonable accommodation with no pet fee',
      'Require the animal be professionally certified'], 2,
    'An assistance animal is not a pet. Pet fees and deposits may not be charged, and there is no federal "certification" requirement.');

  q('national', 'Fair Housing', 'Which advertisement most likely violates fair housing law?',
    ['"Spacious 3-bedroom near schools"', '"Perfect for a Christian family"',
      '"Newly remodeled, walk-in closet"', '"Quiet cul-de-sac location"'], 1,
    'Ads must describe the PROPERTY, not the desired occupant. References to religion, family makeup, or ethnicity signal a preference and violate the Act.');

  q('national', 'Fair Housing', 'The "Mrs. Murphy" exemption may apply to:',
    ['A single-family home sold by an owner using a broker',
      'An owner-occupied building with four or fewer units, when no broker is used',
      'Any apartment complex', 'All rentals under $1,000'], 1,
    'Even where an exemption exists, it is lost if a real estate LICENSEE is involved or if discriminatory ADVERTISING is used. Race discrimination is never exempt (42 U.S.C. 1982 / Jones v. Mayer).');

  q('national', 'Fair Housing', 'A buyer asks an agent about the racial makeup of a neighborhood. The agent should:',
    ['Provide the census data', 'Give a general impression',
      'Decline to answer and explain that fair housing law prohibits such guidance, offering objective sources instead',
      'Refuse to work with the buyer'], 2,
    'Answering would be steering, regardless of intent or of which answer the buyer wants to hear. Point them to publicly available objective data they can research themselves.');

  /* ======================================================================
     MINNESOTA — LICENSE LAW  (state)
     ====================================================================== */

  q('state', 'MN License Law', 'Real estate licensing in Minnesota is governed primarily by which chapter of Minnesota Statutes?',
    ['Chapter 82', 'Chapter 513', 'Chapter 515B', 'Chapter 559'], 0,
    'Chapter 82 is the real estate license law. Ch. 513 is seller disclosure, Ch. 515B is MCIOA (common interest communities), Ch. 559 covers contract for deed cancellation.');

  q('state', 'MN License Law', 'Minnesota real estate licensees are regulated by the:',
    ['Department of Housing', 'Commissioner of Commerce', 'Real Estate Commission', 'Attorney General'], 1,
    'The Minnesota Department of Commerce, headed by the Commissioner of Commerce, issues licenses, investigates complaints, and imposes discipline.');

  q('state', 'MN License Law', 'A Minnesota salesperson\'s license is held:',
    ['By the salesperson personally, allowing independent practice',
      'By the broker with whom the salesperson is affiliated',
      'By the Department of Commerce until renewal', 'By the local association of REALTORS'], 1,
    'A salesperson may act only under the supervision of a licensed broker, and the broker holds the license. Compensation must come from the salesperson\'s own broker.');

  q('state', 'MN License Law', 'Minnesota pre-license education for a salesperson consists of:',
    ['30 hours total', '60 hours total', '90 hours (three 30-hour courses)', '120 hours total'], 2,
    'Course I (30 hours) must be completed before taking the exam; Courses II and III (30 hours each) must be completed before the license is issued.');

  q('state', 'MN License Law', 'Minnesota continuing education for a salesperson requires:',
    ['15 hours per year with no two-year total', '30 hours per two-year license period, with at least 15 hours each year',
      '20 hours every two years', '45 hours every three years'], 1,
    '30 hours per 24-month cycle, minimum 15 hours each license year by June 30, including the current year\'s required Commissioner-designated module.');

  q('state', 'MN License Law', 'If a written agreement is silent about the timing, a Minnesota listing broker must deposit earnest money into the trust account within:',
    ['24 hours', 'Three business days of receipt or final acceptance, whichever is later',
      'Five business days', 'Ten days'], 1,
    'Minn. Stat. 82.75. Note also that if an offer is REJECTED, the earnest money must be returned to the prospective buyer no later than the next business day.');

  q('state', 'MN License Law', 'Commingling means:',
    ['Depositing client trust funds into the broker\'s business or personal account',
      'Sharing a commission with a cooperating broker',
      'Working with two clients at once', 'Holding two licenses'], 0,
    'Commingling client money with the broker\'s own funds is a serious violation. CONVERSION — actually spending client funds — is worse still.');

  q('state', 'MN License Law', 'A Minnesota licensee may accept compensation for real estate services from:',
    ['Any party to the transaction', 'The licensee\'s own broker only',
      'The buyer directly', 'The title company'], 1,
    'A salesperson is paid by their broker, not directly by clients, customers, or other brokerages.');

  q('state', 'MN License Law', 'The Minnesota agency disclosure must be provided to a consumer:',
    ['At closing', 'At the first substantive contact with the consumer',
      'Only when an offer is written', 'Only if the consumer requests it'], 1,
    'The Agency Relationships in Real Estate Transactions disclosure is delivered at FIRST SUBSTANTIVE CONTACT, before confidential information is exchanged. It is a disclosure, not a contract.');

  q('state', 'MN License Law', 'Which agency status does Minnesota specifically recognize for a licensee who represents NEITHER party?',
    ['Subagent', 'Facilitator', 'Designated broker', 'Universal agent'], 1,
    'A Minnesota FACILITATOR is not an agent. The facilitator owes limited duties — reasonable care, accounting for money, and confidentiality of certain information — but not loyalty or advocacy.');

  q('state', 'MN License Law', 'Dual agency in Minnesota requires:',
    ['Only oral consent', 'Written consent of both the seller and the buyer',
      'Approval from the Commissioner', 'Nothing, if disclosed at closing'], 1,
    'Both parties must give informed WRITTEN consent, typically obtained up front in the listing agreement and the buyer representation agreement, and confirmed again in the purchase agreement.');

  q('state', 'MN License Law', 'A Minnesota dual agent may NOT:',
    ['Prepare the purchase agreement', 'Disclose to one party confidential information about the other, such as price motivation',
      'Collect a commission from the seller', 'Show the property'], 1,
    'In dual agency the licensee cannot advocate for either side and must not reveal one party\'s price or terms flexibility to the other.');

  q('state', 'MN License Law', 'Minnesota listing agreements must contain a definite expiration date and:',
    ['An automatic renewal clause', 'A prohibition on automatic renewal (override/protective clauses are limited)',
      'A net listing provision', 'A waiver of agency duties'], 1,
    'Minnesota prohibits automatic-renewal listing provisions. A definite termination date is required, and the override (protection) period has statutory limits.');

  q('state', 'MN License Law', 'Advertising a listed property, a Minnesota salesperson must include:',
    ['Only the salesperson\'s name', 'The name of the broker or brokerage as it appears on the license',
      'The seller\'s name', 'The MLS number only'], 1,
    'All advertising must identify the licensed brokerage. Advertising that suggests the salesperson is acting independently is a "blind ad" violation.');

  q('state', 'MN License Law', 'A Minnesota licensee who wants to purchase a listed property personally must:',
    ['Say nothing until closing', 'Disclose the licensee status in writing to the seller',
      'Resign the license', 'Buy only through another brokerage'], 1,
    'Licensees must disclose their licensed status in writing when buying or selling for their own account — nondisclosure is a Chapter 82 violation.');

  q('state', 'MN License Law', 'The purpose of the Minnesota real estate education, research, and recovery fund is to:',
    ['Pay licensees\' legal fees', 'Compensate members of the public who suffer actual loss from certain licensee misconduct',
      'Fund the Department of Commerce salaries', 'Provide free continuing education'], 1,
    'The recovery fund reimburses aggrieved consumers when a judgment against a licensee cannot be collected. The licensee\'s license is suspended until the fund is repaid.');

  q('state', 'MN License Law', 'A Minnesota licensee is convicted of felony theft. The Commissioner may:',
    ['Take no action, since it was outside real estate', 'Deny, suspend, or revoke the license',
      'Only issue a warning', 'Require an extra CE course only'], 1,
    'The Commissioner may discipline for conduct demonstrating untrustworthiness or financial irresponsibility, including conduct outside the practice of real estate.');

  /* ======================================================================
     MINNESOTA — DISCLOSURES  (state)
     ====================================================================== */

  q('state', 'MN Disclosures', 'Minnesota\'s seller disclosure law (Minn. Stat. 513.52-.60) requires the seller to disclose:',
    ['Only defects the buyer asks about', 'All material facts of which the seller is aware that could adversely and significantly affect ordinary use or enjoyment of the property',
      'Only structural defects', 'Nothing if the property is sold as-is'], 1,
    'The standard is what the SELLER KNOWS and that MATERIALLY affects use or enjoyment. A seller may alternatively furnish qualifying written inspection reports in lieu of the disclosure.');

  q('state', 'MN Disclosures', 'Under the Minnesota Radon Awareness Act, before signing a purchase agreement the seller must give the buyer:',
    ['A radon test result', 'A radon disclosure plus the MDH publication "Radon in Real Estate Transactions"',
      'A mitigation system', 'Nothing, radon is not regulated'], 1,
    'Minn. Stat. 144.496 requires the written disclosure of known radon information AND delivery of the Minnesota Department of Health publication. Testing itself is not mandatory.');

  q('state', 'MN Disclosures', 'A Minnesota well disclosure statement is required:',
    ['Only for commercial property', 'At the time of transfer, disclosing the status and location of all known wells',
      'Only if the well is in use', 'Only in the metro area'], 1,
    'Minn. Stat. 103I.235. The seller must disclose known wells, their status, and location; a Well Disclosure Certificate is filed with the deed unless an exemption applies.');

  q('state', 'MN Disclosures', 'A property is served by an individual septic system. Minnesota law requires disclosure of the:',
    ['Water heater age', 'Subsurface sewage treatment system (SSTS) location and status',
      'Electrical panel size', 'Number of bedrooms only'], 1,
    'Minn. Stat. 115.55 requires written disclosure of a known SSTS, including whether it is in use and whether it is compliant or failing.');

  q('state', 'MN Disclosures', 'Minnesota requires a seller to disclose if the property was ever used for:',
    ['A home business', 'Methamphetamine production', 'A rental', 'Smoking'], 1,
    'Minn. Stat. 152.0275 requires disclosure of known methamphetamine production on the property, unless remediation was completed per Department of Health standards.');

  q('state', 'MN Disclosures', 'Regarding a predatory offender living in the neighborhood, a Minnesota licensee:',
    ['Must disclose the offender\'s address', 'Has no duty to disclose and should refer the buyer to law enforcement and the public database',
      'Must cancel the transaction', 'Must notify the Commissioner'], 1,
    'Disclosing this is not the licensee\'s role and risks fair housing and privacy problems. Refer buyers to the BCA predatory offender database and local law enforcement.');

  q('state', 'MN Disclosures', 'Under federal law, a home built before 1978 requires:',
    ['A radon test', 'Lead-based paint disclosure and the EPA pamphlet, with a 10-day inspection opportunity',
      'An SSTS disclosure', 'A well certificate'], 1,
    'The Residential Lead-Based Paint Hazard Reduction Act applies to target housing built BEFORE 1978. The buyer gets a 10-day opportunity to test unless waived in writing.');

  q('state', 'MN Disclosures', 'Minnesota law states that a "stigmatized" property — for example, one where a death occurred — is:',
    ['A material fact that must always be disclosed', 'Not a material fact requiring disclosure',
      'Cause to cancel the listing', 'Disclosed only to buyers with children'], 1,
    'Minnesota statute provides that a perceived psychological impairment (a death, suicide, or reputed haunting) is NOT a material fact requiring disclosure.');

  q('state', 'MN Disclosures', 'A Minnesota property is within an airport zoning district. The seller must:',
    ['Say nothing', 'Provide the required airport zoning disclosure to the buyer',
      'Obtain FAA approval', 'Install soundproofing'], 1,
    'Minnesota requires disclosure when property lies within a designated airport zoning district, so buyers understand height and use restrictions and noise exposure.');

  q('state', 'MN Disclosures', 'Under Minnesota\'s statutory new-home warranty (Ch. 327A), major construction defects are warranted for:',
    ['1 year', '2 years', '5 years', '10 years'], 3,
    '1 year for defects in workmanship and materials; 2 years for plumbing, electrical, heating, and cooling systems; 10 years for MAJOR STRUCTURAL defects.');

  /* ======================================================================
     MINNESOTA — CONTRACTS, CLOSING & OWNERSHIP  (state)
     ====================================================================== */

  q('state', 'MN Contracts', 'A Minnesota contract for deed on which the buyer has paid 15% of the purchase price may be cancelled by statutory notice giving the buyer:',
    ['30 days to cure', '60 days to cure', '90 days to cure', '6 months to cure'], 1,
    'Minn. Stat. 559.21 tiers the cure period by how much has been paid: LESS THAN 10% = 30 days; 10% up to 25% = 60 days; 25% or more = 90 days.');

  q('state', 'MN Contracts', 'In a Minnesota contract for deed, the buyer (vendee) holds:',
    ['Legal title', 'Equitable title and possession', 'A leasehold interest', 'No interest until paid in full'], 1,
    'The vendor keeps legal title as security; the vendee has equitable title and possession, and receives the deed when the contract is satisfied.');

  q('state', 'MN Contracts', 'Minnesota is which type of state for mortgage theory?',
    ['Title theory', 'Lien theory', 'Intermediate theory', 'Equitable theory'], 1,
    'In lien theory the borrower holds title and possession; the lender has only a lien. Minnesota nonetheless permits non-judicial foreclosure by advertisement when the mortgage has a power of sale.');

  q('state', 'MN Contracts', 'The typical redemption period after a Minnesota mortgage foreclosure sale by advertisement is:',
    ['30 days', '6 months', '1 year', '2 years'], 1,
    'Six months is the standard statutory redemption period, though shorter or longer periods apply in certain circumstances (abandonment, large tracts, or agricultural property).');

  q('state', 'MN Contracts', 'Minnesota\'s Torrens system differs from abstract (recording) property because Torrens property has:',
    ['No property taxes', 'A Certificate of Title issued by the county, in which the state adjudicates ownership',
      'No legal description', 'No mortgages'], 1,
    'Torrens (registered) land carries a Certificate of Title listing all memorials/encumbrances. It is common in Hennepin and Ramsey counties. Abstract property relies on a chain-of-title search.');

  q('state', 'MN Contracts', 'The Minnesota Common Interest Ownership Act (MCIOA) is found in:',
    ['Chapter 82', 'Chapter 515B', 'Chapter 513', 'Chapter 327A'], 1,
    'MCIOA (Ch. 515B) governs condominiums, townhomes, and cooperatives — including the resale disclosure certificate a seller must furnish to a buyer.');

  q('state', 'MN Contracts', 'On the resale of a Minnesota unit governed by MCIOA, the buyer generally may cancel within:',
    ['24 hours of signing', '10 days after receiving the resale disclosure certificate',
      '30 days after closing', 'There is no cancellation right'], 1,
    'The buyer\'s cancellation right runs from delivery of the resale disclosure certificate, which discloses assessments, budgets, reserves, and pending litigation.');

  q('state', 'MN Contracts', 'Minnesota state deed tax is customarily paid by the ____ and is based on the ____.',
    ['buyer; loan amount', 'seller; sale price (net consideration)',
      'buyer; sale price', 'lender; appraised value'], 1,
    'Deed tax = 0.0033 of net consideration, customarily a SELLER cost. Do not confuse it with the mortgage registry tax (0.0023 of the loan, customarily a BUYER cost).');

  q('state', 'MN Contracts', 'Minnesota mortgage registry tax is calculated on:',
    ['The sale price', 'The principal debt secured by the mortgage', 'The appraised value', 'The down payment'], 1,
    '0.0023 of the loan amount statewide, plus 0.0001 ERF in Hennepin and Ramsey counties.');

  q('state', 'MN Contracts', 'Minnesota real estate taxes are:',
    ['Paid in advance for the coming year', 'Paid in arrears, typically in two installments (May 15 and October 15)',
      'Paid monthly to the county', 'Paid only at closing'], 1,
    'Because taxes are paid in ARREARS, at closing the seller typically owes the buyer for the portion of the year the seller owned the property — a seller debit and buyer credit.');

  q('state', 'MN Contracts', 'The Minnesota Human Rights Act protects several classes beyond the federal Fair Housing Act, including:',
    ['Height and weight', 'Marital status, status with regard to public assistance, and sexual orientation',
      'Occupation', 'Political affiliation only'], 1,
    'MHRA (Ch. 363A) adds creed, marital status, status with regard to public assistance, sexual orientation and gender identity, and (in some contexts) age to the federal list.');

  q('state', 'MN Contracts', 'A Minnesota landlord may enter a leased residential unit:',
    ['At any time without notice', 'Only after making a reasonable attempt to give reasonable notice, for a reasonable business purpose',
      'Only with a court order', 'Only during business hours on weekdays'], 1,
    'Minnesota law requires a reasonable business purpose and a good-faith effort to give reasonable notice, except in emergencies.');

  q('state', 'MN Contracts', 'A Minnesota residential tenant\'s security deposit must generally be returned, with interest and any itemized withholding, within:',
    ['7 days after move-out', '21 days after the tenancy ends and the landlord receives a forwarding address',
      '60 days', '90 days'], 1,
    'Minnesota requires return within three weeks, with a written statement of any amounts withheld. Bad-faith retention exposes the landlord to penalties.');

  q('state', 'MN Contracts', 'In Minnesota, who may legally prepare a purchase agreement for a residential transaction?',
    ['Only a licensed attorney', 'A licensee may complete standard forms incident to the transaction, but may not give legal advice',
      'Any party to the transaction only', 'Only the title company'], 1,
    'Filling in blanks on approved standard forms is permitted; drafting custom legal provisions or advising on legal consequences is the unauthorized practice of law.');

  q('state', 'MN Contracts', 'A Minnesota buyer\'s broker agreement must:',
    ['Be oral only', 'Be in writing with a definite expiration date, and may not automatically renew',
      'Be filed with the Commissioner', 'Last at least one year'], 1,
    'Like listing agreements, buyer representation agreements require writing, a definite termination date, and no automatic renewal.');

  q('state', 'MN Contracts', 'Minnesota homestead property tax classification primarily benefits:',
    ['Commercial owners', 'Owner-occupants of their primary residence',
      'Out-of-state investors', 'New construction only'], 1,
    'Homestead classification gives owner-occupants a lower effective property tax burden. It must be applied for with the county, and the buyer\'s agent should remind buyers to file.');

  /* ======================================================================
     MATH CONCEPTS (rules without calculation)
     ====================================================================== */

  q('national', 'Math Concepts', 'One acre contains how many square feet?',
    ['5,280', '43,560', '640', '10,000'], 1,
    '43,560 sq ft = 1 acre. Also memorize: 5,280 feet in a mile; 640 acres in a section; 36 sections in a township; 9 sq ft in a sq yard.');

  q('national', 'Math Concepts', 'A section of land contains:',
    ['40 acres', '160 acres', '640 acres', '5,280 acres'], 2,
    'A section is one square mile = 640 acres. A quarter section = 160 acres; a quarter-quarter = 40 acres.');

  q('national', 'Math Concepts', 'One mill equals:',
    ['$1 per $100 of value', '$1 per $1,000 of value', '1% of value', '$10 per $1,000 of value'], 1,
    'A mill is one-tenth of a cent, or 0.001 — that is $1 of tax per $1,000 of assessed value.');

  q('national', 'Math Concepts', 'A seller wants to net a specific amount after a 6% commission. To find the required sale price you should:',
    ['Multiply the net by 1.06', 'Divide the net (plus costs) by 0.94',
      'Add 6% of the net to the net', 'Divide the net by 1.06'], 1,
    'The seller keeps 94% of the price, so Price = (net + costs) / 0.94. Multiplying by 1.06 is the classic wrong answer and always appears as a choice.');

  q('national', 'Math Concepts', 'In the IRV formula used in the income approach, to find VALUE you:',
    ['Multiply income by rate', 'Divide income by rate', 'Divide rate by income', 'Add income and rate'], 1,
    'Income = Rate x Value, so Value = Income / Rate and Rate = Income / Value. Cover the letter you want in the triangle.');

  q('national', 'Math Concepts', 'Discount points are calculated as a percentage of the:',
    ['Sale price', 'Loan amount', 'Appraised value', 'Down payment'], 1,
    'One point = 1% of the LOAN. On a $300,000 loan, 2 points cost $6,000.');

  q('national', 'Math Concepts', 'When prorating an item that the seller has already PREPAID, the closing statement shows:',
    ['A debit to the seller and a credit to the buyer', 'A credit to the seller and a debit to the buyer',
      'A debit to both', 'No entry'], 1,
    'Prepaid (insurance, HOA dues) = credit seller. Paid in ARREARS (Minnesota real estate taxes) = credit buyer, debit seller.');

  q('national', 'Math Concepts', 'The sale price appears on the closing statement as:',
    ['A credit to the buyer and a debit to the seller', 'A debit to the buyer and a credit to the seller',
      'A debit to both parties', 'A credit to both parties'], 1,
    'The buyer OWES the price (debit) and the seller EARNS it (credit). Earnest money and the new loan are buyer CREDITS.');

  q('national', 'Math Concepts', 'Land is depreciated in the cost approach:',
    ['Over 27.5 years', 'Over 39 years', 'Never — land does not depreciate', 'At the same rate as the building'], 2,
    'Only improvements depreciate. In the cost approach you depreciate the building, then ADD BACK the full site value.');

  q('national', 'Math Concepts', 'To convert square feet to square yards, you:',
    ['Multiply by 3', 'Divide by 3', 'Divide by 9', 'Multiply by 9'], 2,
    'A square yard is 3 ft x 3 ft = 9 square feet. Carpet questions depend on this.');

  q('national', 'Math Concepts', 'A lender will base the loan amount on:',
    ['The sale price always', 'The appraised value always', 'The LESSER of sale price or appraised value',
      'The greater of sale price or appraised value'], 2,
    'Always the LESSER. A low appraisal means the buyer must bring extra cash to bridge the gap.');

  q('national', 'Math Concepts', 'To find the percent of profit on a sale, you divide the profit by:',
    ['The sale price', 'The original purchase price', 'The appraised value', 'The loan amount'], 1,
    'Percent change is always measured against what you STARTED with. Dividing by the sale price gives a smaller, incorrect figure.');

  /* ======================================================================
     PROFESSIONAL PRACTICE & ETHICS
     ====================================================================== */

  q('national', 'Ethics', 'A licensee discovers the seller lied on the disclosure about a chronic wet basement. The licensee should:',
    ['Say nothing, since the seller is the client', 'Refuse to disclose but continue marketing',
      'Advise the seller to correct the disclosure and, if the seller refuses, disclose the material fact or withdraw',
      'Disclose only if the buyer asks directly'], 2,
    'The duty of confidentiality never covers concealing a known MATERIAL DEFECT. Participating in the misrepresentation exposes the licensee to discipline and civil liability.');

  q('national', 'Ethics', 'A buyer asks the agent to write an offer at a price the agent believes is far too high. The agent should:',
    ['Refuse to write the offer', 'Write the offer as instructed while advising the buyer of the agent\'s market opinion',
      'Change the price to what is reasonable', 'Present it to the seller as a lower offer'], 1,
    'The duty of obedience covers lawful instructions. The agent advises but the CLIENT decides — and altering the client\'s terms is never acceptable.');

  q('national', 'Ethics', 'All offers received on a listed property must be:',
    ['Presented only if above list price', 'Presented to the seller promptly, even after another offer is accepted, unless the seller instructs otherwise in writing',
      'Screened by the broker for suitability', 'Presented only if accompanied by a preapproval'], 1,
    'Prompt presentation of ALL offers is a core duty. The seller decides which to accept; the licensee does not filter offers based on personal judgment.');

  q('national', 'Ethics', 'A licensee is asked to perform a task outside their expertise, such as evaluating a structural crack. The proper response is to:',
    ['Give a best guess', 'Recommend the client consult a qualified professional',
      'Ignore the issue', 'Refer it to the listing broker'], 1,
    'Competence is an ethical duty. Licensees must not practice engineering, law, or appraisal — refer clients to appropriate licensed professionals.');

  q('national', 'Ethics', 'A licensee posts on social media that a specific listing "will definitely appraise at $400,000." This is:',
    ['Acceptable marketing', 'Puffing', 'A potentially actionable misrepresentation and possibly an unlicensed appraisal opinion',
      'Required disclosure'], 2,
    'Stating a definite future valuation as fact goes beyond opinion and can constitute misrepresentation as well as holding out an appraisal opinion without an appraiser license.');

  q('national', 'Ethics', 'A broker\'s duty of accounting requires:',
    ['Preparing the client\'s tax return', 'Promptly reporting and safeguarding all money and documents received on behalf of the client',
      'Auditing the title company', 'Filing the closing statement with the state'], 1,
    'Accounting covers earnest money, keys, and documents. Trust account records must be maintained and available for inspection by the Commissioner.');

  /* ======================================================================
     TRANSFER OF TITLE  (national)
     ====================================================================== */

  q('national', 'Transfer of Title', 'An owner-occupant claims ownership of a strip of a neighbor\'s land after openly using it, without permission, for the statutory period. This is:',
    ['Adverse possession', 'Accretion', 'Escheat', 'Novation'], 0,
    'Adverse possession requires possession that is Open, Notorious, Continuous, Hostile, and Actual for the statutory period. Permission defeats the claim — a permissive use is a license.');

  q('national', 'Transfer of Title', 'A person dies without a will. The property passes:',
    ['To the state immediately', 'By the state\'s laws of intestate succession to the heirs',
      'To the mortgage lender', 'To the county'], 1,
    'Dying intestate means statutory succession decides the heirs. Only if NO heirs can be found does the property escheat to the state.');

  q('national', 'Transfer of Title', 'A gift of real property by will is a:',
    ['Bequest', 'Devise', 'Legacy', 'Codicil'], 1,
    'DEVISE = real property (the recipient is the devisee). BEQUEST/LEGACY = personal property. A CODICIL amends an existing will.');

  q('national', 'Transfer of Title', 'The clause in a deed that defines the extent of ownership being conveyed ("to have and to hold") is the:',
    ['Granting clause', 'Habendum clause', 'Defeasance clause', 'Acceleration clause'], 1,
    'The GRANTING clause states the intent to convey; the HABENDUM clause defines and limits the estate granted.');

  q('national', 'Transfer of Title', 'An owner\'s title insurance policy protects:',
    ['The lender for the life of the loan', 'The owner against defects existing before the policy date',
      'Against future liens the owner creates', 'The buyer\'s down payment only'], 1,
    'Title insurance is retrospective — it covers defects that already existed but were undiscovered. A LENDER\'s policy protects only the lender and shrinks as the loan is repaid.');

  q('national', 'Transfer of Title', 'Which would NOT appear as an exception in a standard title policy?',
    ['Rights of parties in possession', 'Unrecorded easements',
      'A recorded mortgage disclosed in the commitment', 'Boundary disputes a survey would reveal'], 2,
    'Standard policies except the things a record search cannot find. A properly disclosed recorded lien is a known matter handled at closing, not an unlisted risk.');

  q('national', 'Transfer of Title', 'Land gradually added to a waterfront lot by the natural deposit of soil is acquired by:',
    ['Avulsion', 'Accretion', 'Erosion', 'Reliction'], 1,
    'ACCRETION = gradual buildup (the owner gains it). AVULSION = sudden loss or addition by violent action (boundaries generally do not change). RELICTION = water receding to expose land.');

  q('national', 'Transfer of Title', 'A quiet title action is used to:',
    ['Evict a tenant', 'Have a court determine ownership and clear defects',
      'Reduce property taxes', 'Enforce a zoning ordinance'], 1,
    'When a cloud cannot be cleared by a quitclaim — for instance an unlocatable heir — a court proceeding settles title.');

  q('national', 'Transfer of Title', 'An abstract of title is:',
    ['An insurance policy', 'A condensed history of all recorded documents affecting the property',
      'A survey', 'A deed'], 1,
    'The abstract summarizes the chain of title; an attorney then renders an opinion of title based on it. It is not insurance and does not guarantee title.');

  q('national', 'Transfer of Title', 'Marketable title means title that is:',
    ['Free of every conceivable claim', 'Reasonably free of defects such that a prudent buyer would accept it',
      'Guaranteed by the state', 'Insured for the full purchase price'], 1,
    'The standard is reasonableness, not perfection. Ordinary utility easements and recorded covenants generally do not make title unmarketable.');

  q('national', 'Transfer of Title', 'For a deed to be recorded it generally must be:',
    ['Signed by the grantee', 'Acknowledged (notarized) by the grantor',
      'Approved by the lender', 'Witnessed by the buyer'], 1,
    'Recording statutes require acknowledgment to deter forgery. Note the grantee never signs the deed — only the grantor does.');

  q('national', 'Transfer of Title', 'Two deeds to the same property are executed. The one that generally prevails is the deed that was:',
    ['Signed first', 'Recorded first by a good-faith purchaser without notice',
      'For the higher price', 'Notarized first'], 1,
    'Recording establishes priority. This is precisely why recording matters even though a deed is valid between the parties without it.');

  /* ======================================================================
     LEASES & PROPERTY MANAGEMENT  (national)
     ====================================================================== */

  q('national', 'Leases', 'In a gross lease, the tenant pays:',
    ['Rent plus taxes, insurance, and maintenance', 'A fixed rent while the landlord pays the operating expenses',
      'A percentage of sales', 'Only the utilities'], 1,
    'GROSS = landlord absorbs expenses. NET = tenant pays some or all of taxes, insurance, and maintenance on top of base rent.');

  q('national', 'Leases', 'A retail lease requiring base rent plus a share of the tenant\'s gross sales is a:',
    ['Net lease', 'Percentage lease', 'Ground lease', 'Gross lease'], 1,
    'Percentage leases are standard in shopping centers, letting the landlord share in a successful tenant\'s volume.');

  q('national', 'Leases', 'The difference between an assignment and a sublease is that in an assignment the original tenant:',
    ['Retains part of the leasehold interest', 'Transfers the ENTIRE remaining leasehold interest',
      'Becomes the landlord', 'Is released from all liability automatically'], 1,
    'ASSIGNMENT = whole remaining term. SUBLEASE = the tenant keeps a reversionary interest. In neither case is the original tenant automatically released from liability.');

  q('national', 'Leases', 'A landlord fails to provide heat all winter and the tenant moves out. The tenant may claim:',
    ['Actual eviction', 'Constructive eviction', 'Adverse possession', 'Novation'], 1,
    'Constructive eviction: the landlord\'s breach makes the premises unusable. The tenant must actually VACATE within a reasonable time to claim it.');

  q('national', 'Leases', 'The covenant of quiet enjoyment guarantees the tenant:',
    ['A soundproof unit', 'Possession without interference from the landlord or superior title claims',
      'The right to sublease', 'A rent reduction for noise'], 1,
    'It concerns legal possession, not literal noise — a frequent trap in the wording of the answer choices.');

  q('national', 'Leases', 'If a leased property is sold, an existing valid lease generally:',
    ['Terminates at closing', 'Survives and binds the new owner',
      'Must be renegotiated', 'Converts to a month-to-month'], 1,
    'The buyer takes subject to existing leases. This is why estoppel certificates and rent rolls are reviewed during due diligence.');

  q('national', 'Leases', 'A ground lease is typically:',
    ['A short-term residential lease', 'A long-term lease of land on which the tenant builds improvements',
      'A lease of farmland only', 'A lease with no rent'], 1,
    'Ground leases commonly run 50-99 years because the tenant must amortize the cost of a building on land it does not own.');

  q('national', 'Leases', 'Under the Americans with Disabilities Act, a commercial property owner must:',
    ['Rebuild the property entirely', 'Remove barriers to public accommodations when readily achievable',
      'Ignore existing structures', 'Provide housing accommodations'], 1,
    'The ADA governs public accommodations and commercial facilities. Fair housing law — not the ADA — is what governs residential disability accommodations.');

  /* ======================================================================
     LAND USE & ENVIRONMENTAL  (national)
     ====================================================================== */

  q('national', 'Land Use', 'An owner wants to build closer to the lot line than the setback allows because of an odd lot shape. The owner should seek a:',
    ['Nonconforming use', 'Variance', 'Rezoning', 'Special use permit'], 1,
    'A VARIANCE permits a deviation from the rules due to hardship unique to the parcel. A SPECIAL USE PERMIT allows a use the zoning already contemplates, like a church in a residential zone.');

  q('national', 'Land Use', 'Rezoning a single small parcel to benefit one owner, inconsistent with the surrounding area, is:',
    ['Downzoning', 'Spot zoning', 'A variance', 'Inverse condemnation'], 1,
    'Spot zoning is generally illegal because it is not part of a comprehensive plan.');

  q('national', 'Land Use', 'The document a municipality issues confirming a new building may be occupied is a:',
    ['Building permit', 'Certificate of occupancy', 'Plat', 'Deed restriction'], 1,
    'The permit authorizes construction; the CO confirms completion in compliance with code and authorizes occupancy.');

  q('national', 'Land Use', 'Government taking of private property for public use, with just compensation, is:',
    ['Police power', 'Eminent domain, exercised through condemnation', 'Escheat', 'Adverse possession'], 1,
    'Eminent domain is the POWER; condemnation is the PROCESS. Compensation is required, unlike an exercise of police power such as zoning.');

  q('national', 'Land Use', 'A government regulation so restrictive that it destroys nearly all economic value of a property may support a claim of:',
    ['Inverse condemnation (regulatory taking)', 'Adverse possession', 'Escheat', 'Novation'], 0,
    'The owner sues arguing a taking occurred without compensation. Ordinary zoning that merely reduces value is not a taking.');

  q('national', 'Land Use', 'Under CERCLA (Superfund), liability for cleanup of contamination is generally:',
    ['Limited to the party who caused it', 'Strict, joint and several, and retroactive',
      'Capped at the property value', 'Waived for innocent buyers with no defense available'], 1,
    'A current owner can be liable even without causing the contamination. The "innocent landowner" defense generally requires all appropriate inquiry — an environmental site assessment — before purchase.');

  q('national', 'Land Use', 'A federal disclosure requirement applies to residential properties built before which year?',
    ['1968', '1972', '1978', '1988'], 2,
    'The lead-based paint rule applies to target housing built BEFORE 1978. Sellers and landlords must disclose known hazards and provide the EPA pamphlet.');

  q('national', 'Land Use', 'Radon is best described as:',
    ['A synthetic insulation material', 'A naturally occurring radioactive gas that enters through the foundation',
      'A byproduct of lead paint', 'A form of asbestos'], 1,
    'Radon is the second leading cause of lung cancer in the US and is common in the upper Midwest. It is mitigated with sub-slab depressurization systems.');

  q('national', 'Land Use', 'The most common environmental concern with a property served by a former gas station site is:',
    ['Radon', 'An underground storage tank (UST)', 'Asbestos', 'Lead paint'], 1,
    'USTs can leak petroleum into soil and groundwater, creating cleanup liability that can far exceed the property value.');

  q('national', 'Land Use', 'A property lies in a designated FEMA special flood hazard area. A federally regulated lender will:',
    ['Refuse the loan', 'Require flood insurance', 'Ignore it', 'Require a radon test'], 1,
    'Flood insurance is mandatory for federally related loans in a special flood hazard area, typically through the National Flood Insurance Program.');

  q('national', 'Land Use', 'Private deed restrictions and public zoning conflict on lot coverage. Which controls?',
    ['Zoning always', 'The deed restriction always', 'Whichever is MORE restrictive', 'Neither is enforceable'], 2,
    'The more restrictive provision governs. Zoning sets a floor of regulation; private covenants may go further.');

  q('national', 'Land Use', 'A subdivision developer must typically record a:',
    ['Plat map showing lots, blocks, streets, and easements', 'Deed for each future buyer',
      'Title policy', 'Mortgage'], 0,
    'The recorded plat creates the lot-and-block legal descriptions used for all future conveyances in the subdivision.');

  /* ======================================================================
     PROPERTY CHARACTERISTICS & DESCRIPTIONS  (national)
     ====================================================================== */

  q('national', 'Property & Title', 'An owner whose land borders a flowing river has:',
    ['Littoral rights', 'Riparian rights', 'Prior appropriation rights', 'No water rights'], 1,
    'RIPARIAN = rivers and streams (flowing water). LITTORAL = lakes, seas, oceans (standing water). PRIOR APPROPRIATION, used in many western states, allocates water by permit regardless of adjacency.');

  q('national', 'Property & Title', 'The three physical characteristics of land are immobility, indestructibility, and:',
    ['Scarcity', 'Uniqueness (nonhomogeneity)', 'Improvements', 'Permanence of investment'], 1,
    'PHYSICAL: immobility, indestructibility, uniqueness. ECONOMIC: scarcity, improvements, permanence of investment, area preference (situs).');

  q('national', 'Property & Title', 'A legal description using compass directions and distances from a point of beginning is:',
    ['Lot and block', 'Metes and bounds', 'Rectangular survey', 'Street address'], 1,
    'Metes and bounds must return to the point of beginning to enclose the parcel. A street address is never an adequate legal description.');

  q('national', 'Property & Title', 'In the rectangular (government) survey system, a township contains:',
    ['640 acres', '36 sections', '160 acres', '6 sections'], 1,
    'A township is 6 miles by 6 miles = 36 sections = 36 square miles = 23,040 acres.');

  q('national', 'Property & Title', 'The four characteristics that create value are remembered as DUST:',
    ['Demand, Utility, Scarcity, Transferability', 'Deed, Use, Survey, Title',
      'Depreciation, Upkeep, Style, Taxes', 'Demand, Uniqueness, Situs, Trend'], 0,
    'All four must be present. A useful, scarce, in-demand parcel with no transferable title has no market value.');

  q('national', 'Property & Title', 'Combining two adjacent parcels so the resulting value exceeds the sum of the parts is:',
    ['Assemblage, creating plottage value', 'Accretion', 'Severalty', 'Partition'], 0,
    'ASSEMBLAGE is the act of combining; PLOTTAGE is the resulting increment in value.');

  /* ======================================================================
     FINANCE — DEEPER  (national)
     ====================================================================== */

  q('national', 'Finance', 'In an adjustable-rate mortgage, the interest rate equals:',
    ['The index alone', 'The index plus the margin', 'The margin alone', 'The cap plus the index'], 1,
    'The INDEX moves with the market; the MARGIN is the lender\'s fixed markup. Caps limit how much the rate may change per period and over the life of the loan.');

  q('national', 'Finance', 'A loan whose payment is too small to cover the accruing interest, causing the balance to grow, has:',
    ['Positive amortization', 'Negative amortization', 'A prepayment penalty', 'A release clause'], 1,
    'Negative amortization increases what is owed over time — the reason many such products are now heavily restricted.');

  q('national', 'Finance', 'A loan covering more than one parcel, with a provision to free individual lots as they sell, is a:',
    ['Package loan', 'Blanket loan with a partial release clause', 'Bridge loan', 'Wraparound loan'], 1,
    'Blanket loans are common for developers. The PARTIAL RELEASE clause releases each lot from the lien as it is sold.');

  q('national', 'Finance', 'A loan that finances real estate together with personal property such as appliances or furniture is a:',
    ['Blanket loan', 'Package loan', 'Open-end loan', 'Ground lease'], 1,
    'Package loans are common in furnished condominium and resort sales.');

  q('national', 'Finance', 'A seller finances a buyer with a new loan that includes and is subordinate to the existing first mortgage. This is a:',
    ['Wraparound mortgage', 'Blanket mortgage', 'Package mortgage', 'Bridge loan'], 0,
    'The wraparound seller keeps paying the underlying loan and profits on the rate spread. A due-on-sale clause in the underlying loan can make this impossible.');

  q('national', 'Finance', 'The clause that cancels the mortgage lien once the debt is paid in full is the:',
    ['Acceleration clause', 'Defeasance clause', 'Alienation clause', 'Escalation clause'], 1,
    'The defeasance clause requires the lender to release the lien. The recorded evidence is a satisfaction of mortgage (or a deed of reconveyance where deeds of trust are used).');

  q('national', 'Finance', 'A deed of trust differs from a mortgage in that it involves:',
    ['Two parties', 'Three parties, including a trustee holding title as security',
      'No promissory note', 'No foreclosure'], 1,
    'Trustor (borrower), beneficiary (lender), trustee (neutral third party). The trustee\'s power of sale allows non-judicial foreclosure.');

  q('national', 'Finance', 'The instrument that is the borrower\'s actual PROMISE TO REPAY is the:',
    ['Mortgage', 'Promissory note', 'Deed', 'Title policy'], 1,
    'The NOTE is the debt; the MORTGAGE is the security instrument pledging the property as collateral. The note can exist without the mortgage, but not the reverse.');

  q('national', 'Finance', 'A borrower conveys the property to the lender to avoid foreclosure. This is a:',
    ['Short sale', 'Deed in lieu of foreclosure', 'Novation', 'Redemption'], 1,
    'A deed in lieu avoids the foreclosure process but does not erase junior liens — the lender takes the property subject to them, which is why lenders often refuse.');

  q('national', 'Finance', 'A sale in which the lender agrees to accept less than the loan balance is a:',
    ['Deed in lieu', 'Short sale', 'Foreclosure by advertisement', 'Redemption'], 1,
    'Short sales require lender approval and often take months, which the listing agent must set expectations about.');

  q('national', 'Finance', 'Under TRID, the buyer must receive the Closing Disclosure at least:',
    ['1 business day before closing', '3 business days before consummation',
      '7 days after closing', '10 business days before closing'], 1,
    'The Loan Estimate comes within 3 business days of application; the Closing Disclosure must be received 3 business days BEFORE consummation. Certain changes restart the 3-day clock.');

  q('national', 'Finance', 'The primary purpose of an escrow (impound) account is to:',
    ['Pay the broker\'s commission', 'Accumulate funds for taxes and insurance so they are paid when due',
      'Hold the earnest money', 'Reduce the interest rate'], 1,
    'It protects the lender\'s collateral by ensuring taxes and hazard insurance are never unpaid. RESPA limits the cushion a lender may require.');

  q('national', 'Finance', 'Which is TRUE of FHA loans?',
    ['They are made directly by the government', 'They are insured by FHA and made by approved lenders',
      'They require 20% down', 'They are only for veterans'], 1,
    'FHA INSURES; it does not lend. Borrowers pay an upfront and an annual mortgage insurance premium (MIP), which differs from conventional PMI in that it often lasts the life of the loan.');

  q('national', 'Finance', 'A buyer assumes a seller\'s loan and the lender releases the seller from liability. This is a:',
    ['Subject-to purchase', 'Novation', 'Subordination', 'Wraparound'], 1,
    'Only a NOVATION releases the original borrower. A bare assumption typically leaves the seller secondarily liable.');

  /* ======================================================================
     VALUATION — DEEPER  (national)
     ====================================================================== */

  q('national', 'Valuation', 'The first step in the appraisal process is to:',
    ['Inspect the property', 'Define the problem, including the purpose and the interest being appraised',
      'Gather comparable sales', 'Reconcile the value indicators'], 1,
    'Everything downstream depends on defining the assignment — the effective date, the interest appraised, and the type of value sought.');

  q('national', 'Valuation', 'Reconciliation in an appraisal means:',
    ['Averaging the three approaches', 'Weighing the approaches according to their reliability for this property',
      'Choosing the highest value', 'Adjusting the subject property'], 1,
    'Averaging is explicitly wrong. The appraiser weights each approach based on the quality of data and the property type.');

  q('national', 'Valuation', 'An appraiser is asked to "bring in the value at $450,000 or we cannot close." The appraiser must:',
    ['Comply, since the client is paying', 'Decline — value cannot be predetermined',
      'Split the difference', 'Use only the cost approach'], 1,
    'Accepting an assignment contingent on a predetermined value violates USPAP and federal appraiser independence rules.');

  q('national', 'Valuation', 'Situs refers to:',
    ['The soil composition', 'Area or location preference', 'The legal description', 'The zoning classification'], 1,
    'Situs is an ECONOMIC characteristic — people\'s preference for a location. It is the reason identical houses differ in value by neighborhood.');

  q('national', 'Valuation', 'A comparable sold for $340,000 and has a garage the subject lacks, worth $12,000. The adjusted value indicated is:',
    ['$352,000', '$340,000', '$328,000', '$316,000'], 2,
    'The COMP is superior, so SUBTRACT from the comp: $340,000 - $12,000 = $328,000. Remember "CBS" — Comp Better, Subtract. Never adjust the subject.');

  q('national', 'Valuation', 'Deferred maintenance such as a worn roof is an example of:',
    ['Functional obsolescence', 'Curable physical deterioration', 'External obsolescence', 'Incurable depreciation'], 1,
    'Curable means the cost to fix is recovered in added value. External obsolescence is always incurable because its cause is off-site.');

  q('national', 'Valuation', 'A broker price opinion (BPO) or CMA differs from an appraisal chiefly because it:',
    ['Is more accurate', 'Is not performed by a licensed appraiser under USPAP',
      'Uses no comparable sales', 'Is required by lenders'], 1,
    'Lenders generally require an independent licensed appraisal for financing decisions; BPOs are commonly used for REO pricing and pre-listing guidance.');

  q('national', 'Valuation', 'The principle of anticipation holds that value is based on:',
    ['Past sale prices', 'The expectation of future benefits', 'Replacement cost', 'The assessed value'], 1,
    'Anticipation underlies the income approach — an investor pays today for tomorrow\'s income stream.');

  q('national', 'Valuation', 'A property\'s value falls because a major employer closed. This is:',
    ['Functional obsolescence', 'Physical deterioration', 'External obsolescence', 'Curable depreciation'], 2,
    'The cause lies outside the property boundary and outside the owner\'s control, making it external and incurable.');

  /* ======================================================================
     PRACTICE OF REAL ESTATE & SETTLEMENT  (national)
     ====================================================================== */

  q('national', 'Practice & Settlement', 'Two competing brokerages agree to both charge a 6% commission. This is:',
    ['Good business practice', 'Illegal price fixing under antitrust law',
      'Permitted if disclosed', 'Required by the MLS'], 1,
    'Commission rates are ALWAYS negotiable between a broker and a client. Price fixing is a per se antitrust violation with criminal exposure.');

  q('national', 'Practice & Settlement', 'Brokers agree that one will handle the north side of town and the other the south. This is:',
    ['Efficient specialization', 'Illegal market allocation', 'A permitted referral arrangement', 'Designated agency'], 1,
    'Market allocation is an antitrust violation alongside price fixing, group boycotting, and tie-in arrangements.');

  q('national', 'Practice & Settlement', 'A broker tells a seller "I will list your property only if you also use my affiliated mortgage company." This is:',
    ['A tie-in arrangement, an antitrust violation', 'A legal package deal',
      'Required disclosure', 'Standard practice'], 0,
    'Conditioning one service on the purchase of another is an illegal tie-in. It may also violate RESPA if it steers settlement services.');

  q('national', 'Practice & Settlement', 'Several brokerages agree to stop cooperating with a discount brokerage. This is:',
    ['A group boycott, an antitrust violation', 'Legal competitive behavior',
      'Permitted by the MLS', 'A designated agency issue'], 0,
    'Group boycotting is a per se violation. Each firm must independently decide its own cooperation and compensation policies.');

  q('national', 'Practice & Settlement', 'The broker who is the "procuring cause" of a sale is the one who:',
    ['Listed the property', 'Started an uninterrupted chain of events leading to the sale',
      'Showed the property first', 'Wrote the offer'], 1,
    'Procuring cause disputes turn on an unbroken chain of events, not merely who opened the door first.');

  q('national', 'Practice & Settlement', 'A listing broker generally earns a commission when:',
    ['The deed is recorded', 'A ready, willing, and able buyer is produced on the seller\'s terms',
      'The buyer applies for a loan', 'The property is listed'], 1,
    'Legally the commission is earned at that point, though most listing agreements make payment contingent on closing. If the SELLER wrongfully refuses to close, the commission may still be owed.');

  q('national', 'Practice & Settlement', 'On a closing statement, the buyer\'s new loan amount is:',
    ['A debit to the buyer', 'A credit to the buyer', 'A credit to the seller', 'A debit to the seller'], 1,
    'The loan is money coming IN for the buyer, so it is a buyer credit. The purchase price is the buyer\'s debit and the seller\'s credit.');

  q('national', 'Practice & Settlement', 'Which item is normally a SELLER debit at closing?',
    ['The new loan amount', 'The existing mortgage payoff', 'The earnest money', 'The buyer\'s appraisal fee'], 1,
    'The payoff is subtracted from the seller\'s proceeds. Earnest money is a buyer credit; the appraisal fee is normally a buyer cost.');

  q('national', 'Practice & Settlement', 'A licensee receives an email from "the title company" changing the wire instructions the day before closing. The correct action is:',
    ['Forward it to the buyer immediately', 'Verify by calling a known, independently sourced phone number before anyone wires funds',
      'Wire the funds to test it', 'Ignore the closing'], 1,
    'Business email compromise targeting closings is one of the most costly frauds in real estate. Never trust contact details contained in the suspicious message itself.');

  q('national', 'Practice & Settlement', 'Errors and omissions (E&O) insurance protects a licensee against:',
    ['Intentional fraud', 'Claims of negligence or mistakes in professional services',
      'Property damage', 'Fair housing fines'], 1,
    'E&O covers unintentional errors. Deliberate misconduct and fraud are excluded — which is why disclosure discipline matters more than insurance.');

  q('national', 'Practice & Settlement', 'A licensee wants to call homeowners from a purchased list. Federal Do Not Call rules generally require:',
    ['No restrictions for real estate', 'Scrubbing numbers against the National Do Not Call Registry and honoring internal opt-outs',
      'Calling only after 9 p.m.', 'Written permission from the MLS'], 1,
    'There is an established business relationship exception, but cold-calling registered numbers exposes the licensee and brokerage to per-call penalties.');

  q('national', 'Practice & Settlement', 'Under ESIGN and UETA, an electronic signature on a purchase agreement is:',
    ['Never valid', 'Generally as enforceable as an ink signature if the parties consented',
      'Valid only for leases', 'Valid only if notarized'], 1,
    'Consent to conduct business electronically is the key requirement, which is why e-sign platforms capture it up front.');

  /* ======================================================================
     AGENCY & CONTRACTS — DEEPER  (national)
     ====================================================================== */

  q('national', 'Agency', 'A general agent differs from a special agent in that a general agent:',
    ['Handles one specific transaction', 'Has authority to act in a broad range of matters for the principal',
      'Represents both parties', 'Cannot be compensated'], 1,
    'A property manager is a GENERAL agent. A listing broker is typically a SPECIAL agent for one transaction. A UNIVERSAL agent, such as under a power of attorney, may act in all matters.');

  q('national', 'Agency', 'A broker is generally liable for the acts of affiliated licensees performed within the scope of their duties. This is:',
    ['Vicarious liability', 'Strict liability', 'Novation', 'Subrogation'], 0,
    'This is the legal basis for the broker\'s supervisory obligation and for brokerage policies and training requirements.');

  q('national', 'Agency', 'A buyer\'s agent learns the buyer intends to convert a single-family home into an illegal rooming house. The agent should:',
    ['Assist, because of the duty of obedience', 'Decline to participate in an unlawful use',
      'Notify the neighbors', 'Disclose it to the MLS'], 1,
    'Fiduciary duties never require participation in illegal activity. Obedience covers LAWFUL instructions only.');

  q('national', 'Contracts', 'The Statute of Frauds requires which to be in writing to be enforceable?',
    ['A one-year lease', 'A contract for the sale of real estate',
      'An oral agreement to paint a house', 'A verbal offer'], 1,
    'Real estate sale contracts, and typically leases longer than one year, must be written. An oral agreement to sell land is unenforceable, not void.');

  q('national', 'Contracts', 'A document that adds new terms to a contract BEFORE it is signed by all parties is an:',
    ['Amendment', 'Addendum', 'Assignment', 'Novation'], 1,
    'ADDENDUM = attached at formation. AMENDMENT = changes an already-executed contract. The exam tests the timing distinction.');

  q('national', 'Contracts', 'When a buyer and seller sign a purchase agreement, the buyer acquires:',
    ['Legal title', 'Equitable title', 'A leasehold', 'No interest until closing'], 1,
    'Equitable title arises at contract formation; legal title transfers at closing by deed. This is also why specific performance is available to the buyer.');

  q('national', 'Contracts', 'A contract in which all parties have fully performed is:',
    ['Executory', 'Executed', 'Void', 'Unilateral'], 1,
    'EXECUTED = fully performed. EXECUTORY = something remains to be done. A signed purchase agreement before closing is executory, despite people calling it "executed" casually.');

  q('national', 'Contracts', 'A buyer discovers the seller knowingly concealed a cracked foundation after closing. The buyer may seek:',
    ['Nothing, since closing occurred', 'Rescission and/or damages for fraudulent misrepresentation',
      'A new appraisal', 'A zoning variance'], 1,
    'Closing does not extinguish fraud claims. Deliberate concealment of a known material defect supports rescission or damages.');

  q('national', 'Contracts', 'A purchase agreement is signed but the home is destroyed by fire before closing. Who bears the loss depends primarily on:',
    ['The listing agreement', 'The contract terms and the state\'s risk-of-loss rule',
      'The appraiser', 'The lender'], 1,
    'Most modern purchase agreements assign risk of loss to the seller until closing or possession, and give the buyer a right to cancel. Always read the specific contract.');

  q('national', 'Contracts', 'An offer states it must be accepted by 5 p.m. Friday. The seller signs at 6 p.m. Friday and returns it. The result is:',
    ['A binding contract', 'No contract; the late signature is a counteroffer the buyer may accept or reject',
      'A voidable contract', 'An option'], 1,
    'The offer expired at its stated deadline. Signing afterward is a new offer, and the buyer is free to walk away.');

  /* ======================================================================
     MATH CONCEPTS — DEEPER  (national)
     ====================================================================== */

  q('national', 'Math Concepts', 'A township contains how many square miles?',
    ['1', '6', '36', '640'], 2,
    'A township is 6 miles on each side, so 36 square miles = 36 sections. Each section is 640 acres.');

  q('national', 'Math Concepts', 'To find the monthly interest on a loan balance, you:',
    ['Multiply the balance by the annual rate', 'Multiply the balance by the annual rate and divide by 12',
      'Divide the balance by the rate', 'Multiply the payment by the rate'], 1,
    'Interest always accrues on the CURRENT balance. Compute the annual interest first, then divide by 12.');

  q('national', 'Math Concepts', 'In a proration, "paid in arrears" means the expense:',
    ['Has already been paid for the period ahead', 'Covers a period that has already passed and is not yet paid',
      'Is never prorated', 'Is paid by the lender'], 1,
    'Arrears means you pay after the fact — so at closing the seller owes the buyer for the seller\'s period of ownership.');

  q('national', 'Math Concepts', 'If a buyer is qualified using a 28% front-end ratio, that percentage is applied to:',
    ['Net monthly income', 'Gross monthly income', 'Annual gross income', 'The loan amount'], 1,
    'Qualifying ratios always use GROSS income, before taxes and deductions.');

  q('national', 'Math Concepts', 'A property sold for 90% of its list price. To find the list price you:',
    ['Multiply the sale price by 1.10', 'Divide the sale price by 0.90',
      'Multiply the sale price by 0.90', 'Add 10% to the sale price'], 1,
    'The sale price IS 90% of the list, so divide by 0.90. Multiplying by 1.10 is the reliable wrong answer and is always offered.');

  q('national', 'Math Concepts', 'The capitalization rate and value have what relationship?',
    ['Direct — as the cap rate rises, value rises', 'Inverse — as the cap rate rises, value falls',
      'No relationship', 'They are always equal'], 1,
    'Value = NOI / cap rate. A higher cap rate (more perceived risk) divides the same income into a LOWER value.');

  /* ================================================================== API */

  var CATS = [];
  Q.forEach(function (x) { if (CATS.indexOf(x.cat) < 0) CATS.push(x.cat); });

  global.QBank = {
    all: Q,
    cats: CATS,
    byCat: function (c) {
      return c === 'All' ? Q.slice() : Q.filter(function (x) { return x.cat === c; });
    },
    /* filter by category and exam portion together */
    filter: function (cat, portion) {
      return Q.filter(function (x) {
        return (cat === 'All' || x.cat === cat) &&
          (portion === 'All' || x.portion === portion);
      });
    },
    /* categories that actually contain questions for a given portion, so the
       dropdown never offers a filter that yields nothing */
    catsFor: function (portion) {
      var seen = [];
      Q.forEach(function (x) {
        if (portion !== 'All' && x.portion !== portion) return;
        if (seen.indexOf(x.cat) < 0) seen.push(x.cat);
      });
      return seen;
    },
    byPortion: function (p) { return Q.filter(function (x) { return x.portion === p; }); },
    count: Q.length
  };
})(window);
