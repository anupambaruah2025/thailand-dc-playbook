/* ==========================================================================
   THAILAND DC MARKET 2026 — Source data
   Extracted from Thailand_DC_Market_2026_Complete_Playbook.docx (July 2026)
   ========================================================================== */

window.DC_DATA = {

  meta: {
    title: "Thailand Data Centre Market 2026",
    subtitle: "The Complete Investment & Delivery Playbook",
    compiled: "July 2026 · Compiled exclusively from public-domain sources",
    onePara: "Thailand is now Southeast Asia's second gravitational centre for data centre capital after Johor — cheaper to build than any regional peer, anchored by three live or committed US hyperscale cloud regions plus deep Chinese-linked demand, and backed by an unusually aggressive incentive stack. The market's constraint has flipped from demand to delivery: over 90% of new grid requests target the EEC, where 115 kV transmission and substation capacity — not generation — is the bottleneck. Since 30 March 2026 every new BOI data-centre application must attach an ERC letter confirming power availability, which makes the grid workstream legally prior to everything else."
  },

  heroStats: [
    { value: 770, suffix: " MW", label: "Operational" },
    { value: 2870, suffix: " MW", label: "Pipeline", prefix: ">" },
    { value: 458, suffix: "bn", unit: "THB", label: "BOI Approved 2025" },
    { value: 55, suffix: "", label: "Facilities" }
  ],

  kpis: [
    { label: "Operational facilities", value: "~55", unit: "facilities", detail: "~21 operators · Bangkok: 31 existing + 8 upcoming", source: "Data Center Map; Arizton (Sep 2025)", pct: 55, spark: [20,24,27,31,35,40,46,50,55] },
    { label: "Installed / operational base", value: "770", unit: "MW", detail: "Mordor market-MW basis; live colo load materially lower", source: "Mordor Intelligence", pct: 27, spark: [300,360,420,480,540,610,680,730,770] },
    { label: "Pipeline (U/C + announced + planned)", value: "2,870", unit: "MW", detail: "3.7× Indonesia — Thailand to overtake Indonesia 2026–31", source: "Arizton 2025", pct: 100, spark: [800,1100,1500,1850,2150,2400,2600,2760,2870] },
    { label: "BOI approvals 2025", value: "458", unit: "bn THB", detail: "≥38 projects · ~2,066 MW · ~USD 14.5 bn", source: "BOI releases (Fangda compilation)", pct: 63, spark: [40,90,150,210,270,330,390,430,458] },
    { label: "BOI approvals Jan 2026", value: "96", unit: "bn THB", detail: "+7 projects incl. True IDC 223 MW; GSA 120 MW", source: "BOI Jan 2026 batch", pct: 21, spark: [0,10,25,40,55,70,82,90,96] },
    { label: "BOI applications 2025 (intent)", value: "728", unit: "bn THB", detail: "36 applications — intent ≠ approved ≠ disbursed", source: "BOI releases", pct: 100, spark: [80,180,290,400,500,590,660,700,728] },
    { label: "Capex benchmark", value: "7–8", unit: "USD m/MW", detail: "Below Singapore, Malaysia, Indonesia", source: "Arizton 2025", pct: 40, spark: [9,8.6,8.3,8,7.8,7.6,7.4,7.2,7.5] },
    { label: "Revenue trajectory", value: "2 → 6.3", unit: "USD bn", detail: "2025/26 → 2030/31 · 17–28% CAGR range", source: "Arizton / Mordor / NextMSC", pct: 70, spark: [2,2.5,3.1,3.8,4.5,5.1,5.7,6.0,6.3] },
    { label: "Power demand", value: "6 → 10", unit: "TWh", detail: "2030 → 2037 · ~8% p.a.", source: "Utility / press projections", pct: 60, spark: [6,6.6,7.2,7.8,8.3,8.8,9.3,9.7,10] }
  ],

  marketGrowth: {
    years: [2025, 2026, 2027, 2028, 2029, 2030, 2031],
    revenue: {
      arizton: [1.45, 1.92, 2.55, 3.35, 4.35, 5.2, 6.29],
      mordor:  [1.45, 1.72, 2.04, 2.42, 2.86, 3.36, 3.95],
      nextmsc: [1.45, 1.77, 2.15, 2.61, 3.16, 3.82, 4.61]
    },
    capacityMW: { installed: 770, pipeline: 2870, approved2025: 2066, realistic2030Low: 1000, realistic2030High: 1435 },
    notes: "Arizton's 27.7% CAGR is an AI-maximalist case assuming near-full pipeline conversion. Mordor (17.2%) and NextMSC (18.4%) embed slower energisation. A defensible planning corridor is 17–20% revenue CAGR, with capacity (MW) growing faster than revenue."
  },

  demandEngine: [
    { title: "Hyperscale cloud regions", text: "AWS's USD 5bn three-AZ region has been live since Jan 2025 (up to ~THB 200bn signalled by 2037); a second US hyperscaler's Bangkok cloud region went live Jan 2026 under a ~USD 1bn Bangkok–Chonburi programme; Microsoft has designated Thailand its lead regional DC location, entering leased-first." },
    { title: "Chinese-linked demand", text: "ByteDance/TikTok (~USD 3.9bn committed, up to USD 8.8bn ASEAN-weighted intent), Haoyang's 300MW Rayong campus, Alibaba's second Thai DC, Huawei and Tencent cloud presence — the largest wholesale absorber and most exposed to US export-control risk." },
    { title: "Sovereign, regulated & AI workloads", text: "Cloud-first government policy and PDPA enforcement are onshoring regulated workloads; BFSI is fastest-growing. National AI-hub positioning (SIAM AI Cloud USD 101m) and the 6→10 TWh trajectory proxy the compute build-out." },
    { title: "Regional diversion", text: "Ex-Singapore and ex-Tokyo deployments flow outward. Thailand's edge over Johor is a large domestic economy underneath the diverted demand; Johor's oversupply anxiety is the cautionary benchmark for 2028–29." }
  ],

  mapHotspots: [
    { id: "bangkok", name: "Bangkok Metro", x: 47, y: 30, strategy: "Retail / interconnection hub", share: "~70% of installed load",
      projects: [
        { name: "Equinix — retail interconnection", capacity: "n/a", investment: "USD 0.5bn (10-yr)", hyperscalers: "CLMVT hub", status: "Operational" },
        { name: "NEXTDC BK1", capacity: "n/a", investment: "THB 13.7bn", hyperscalers: "First expansion outside ANZ", status: "Operational" },
        { name: "Telehouse — Huai Khwang", capacity: "12 MW", investment: "THB 7.55bn", hyperscalers: "—", status: "BOI approved Nov 2025" }
      ] },
    { id: "eec", name: "EEC Corridor (Amata Chonburi)", x: 62, y: 52, strategy: "Hyperscale mega-campus corridor", share: ">90% of new grid requests",
      projects: [
        { name: "GDS / DigitalLand", capacity: "~120 MW", investment: "THB 28bn (~USD 0.87bn)", hyperscalers: "Floating-solar access", status: "Phase 1 targeted 2026" },
        { name: "Vistas Amata Chonburi", capacity: "80 MW", investment: "THB 9.9bn", hyperscalers: "—", status: "BOI approved (2nd)" },
        { name: "US hyperscaler self-built campus", capacity: "n/a", investment: "~USD 1bn (2025–29)", hyperscalers: "Bangkok–Chonburi region", status: "Targeted ~2027" },
        { name: "True IDC — Chonburi", capacity: "part of 223 MW", investment: "In THB 96bn Jan-26 batch", hyperscalers: "Hosts part of Microsoft region", status: "Approved" }
      ] },
    { id: "rayong", name: "Rayong / Map Ta Phut", x: 68, y: 58, strategy: "Hyperscale + Chinese-linked mega-campus", share: "Largest single-site approval",
      projects: [
        { name: "Beijing Haoyang", capacity: "300 MW", investment: "USD 2.16bn", hyperscalers: "Largest approved single site (Mar 2025)", status: "BOI approved" },
        { name: "GSA (Gulf–Singtel–AIS JV)", capacity: "part of 120 MW combined", investment: "Jan-2026 batch", hyperscalers: "Energy-major sponsorship", status: "Approved" }
      ] },
    { id: "samutprakan", name: "Samut Prakan", x: 50, y: 36, strategy: "Second-ring — grid headroom exists", share: "Jan-2026 BOI steering target",
      projects: [
        { name: "True IDC — Samut Prakan", capacity: "part of 223 MW", investment: "In THB 96bn batch", hyperscalers: "GIP investment May 2025", status: "Approved" },
        { name: "GSA — Samut Prakan", capacity: "part of 120 MW", investment: "Jan-2026 batch", hyperscalers: "—", status: "Approved" }
      ] },
    { id: "ayutthaya", name: "Ayutthaya", x: 44, y: 22, strategy: "Second-ring diversification", share: "Substation headroom",
      projects: [
        { name: "Also active — second ring", capacity: "—", investment: "—", hyperscalers: "DayOne, CtrlS, Empyrion, Digital Edge", status: "Various stages" }
      ] }
  ],

  hyperscalers: [
    { id: "aws", name: "AWS", country: "USA", tier: "hyperscaler", commitment: "USD 5bn region live; up to ~THB 200bn by 2037", location: "Bangkok metro + eastern seaboard (3 AZs)", status: "Operational since Jan 2025", note: "~THB 25bn already deployed by end-2024", links: ["msft","trueidc"] },
    { id: "msft", name: "Microsoft", country: "USA", tier: "hyperscaler", commitment: "Undisclosed — 'lead regional data centre' designation", location: "Bangkok metro (region partly hosted in True IDC)", status: "First Thailand cloud region launched", note: "Leased-first entry; own campus scale TBD", links: ["trueidc"] },
    { id: "google", name: "Google Cloud", country: "USA", tier: "hyperscaler", commitment: "~USD 1bn (2025–29); BOI THB 32.76bn", location: "Bangkok cloud region + Chonburi self-built campus", status: "Region live Jan 2026; campus ~2027", note: "5th DC location in Asia", links: [] },
    { id: "bytedance", name: "ByteDance / TikTok", country: "China", tier: "chinese", commitment: "~USD 3.9bn committed (USD 8.8bn ASEAN-weighted intent)", location: "Three provinces, EEC-centred", status: "Multi-campus, phased", note: "Most exposed to US chip-control risk", links: [] },
    { id: "haoyang", name: "Beijing Haoyang", country: "China", tier: "chinese", commitment: "~USD 2.16bn", location: "Rayong (EEC)", status: "300MW — largest approved single site", note: "Would nearly double Haoyang's global footprint", links: [] },
    { id: "alibaba", name: "Alibaba Cloud", country: "China", tier: "chinese", commitment: "Second Thai DC", location: "Undisclosed", status: "Active", note: "Cloud presence expansion", links: [] },
    { id: "huawei", name: "Huawei", country: "China", tier: "chinese", commitment: "Cloud presence", location: "Undisclosed", status: "Active", note: "Cloud region presence", links: [] },
    { id: "tencent", name: "Tencent", country: "China", tier: "chinese", commitment: "Cloud presence", location: "Undisclosed", status: "Active", note: "Cloud region presence", links: [] },
    { id: "gds", name: "GDS / DigitalLand", country: "China/SG", tier: "colo", commitment: "THB 28bn (~USD 0.87bn)", location: "Amata City Chonburi", status: "~120MW; phase 1 targeted 2026", note: "Floating-solar access at estate", links: [] },
    { id: "nextdc", name: "NEXTDC", country: "Australia", tier: "colo", commitment: "THB 13.7bn (~USD 0.42bn)", location: "Bangkok (BK1)", status: "First expansion outside ANZ", note: "Premium retail", links: [] },
    { id: "equinix", name: "Equinix", country: "USA", tier: "colo", commitment: "THB 16.5bn (~USD 0.5bn, 10-yr)", location: "Bangkok metro", status: "Retail / interconnection", note: "CLMVT hub positioning", links: [] },
    { id: "trueidc", name: "True IDC", country: "Thailand (CP Group)", tier: "local", commitment: "In Jan-2026 THB 96bn batch", location: "Chonburi + Samut Prakan (new); 4 existing BKK sites", status: "223MW approved across 2 sites", note: "GIP investment May 2025; hosts part of Microsoft region", links: ["msft","aws"] },
    { id: "sttgdc", name: "STT GDC", country: "Singapore", tier: "colo", commitment: "USD 200m (STT BKK2) + THB 4.5bn earlier", location: "Bangkok / Bangna corridor", status: "STT BKK2 live end-2026; 3rd Thai DC", note: "Direct-to-chip liquid cooling; BFSI/SaaS anchors", links: [] },
    { id: "gsa", name: "GSA (Gulf–Singtel–AIS JV)", country: "Thailand/SG", tier: "local", commitment: "In Jan-2026 batch", location: "Rayong + Samut Prakan", status: "120MW combined", note: "Energy-major sponsorship = credible power story", links: [] }
  ],

  timeline: [
    { year: "2024", items: [
      "AWS: ~THB 25bn already deployed by end-2024",
      "US hyperscaler #2 BOI approval via Thai vehicle — THB 32.76bn"
    ]},
    { year: "2025", items: [
      "AWS AP-Thailand region operational since January",
      "BOI approvals: ≥38 projects · ~THB 458bn (~USD 14.5bn) · ~2,066 MW",
      "Beijing Haoyang 300MW Rayong — largest single-site approval (Mar)",
      "STT GDC BKK2 — USD 200m, direct-to-chip liquid cooling",
      "Nov-2025 BOI batch: Zenith 200MW, DAMAC 84MW, Vistas 80MW, Telehouse 12MW",
      "True IDC — GIP investment (May)"
    ]},
    { year: "2026", items: [
      "US hyperscaler #2 Bangkok cloud region live (January)",
      "Jan-2026 BOI batch: +7 projects · ~THB 96bn (~USD 3.1bn) incl. True IDC 223MW, GSA 120MW",
      "30 March — ERC power-availability letter becomes mandatory BOI attachment",
      "UGT2 green tariff effective 1 Jan, live March — ~THB 4.56/kWh",
      "~Q3 2026 — PDP 2026 finalised incl. Type 9 tariff decision",
      "H2 2026 — first executed Direct PPA contracts expected",
      "End-2026 — target date for proposed NBTC licence reclassification"
    ]},
    { year: "2027", items: [
      "US hyperscaler #2 Chonburi self-built campus targeted",
      "GDS phase 1 targeted completion",
      "At least one top-three contractor's signed hyperscale contracts run into 2027"
    ]},
    { year: "2030", items: [
      "Realistic energised capacity: 1,000–1,435 MW (35–50% pipeline conversion)",
      "Power demand ~6 TWh reached",
      "Revenue trajectory reaching USD 4.3–6.3bn range"
    ]}
  ],

  powerFacts: {
    bottleneck: "Over 90% of DC grid requests target the EEC, where 115/230kV lines and substation bays are exhausted. EGAT has committed ~THB 3bn of immediate works and ~THB 30–31bn programmed against ~3,800MW of new demand. Utility substations take 24–36 months; dedicated 115kV customer substations 18–30 months including transformer lead times.",
    ercRule: "From 30 March 2026, new data-centre BOI applications must include written ERC confirmation that sufficient electricity is available — submitted with the application itself. Speculative land-first entries are finished; the ERC letter functions as de facto capacity allocation.",
    mechanisms: [
      { name: "Direct PPA pilot (2,000 MW)", status: "Draft ERC regulation Oct 2025; consultation ongoing; no executed post-commissioning contracts as of Mar 2026", statusTag: "draft", terms: "BOI-promoted DCs only; ≥50MW IT baseload; 100% RE mandate; new-build RE plants only (≥1,000kVA); 10-yr electricity plan; utility backup contract; wheeling via TPA Code", read: "A quota game — secure MOU/LOI with RE developers now, before absorption" },
      { name: "UGT2 green tariff", status: "Effective 1 Jan 2026; live Mar 2026", statusTag: "live", terms: "~THB 4.56/kWh; backed by ~5.2 GW of new solar/wind/biogas", read: "Bankable interim RE100 path while Direct PPA matures" },
      { name: "I-RECs", status: "Operational; EGAT sole issuer", statusTag: "live", terms: "~USD 0.50–0.80/MWh (early 2026)", read: "Cheap attribute cover; weak additionality; insufficient alone for strict mandates" },
      { name: "PDP 2026 (drafting)", status: "Draft to Minister ~Jul 2026; finalisation ~Aug–Sep 2026", statusTag: "new", terms: "≥60% clean generation by 2050; SMRs 2–4GW within ~a decade; tariff ceiling ~THB 4/unit; proposed 'Type 9' DC tariff priced above household rates", read: "Type 9 is the single most negotiated variable of 2026 — it hits every opex model" }
    ]
  },

  permits: [
    { stage: 0, title: "Site & land control", instruments: "IEAT estate land (foreign freehold inside estates) or BOI land-ownership right (purchase only AFTER promotion); zoning/town-plan conformity; land option/LOI", duration: "1–4 months", authority: "IEAT / Land Dept / local planning" },
    { stage: 1, title: "Grid pre-feasibility → ERC letter", instruments: "PEA/MEA load enquiry; EGAT system-impact screening; ERC written availability confirmation (mandatory BOI attachment from 30 Mar 2026)", duration: "3–9 months (ERC gate: TBD)", authority: "PEA / MEA / EGAT / ERC" },
    { stage: 2, title: "BOI promotion", instruments: "Data-centre category → CIT holiday 8 yrs + 50% for 5 (to 13 yrs; EEC packages to 15), duty exemption, land right, Foreign Business Certificate, expat quota/Smart Visa", duration: "2–4 months + certificate", authority: "BOI" },
    { stage: 3, title: "Corporate & FDI structuring", instruments: "Thai co. incorporation; FBC via BOI (bypasses FBL); structure convertibility against NBTC Type-3 scenario", duration: "1–2 months (parallel)", authority: "DBD / MOC / BOI" },
    { stage: 4, title: "Environmental & estate consents", instruments: "DCs are NOT factories — no Ror.Ngor.4 required. IEE/EIA only if triggered by on-site generation/fuel-storage or sensitive-zone siting; IEAT estate environmental + utility-allocation consents", duration: "2–6 months (12+ if EIA)", authority: "ONEP / IEAT / DIW" },
    { stage: 5, title: "Construction permitting", instruments: "Building permit (Or.1, Building Control Act) via local authority or IEAT permission in-estate; EEC one-stop / FastPass fast-track; fire-safety code; EIT electrical standards", duration: "2–4 months", authority: "Local authority / IEAT / EEC Office" },
    { stage: 6, title: "Power delivery & backup", instruments: "Connection agreement; wheeling/TPA (if Direct PPA); 115kV customer substation approvals; ERC energy licence/exemption for standby gensets; diesel storage licence; Direct PPA quota or UGT2 subscription", duration: "18–36 months — CRITICAL PATH", authority: "EGAT / PEA / MEA / ERC / DOEB" },
    { stage: 7, title: "Construction & commissioning", instruments: "12–24 months per 20–60MW phase (tilt-up + prefab at the fast end — a THB 455m Bangkok facility delivered in 10 months); L1–L5 Cx; utility witness tests; building-use certificate", duration: "12–24 months", authority: "Contractor / utility / local authority" },
    { stage: 8, title: "Operating licences & go-live", instruments: "NBTC Type 1 telecom licence (~1–2 weeks today — monitor proposed Type 3 reclassification with Thai-majority requirement, targeted end-2026); PDPA programme; Uptime/ISO; customer SLAs", duration: "2–8 weeks", authority: "NBTC / PDPC" }
  ],

  contractorEcosystem: [
    { layer: "DC-specialised main contractors / D&B", firms: ["Thai Kajima", "Thai Obayashi", "Syntec", "PPS Group", "QTCG", "Chaan"], comment: "Japanese-affiliated builders + listed Thai mid-caps pivoting from commercial RE — fastest-growing tier and hyperscalers' preferred quality systems." },
    { layer: "Large national contractors", firms: ["Italian-Thai Development (ITD)", "CH. Karnchang", "Unique E&C", "TTCL"], comment: "Deep civil/HV capability but loaded with rail/expressway megaprojects; ITD under financial and safety-related stress (contracts stripped Jan 2026)." },
    { layer: "Design / engineering", firms: ["Arup", "Meinhardt", "Architects 49", "Plan Architect", "Finishing Touch Design Studio"], comment: "International lead designer + local architect-of-record is the standard hyperscale pairing." },
    { layer: "MEP / electrical OEM & prefab", firms: ["Schneider Electric", "Delta Electronics", "ABB", "Siemens", "Eaton", "Mitsubishi Electric", "Legrand", "Vertiv", "Stulz", "Rittal", "Piller", "HITEC", "Cummins", "Caterpillar", "Rehlko (Kohler)", "Fuji Electric", "Airedale", "CyberPower"], comment: "OEM-led prefabrication is displacing stick-built MEP; genset and transformer slots are the procurement chokepoints." },
    { layer: "PM / owner's rep / Cx", firms: ["Regional global CM arms", "Specialist DC PM boutiques (Bangkok)"], comment: "QCx/Cx talent predominantly imported — book 12+ months ahead of L4/L5." }
  ],

  risks: [
    { name: "EEC transmission delay stalls energisation", likelihood: 5, severity: 5, category: "Power", mitigation: "Site in second-ring provinces; contract energisation milestones; phase IT load to grid delivery", monitor: "EGAT THB 30–31bn programme milestones" },
    { name: "NBTC Type-3 reclassification — Thai majority", likelihood: 3, severity: 5, category: "Regulatory", mitigation: "Convertible shareholding structures; Thai strategic-partner optionality; consultation engagement", monitor: "NBTC board submission; public consultation (target end-2026)" },
    { name: "Type 9 tariff / power opex", likelihood: 4, severity: 3, category: "Financial", mitigation: "Sensitivity-test at +15–25% power cost; Direct PPA/UGT2 hedges; pass-through clauses", monitor: "PDP 2026 finalisation ~Q3-2026" },
    { name: "US chip controls delay GPU halls", likelihood: 3, severity: 4, category: "Political", mitigation: "Diversified accelerator sourcing; compliance-grade end-use documentation; phase AI halls after general capacity", monitor: "US Commerce enforcement; any Thai permit regime" },
    { name: "Contractor capacity crunch", likelihood: 4, severity: 3, category: "Construction", mitigation: "ECI procurement; early slot reservation; owner-supplied long-leads; counterparty diligence", monitor: "Concurrent EEC construction peaks 2026–28" },
    { name: "Wholesale oversupply 2028–29", likelihood: 3, severity: 3, category: "Financial", mitigation: "Pre-lease ≥60% before FID; underwrite to local + regulated demand, not diverted demand alone", monitor: "Johor absorption rates; Thai pre-lease ratios" },
    { name: "Direct PPA slippage / quota exhaustion", likelihood: 3, severity: 3, category: "Power", mitigation: "UGT2 fallback; early MOU/LOI positioning; I-RECs as bridge", monitor: "First executed Direct PPA contracts" },
    { name: "Water stress in EEC", likelihood: 3, severity: 3, category: "Construction", mitigation: "Closed-loop/air-cooled designs; estate raw-water diligence; reclamation options", monitor: "Estate allocation terms; any Thai DC water tariff" },
    { name: "THB / rates on USD capex", likelihood: 3, severity: 3, category: "Financial", mitigation: "USD-denominated hyperscale leases as natural hedge; hedge equipment windows", monitor: "—" },
    { name: "Policy discontinuity", likelihood: 2, severity: 3, category: "Regulatory", mitigation: "BOI certificates give contractual-grade protection; provincial diversification", monitor: "—" }
  ],

  strategies: [
    { id: "developer", label: "New-Entrant Developer", ic: "🏗️", play: "Grid-confirmed 60–200MW campus, second-ring or uncongested EEC node, pre-leased to a hyperscaler; exit to infra capital at stabilisation.", csf: ["ERC letter + connection agreement before FID", "≥60% pre-lease", "NBTC-robust structure", "Direct PPA quota"] },
    { id: "operator", label: "Existing Thai Operator", ic: "🏢", play: "Defend Bangkok retail with AI-ready density upgrades (liquid cooling); convert hyperscaler leased-first entries (Microsoft→True IDC pattern) into long-tenor anchors; monetise land bank via BTS deals.", csf: ["Speed of retrofit", "Hyperscaler vendor qualification", "Energy hedging via UGT2/Direct PPA"] },
    { id: "investor", label: "Financial Investor", ic: "💰", play: "Platform stakes and stabilised-asset acquisitions as the 2024–26 vintage recycles (the GIP→True IDC pattern); price the NBTC and Type-9 scenarios into entry.", csf: ["Grid-reality diligence over BOI paper", "Counterparty quality", "Tariff and FX sensitivities in the model"] },
    { id: "supplychain", label: "Supply Chain (E&M/Power)", ic: "⚙️", play: "Local assembly + service footprint for BOI-content advantage; prefab and liquid-cooling reference projects; lock transformer/genset slots and resell programme certainty.", csf: ["Hyperscaler AVL qualification", "Service depth in-country", "24-month first-rack narratives"] },
    { id: "renewable", label: "Renewable Developer", ic: "🌱", play: "The Direct PPA pilot creates a new private offtake class — creditworthy, RE100-mandated, long-tenor, new-build-only. Pair early with qualifying DC buyers; design hybrid RE+BESS to firm supply.", csf: ["LOI/MOU pre-quota", "TPA/Grid Code engineering from day one", "Bankable wheeling economics"] },
    { id: "enterprise", label: "Enterprise / Edge Operator", ic: "📡", play: "Provincial 6–12MW modular builds aligned to 5G and manufacturing clusters — a lower-competition niche vs crowded wholesale.", csf: ["Replicable standard design", "Provincial utility relationships", "Avoid hyperscale price competition"] }
  ],

  calendar: [
    { when: "~Q3 2026", what: "PDP 2026 finalised, including the Type 9 tariff decision and reservation-deposit mechanism." },
    { when: "H2 2026", what: "First executed Direct PPA contracts expected; quota absorption becomes visible." },
    { when: "End-2026", what: "Target date for the proposed NBTC licence reclassification (subject to consultation)." },
    { when: "Rolling", what: "ERC availability-letter procedures published; EGAT EEC transmission milestones; BOI approval cadence (slower, more selective post-March rule)." }
  ]
};
