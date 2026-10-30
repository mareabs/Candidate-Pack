/*
 * Candidate pack content.
 *
 * Every page is a fixed book page (like a phone screen), so text has a length
 * budget. The comments show the rough limit for each field. If a line is too
 * long it gets cut off at the bottom of the page, so check the page after editing.
 *
 * "shared" pages appear in every company's book.
 * "entities" hold what changes per company.
 *
 * Everything here is public once the site is live. Never put internal notes in it.
 */
window.PACK = {
  shared: {
    group: {
      eyebrow: "Who we are · HomeToGo Group",
      title: "Three businesses, one group",
      stats: [
        { value: "15M+", label: "travelers a year" },
        { value: "30+", label: "countries with local apps and sites" },
        { value: "1,500+", label: "colleagues across Europe" },
        { value: "2021", label: "listed on the Frankfurt Stock Exchange" }
      ],
      businesses: [ // text: max ~90 characters
        { icon: "suitcase", label: "Marketplace", name: "HomeToGo", text: "Apps and websites in 30+ countries where travelers search and book their stay." },
        { icon: "blocks", label: "Software", name: "Smoobu and SECRA", text: "Tools that help hosts, agencies and tourism regions run their rentals." },
        { icon: "house", label: "Services", name: "Interhome and more", text: "Property management and on-site services. Interhome looks after 70,000+ homes." }
      ],
      timeline: [ // text: max ~20 characters
        { year: "2014", text: "Founded in Berlin" },
        { year: "2021", text: "Listed in Frankfurt" },
        { year: "2021–22", text: "Smoobu and SECRA join" },
        { year: "2025", text: "Interhome joins" },
        { year: "2026", text: "HomeToGo Originals" }
      ]
    },

    brands: {
      eyebrow: "Who we are · Our brands",
      title: "How the Group fits together",
      travelers: {
        icon: "suitcase",
        label: "For travelers",
        name: "Marketplace",
        chips: ["HomeToGo", "GetAway Group"],
        text: "Search and book stays in 30+ countries, plus short breaks through Kurz Mal Weg and Kurzurlaub."
      },
      hosts: {
        icon: "house",
        label: "For hosts and partners",
        name: "HomeToGo_PRO",
        groups: [ // text: max ~70 characters
          { name: "Software", chips: ["Smoobu", "SECRA", "Doppelgänger"], text: "Tools for independent hosts, agencies, regions and travel agencies" },
          { name: "Host services", chips: ["my.HomeToGo", "CaseVacanza.it", "Agriturismo.it", "EscapadaRural", "amivac"], text: "Listing plans on HomeToGo, plus listing sites in Italy, Spain and France" },
        ],
        more: "HomeToGo Originals and HomeToGo Works are on the next page."
      }
    },

    originals: {
      eyebrow: "Who we are · HomeToGo Originals",
      title: "Homes we look after",
      intro: "Our property management companies care for holiday homes on behalf of their owners, from the first booking to the last clean.", // max ~130
      companies: [
        { logo: "assets/img/brand/logo-interhome.png", name: "Interhome", since: "Since 1965 · Zurich", facts: ["70,000+ homes", "20+ countries", "120+ local offices"] },
        { logo: "assets/img/brand/logo-kraushaar.png", name: "Kraushaar", since: "Since 1974 · Baltic coast", facts: ["About 1,700 homes", "9 locations", "Germany"] }
      ],
      works: { label: "HomeToGo Works", name: "timwork", text: "Cleaning, laundry and upkeep for holiday homes on the Baltic coast." }
    },

    principles: {
      eyebrow: "How we work · Every Group company",
      title: "Our eight leadership principles",
      items: [ // text: max ~48 characters (one line)
        { icon: "flag", name: "Make Customers Successful", text: "Start with what travelers and hosts need." },
        { icon: "donut", name: "Bias for Results", text: "Focus on outcomes and measure what changed." },
        { icon: "badge", name: "Always be Responsible", text: "Own your work, decisions and their impact." },
        { icon: "rocket", name: "Act Entrepreneurial", text: "Spot opportunities and act like an owner." },
        { icon: "blocks", name: "Embrace Change, Reduce Complexity", text: "Adapt quickly and keep things simple." },
        { icon: "plant", name: "Hire and Develop the Best", text: "Raise the bar and help people grow." },
        { icon: "hearts", name: "Enable Each Other to Succeed", text: "Share what you know and help others win." },
        { icon: "robot", name: "Lead with AI", text: "Use AI every day and stay curious about it." }
      ],
      note: "We ask about real situations that show some of these. No need to memorize them: think of examples."
    },

    process: {
      eyebrow: "What happens next",
      title: "Your interview journey",
      steps: [ // text: max ~50 characters (one line)
        { name: "Recruiter conversation", text: "Done. Thanks for your time.", state: "done" },
        { name: "Hiring manager interview", text: "You are here.", state: "now" },
        { name: "Skills round", text: "A case study or task, briefed in advance." },
        { name: "Team conversations", text: "Meet future peers and close partners." },
        { name: "Bar Raiser (senior roles)", text: "A values conversation outside the team." },
        { name: "Decision", text: null } // filled from the ?reply= parameter
      ],
      adjustments: "Need extra time, a different format or other support? Tell your recruiter. It won’t count against you."
    },

    prepare: {
      eyebrow: "How to prepare",
      title: "Four things that help",
      items: [ // text: max ~100 characters
        { name: "Revisit the role", text: "Re-read the job ad. Pick the two or three outcomes that matter most and how you’d tackle them." },
        { name: "Bring real examples", text: "A few stories from your work: the situation, what you did, what changed. Specific beats polished." },
        { name: "TRY", text: "TRY" }, // replaced by each company's own tip
        { name: "Bring your questions", text: "The interview runs both ways. Ask about the team, the work and how success is measured." }
      ],
      dontExpect: "Memorized figures, insider jargon or perfect answers. If you need a moment to think, take it."
    }
  },

  entities: {
    hometogo: {
      name: "HomeToGo",
      status: "ready",
      logo: null, // the HomeToGo logo is already on the cover
      photos: {
        cover: "assets/img/cabin-dunes.jpg",
        welcome: "assets/img/reading-room.jpg",
        close: "assets/img/villa-sea.jpg"
      },
      company: {
        title: "HomeToGo, Berlin",
        text: "Home to the Group’s marketplace and many central teams, from Product and Engineering to Finance and People.", // max ~120
        office: "Berlin",
        language: "English"
      },
      tryTip: { name: "Try what we build", text: "Plan a trip on HomeToGo or browse the app. Note one thing you liked and one you’d change." },
      offer: {
        title: "Life at HomeToGo",
        items: [ // text: max ~70 characters
          { icon: "globe", name: "Flexible hybrid", text: "Up to 50% remote, with up to 63 days abroad in the EU and UK." },
          { icon: "clock", name: "Time off", text: "27 vacation days to start, rising with tenure to 32." },
          { icon: "chart", name: "Pay and equity", text: "Market-aligned salary, plus stock options for eligible roles." },
          { icon: "bolt", name: "AI tools", text: "Google Workspace, Slack AI, Claude, Copilot and our own agents." },
          { icon: "cap", name: "Learning", text: "German classes, masterclasses and cross-team mentoring." },
          { icon: "pulse", name: "Wellbeing", text: "Mental health support and subsidized sports memberships." },
          { icon: "plane", name: "Getting around", text: "Deutschland-Ticket subsidy and bike leasing." },
          { icon: "home", name: "Moving to Berlin", text: "Visa sponsorship and relocation support for international hires." }
        ],
        footnote: "Plus dog-friendly offices and travel discounts. Some benefits depend on role and contract."
      },
      links: { careers: "", linkedin: "" }
    },

    smoobu: {
      name: "Smoobu",
      status: "ready",
      logo: "assets/img/brand/logo-smoobu.png",
      photos: {
        cover: "assets/img/modern-living.jpg",
        welcome: "assets/img/reading-room.jpg",
        close: "assets/img/pool-deck.jpg"
      },
      company: {
        title: "Smoobu, Berlin",
        text: "All-in-one software for vacation rental hosts: bookings, channel sync, guest messages and websites. Part of the Group since 2021.",
        office: "Berlin",
        language: "English"
      },
      tryTip: { name: "Try what we build", text: "Start a free Smoobu trial and set up a test listing. Note one thing you liked and one you’d change." },
      offer: {
        title: "Life at Smoobu",
        items: [
          { icon: "globe", name: "Flexible hybrid", text: "Up to 50% remote, including up to 63 working days abroad." },
          { icon: "clock", name: "Time off", text: "27 vacation days, plus one per year of tenure, up to 32." },
          { icon: "star", name: "Five-year thank you", text: "Five extra days off and a €500 HomeToGo booking credit." },
          { icon: "cap", name: "Learning", text: "Mentoring, German classes, training and clear growth paths." },
          { icon: "pulse", name: "Wellbeing", text: "Mental health support and a Wellhub contribution." },
          { icon: "users", name: "Team life", text: "Team events, social clubs and buddy lunches for new joiners." },
          { icon: "thumb", name: "Perks", text: "Discounts through FutureBens and Corporate Benefits." },
          { icon: "chat", name: "International team", text: "English as our company language and 28+ nationalities." }
        ],
        footnote: "Plus a dog-friendly office. Some benefits depend on role and contract."
      },
      links: { careers: "https://www.smoobu.com/en/careers/", linkedin: "" }
    },

    interhome: {
      name: "Interhome",
      status: "ready",
      logo: "assets/img/brand/logo-interhome.png",
      photos: {
        cover: "assets/img/alpine-chalets.jpg",
        welcome: "assets/img/reading-room.jpg",
        close: "assets/img/villa-sunset.jpg"
      },
      company: {
        title: "Interhome, Zurich",
        text: "Founded in Switzerland in 1965. We look after holiday homes for owners in 20+ European countries. Part of HomeToGo since 2025.",
        office: "Zurich area or a local office",
        language: "Depends on the role"
      },
      tryTip: { name: "Try what we offer", text: "Browse interhome.com and pick a home you’d book. Note one thing you liked and one you’d change." },
      offer: {
        title: "Life at Interhome",
        items: [
          { icon: "chart", name: "Pay and relocation", text: "Competitive salary, plus visa and relocation support from abroad." },
          { icon: "clock", name: "Time off", text: "Five weeks of vacation." },
          { icon: "plane", name: "Workation", text: "Flexibility on where you work, including time abroad." },
          { icon: "home", name: "Travel discounts", text: "Stays through Interhome and HomeToGo_Friends, for you and family." },
          { icon: "users", name: "Informal culture", text: "First names from day one, at every level." },
          { icon: "bulb", name: "Autonomy", text: "Room to own your work and try new ideas." },
          { icon: "pin", name: "Getting to work", text: "Workplaces with good public transport links." },
          { icon: "globe", name: "Across Europe", text: "Colleagues in 20+ countries and 120+ local offices." }
        ],
        footnote: "Some benefits depend on role, country and contract."
      },
      links: { careers: "", linkedin: "" }
    },

    secra: {
      name: "SECRA",
      // "draft" shows a yellow banner. Switch to "ready" once People Ops has
      // confirmed the benefits below.
      status: "draft",
      logo: "assets/img/brand/logo-secra.png",
      photos: {
        cover: "assets/img/thatched-house.jpg",
        welcome: "assets/img/reading-room.jpg",
        close: "assets/img/cabin-dunes.jpg"
      },
      company: {
        title: "SECRA, Sierksdorf",
        text: "Founded in 1999. Booking and marketing software that connects hosts, agencies and tourism regions with guests. In the Group since 2022.",
        office: "Sierksdorf · hybrid",
        language: "German and English"
      },
      tryTip: { name: "Try what we build", text: "Visit secra.de and a holiday region’s booking site. Note one thing you liked and one you’d change." },
      offer: {
        title: "Life at SECRA",
        items: [
          { icon: "home", name: "Hybrid work", text: "Office in Sierksdorf plus remote days. [Confirm rule]" },
          { icon: "clock", name: "Time off", text: "[__] vacation days." },
          { icon: "chart", name: "Pay", text: "[Confirm salary and extras]" },
          { icon: "cap", name: "Learning", text: "[Confirm training and growth paths]" },
          { icon: "pulse", name: "Wellbeing", text: "[Confirm sports and health benefits]" },
          { icon: "plane", name: "Getting to work", text: "[Confirm parking or Deutschland-Ticket]" },
          { icon: "users", name: "Team", text: "A team of 60+ on the Baltic coast." },
          { icon: "globe", name: "Part of a group", text: "1,500+ colleagues across Europe." }
        ],
        footnote: "Some benefits depend on role and contract."
      },
      links: { careers: "https://www.secra.de", linkedin: "" }
    }
  }
};
