import type { Language } from '../context/LanguageContext';

export interface TranslatedSkill {
  title: string;
  bnTitle?: string;
  subtitle?: string;
  description: string;
  badge?: string;
}

export interface SiteTranslations {
  nav: {
    brand: string;
    links: Record<string, string>;
    callNow: string;
    callWithNumber: string;
    active: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    statusPrefix: string;
    statusCert: string;
    greeting: string;
    name: string;
    role: string;
    institute: string;
    lead: string;
    ctaContact: string;
    ctaSkills: string;
    ctaCard: string;
    portraitAlt: string;
  };
  about: {
    kicker: string;
    heading: string;
    highlights: Record<string, { title: string; subtitle: string }>;
  };
  skills: {
    kicker: string;
    heading: string;
    subtitle: string;
    items: Record<string, TranslatedSkill>;
  };
  eeTools: {
    kicker: string;
    heading: string;
    subtitle: string;
    tabLoad: string;
    tabBill: string;
    load: {
      appliancesTitle: string;
      reset: string;
      qtyLabel: string;
      hoursLabel: string;
      hoursUnit: string;
      pumpHpLabel: string;
      customLoadLabel: string;
      customLoadHint: string;
      summaryTitle: string;
      totalPower: string;
      estimatedCurrent: string;
      currentFormulaNote: string;
      cableLabel: string;
      mcbLabel: string;
      dailyEnergyPreview: string;
      emptyPrompt: string;
      sendToBill: string;
      disclaimer: string;
      appliances: Record<string, string>;
      phaseNote: string;
    };
    bill: {
      inputsTitle: string;
      rateLabel: string;
      rateHint: string;
      breakdownTitle: string;
      editAppliancesBtn: string;
      emptyBreakdown: string;
      customRowLabel: string;
      connectedLoadLabel: string;
      summaryTitle: string;
      dailyUnits: string;
      monthlyUnits: string;
      estimatedBill: string;
      dailyCostLabel: string;
      unitsSuffix: string;
      currencySymbol: string;
      bdtLabel: string;
      note: string;
      reset: string;
    };
  };
  digitalCard: {
    buttonLabel: string;
    modalKicker: string;
    modalTitle: string;
    name: string;
    title: string;
    institute: string;
    phoneLabel: string;
    websiteLabel: string;
    scanCaption: string;
    qrAlt: string;
    qrFallback: string;
    saveVcf: string;
    savedVcf: string;
    copyLink: string;
    copiedLink: string;
    closeAria: string;
  };
  inspirations: {
    kicker: string;
    headingMain: string;
    headingAccent?: string;
    subtitle: string;
  };
  contact: {
    kicker: string;
    heading: string;
    subtitle: string;
    connectTitle: string;
    connectSubtitle: string;
    callNow: string;
    dial: string;
    formTitle: string;
    formSubtitle: string;
    labelName: string;
    placeholderName: string;
    labelEmail: string;
    placeholderEmail: string;
    labelMessage: string;
    placeholderMessage: string;
    sendButton: string;
    sendingButton: string;
    validation: {
      nameRequired: string;
      nameShort: string;
      emailRequired: string;
      emailInvalid: string;
      messageRequired: string;
      messageShort: string;
    };
    errorFallback: string;
    errorNetwork: string;
    successPrefix: string;
    successSuffix: string;
    toastTitle: string;
    toastBodyPrefix: string;
    toastBodySuffix: string;
    dismiss: string;
  };
  footer: {
    copyright: string;
    location: string;
    backToTop: string;
  };
  khiora: {
    roleBadge: string;
    headerSub: string;
    welcome: string;
    quickLabel: string;
    quickQuestions: string[];
    thinking: string;
    placeholder: string;
    previewUnavailable: string;
    resetTitle: string;
    closeAria: string;
    openAria: string;
    sendAria: string;
    micStartAria: string;
    micStopAria: string;
    micListening: string;
    micLangLabel: string;
    micUnsupported: string;
    micPermissionDenied: string;
    micNoSpeech: string;
    micErrorGeneric: string;
    micStopLabel: string;
  };
}

export const TRANSLATIONS: Record<Language, SiteTranslations> = {
  en: {
    nav: {
      brand: 'Abdul Baki',
      links: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        'ee-tools': 'EE Tools',
        inspirations: 'Inspirations',
        contact: 'Contact',
      },
      callNow: 'Call Now',
      callWithNumber: 'Call 01575586681',
      active: 'Active',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
    },
    hero: {
      statusPrefix: 'SYSTEM ONLINE',
      statusCert: 'EIM LV-3 CERTIFIED',
      greeting: 'Hi, I am',
      name: 'ABDUL BAKI',
      role: 'Electrical Engineering Student',
      institute: 'Bogura Government Polytechnic Institute',
      lead: 'Dedicated to safe electrical installation, house wiring, systematic troubleshooting, and crafting clean modern interfaces for the web.',
      ctaContact: 'Contact Me',
      ctaSkills: 'Explore Skills',
      ctaCard: 'Digital Card / QR',
      portraitAlt: 'Portrait of Abdul Baki, Electrical Engineering student',
    },
    about: {
      kicker: 'About Me',
      heading: 'Engineering discipline meets practical craftsmanship',
      highlights: {
        'ee-student': {
          title: 'EE Student',
          subtitle: 'Bogura Government Polytechnic Institute',
        },
        'eim-lv3': {
          title: 'EIM LV-3',
          subtitle: 'Certified Electrical Installation & Maintenance',
        },
        'lifelong-learner': {
          title: 'Lifelong Learner',
          subtitle: 'Blending Hardware, Tech & History',
        },
      },
    },
    skills: {
      kicker: 'Core Capabilities',
      heading: 'Technical Skills & Certification',
      subtitle:
        'Practical electrical engineering competencies grounded in certified safety standards, hands-on wiring, and modern web fundamentals.',
      items: {
        'eim-lv3': {
          title: 'EIM LV-3',
          subtitle: 'Electrical Installation & Maintenance Level-3',
          description:
            'Practical electrical systems, industrial and residential safety standards, inspection protocols, and preventative maintenance.',
          badge: 'CERTIFIED',
        },
        'house-wiring': {
          title: 'House Wiring',
          bnTitle: 'হাউজ ওয়্যারিং',
          description:
            'Residential electrical wiring, load distribution, earthing, switchboard setup, circuit protection, and systematic fault finding.',
        },
        'electrical-fundamentals': {
          title: 'Electrical Fundamentals',
          description:
            'Circuit analysis, AC/DC power distribution, switchgear concepts, and core electrical engineering principles.',
        },
        'problem-solving': {
          title: 'Problem Solving & Troubleshooting',
          description:
            'Systematic diagnostics, multimeter testing, root-cause fault isolation, and dependable practical technical solutions.',
        },
        'web-development': {
          title: 'Web Development Basics',
          description:
            'Clean semantic HTML, modern responsive CSS layouts, and building clear, fast user interfaces for the web.',
        },
        'continuous-learning': {
          title: 'Continuous Learning',
          description:
            'Exploring modern engineering tools, smart home automation concepts, and emerging AI technologies.',
        },
      },
    },
    eeTools: {
      kicker: 'Interactive Utilities',
      heading: 'EE Tools — Electrical Quick Calculators',
      subtitle:
        'Estimate residential house load, single-phase current, general cable/MCB sizing, and accurate per-appliance monthly electricity bills.',
      tabLoad: 'House Load & Wire Estimator',
      tabBill: 'Electricity Bill (kWh) Estimator',
      load: {
        appliancesTitle: 'Appliances, Quantity & Daily Hours',
        reset: 'Reset',
        qtyLabel: 'Qty',
        hoursLabel: 'Hrs/day',
        hoursUnit: 'h/d',
        pumpHpLabel: 'Motor Rating',
        customLoadLabel: 'Custom Additional Load',
        customLoadHint: 'e.g. iron, microwave, induction cooker',
        summaryTitle: 'Live Load Calculation',
        totalPower: 'Total Connected Load',
        estimatedCurrent: 'Estimated Current (220V, PF 0.85)',
        currentFormulaNote: 'Formula: I = P / (220 × 0.85)',
        cableLabel: 'Reference Main Cable Size',
        mcbLabel: 'Suggested MCB Rating',
        dailyEnergyPreview: 'Auto Daily Usage',
        emptyPrompt: 'Add appliances to calculate',
        sendToBill: 'View Detailed Monthly Bill',
        disclaimer:
          'General reference only: final cable gauge and MCB breaker selection depend on cable length (voltage drop), conduit type, earthing, and on-site inspection by a certified electrician.',
        appliances: {
          led: 'LED Light',
          fan: 'Ceiling Fan',
          tv: 'Television (TV)',
          fridge: 'Refrigerator',
          pump: 'Water Pump',
          ac: 'AC (1.5 Ton)',
        },
        phaseNote: 'High load — consider split circuits or 3-phase review',
      },
      bill: {
        inputsTitle: 'Tariff Rate & Appliance Breakdown',
        rateLabel: 'Rate per Unit (BDT / kWh)',
        rateHint: 'Default 8.5 BDT/kWh (adjust to your tariff slab)',
        breakdownTitle: 'Per-Appliance Daily Units (Watt × Qty × Hrs / 1000)',
        editAppliancesBtn: 'Edit Appliances / Qty',
        emptyBreakdown:
          'No active appliances selected. Add quantities in the House Load tab to calculate your bill automatically.',
        customRowLabel: 'Custom Load',
        connectedLoadLabel: 'Connected Load',
        summaryTitle: 'Estimated Energy & Monthly Bill',
        dailyUnits: 'Daily Consumption',
        monthlyUnits: 'Monthly Units (30 Days)',
        estimatedBill: 'Estimated Monthly Bill',
        dailyCostLabel: 'Approx. daily cost',
        unitsSuffix: 'kWh',
        currencySymbol: '৳',
        bdtLabel: 'BDT',
        note: 'Calculated automatically from each appliance’s individual daily hours. Actual utility bills may vary slightly depending on progressive tariff slabs, demand charge, meter rent, and VAT.',
        reset: 'Reset Defaults',
      },
    },
    digitalCard: {
      buttonLabel: 'Digital Card / QR',
      modalKicker: 'Digital Visiting Card',
      modalTitle: 'Scan or Save Contact',
      name: 'Abdul Baki',
      title: 'Electrical Engineering Student • EIM LV-3 Certified',
      institute: 'Bogura Government Polytechnic Institute',
      phoneLabel: 'Phone / WhatsApp',
      websiteLabel: 'Portfolio Website',
      scanCaption: 'Scan QR code to open portfolio',
      qrAlt: 'QR code linking to https://abdulbaki-e1m.pages.dev',
      qrFallback: 'abdulbaki-e1m.pages.dev',
      saveVcf: 'Save Contact (.vcf)',
      savedVcf: 'Contact Saved!',
      copyLink: 'Copy Link',
      copiedLink: 'Link Copied!',
      closeAria: 'Close Digital Visiting Card',
    },
    inspirations: {
      kicker: 'Knowledge & Reflection',
      headingMain: 'Inspirations & History',
      headingAccent: '(অনুপ্রেরণা ও ইতিহাস)',
      subtitle: 'ইতিহাস, আদর্শ ও শিক্ষণীয় ঘটনাবলি',
    },
    contact: {
      kicker: 'Get In Touch',
      heading: 'Contact Abdul Baki',
      subtitle:
        'Have a question about electrical installation, house wiring, or a project collaboration? Reach out directly or send a message below.',
      connectTitle: 'Connect Directly',
      connectSubtitle:
        'Tap to call directly or connect via social messaging platforms.',
      callNow: 'Call Now',
      dial: 'Dial',
      formTitle: 'Send a Message',
      formSubtitle:
        'Fill out the form and I will get back to you as soon as possible.',
      labelName: 'Your Name',
      placeholderName: 'e.g. Tariqul Islam',
      labelEmail: 'Email Address',
      placeholderEmail: 'you@example.com',
      labelMessage: 'Message',
      placeholderMessage:
        'Write your message, project details, or inquiry here...',
      sendButton: 'Send Message',
      sendingButton: 'Sending...',
      validation: {
        nameRequired: 'Please enter your name.',
        nameShort: 'Name must be at least 2 characters.',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        messageRequired: 'Please write a short message.',
        messageShort: 'Message should be at least 10 characters.',
      },
      errorFallback:
        'Unable to send your message right now. Please try again.',
      errorNetwork:
        'Network error while sending message. Please try again or call directly.',
      successPrefix: 'Thank you,',
      successSuffix:
        "! Your message has been sent to Abdul Baki's email. For an urgent response, feel free to call",
      toastTitle: 'Message Sent Successfully',
      toastBodyPrefix: 'Thanks',
      toastBodySuffix: ', Abdul Baki will respond to your inquiry shortly.',
      dismiss: 'Dismiss notification',
    },
    footer: {
      copyright: '© 2026 Abdul Baki',
      location: 'Bogura, Bangladesh',
      backToTop: 'Back to top ↑',
    },
    khiora: {
      roleBadge: 'EE Assistant',
      headerSub: 'English & বাংলা • Abdul Baki Portfolio',
      welcome:
        "Hi! I'm KHIORA, Abdul Baki's AI assistant. Ask me anything about his Electrical Engineering skills, EIM LV-3 certification, or how to contact him!",
      quickLabel: 'Quick questions',
      quickQuestions: [
        "What are Abdul Baki's skills?",
        'Tell me about EIM LV-3 & House Wiring',
        'How can I contact Abdul Baki?',
      ],
      thinking: 'KHIORA is thinking...',
      placeholder: 'Ask in English or বাংলা...',
      previewUnavailable:
        'KHIORA connects automatically to the live AI backend when deployed on Cloudflare Pages. In local or AI Studio preview, the /api/chat Pages Function is not active—once live on Cloudflare Pages with GEMINI_API_KEY set, I will answer in real time in both English and Bengali!',
      resetTitle: 'Reset conversation',
      closeAria: 'Close KHIORA AI chat',
      openAria: 'Open KHIORA AI assistant',
      sendAria: 'Send message',
      micStartAria: 'Start voice input',
      micStopAria: 'Stop voice input',
      micListening: 'Listening... / শুনছি...',
      micLangLabel: 'Voice',
      micUnsupported:
        'Voice input is not supported in this browser. Try Chrome, Edge, or Safari, or type your message below.',
      micPermissionDenied:
        'Microphone access was blocked. Please allow microphone permission in your browser settings to use voice input.',
      micNoSpeech: 'No speech detected. Tap the microphone and try speaking again.',
      micErrorGeneric: 'Could not capture voice right now. Please try again or type your message.',
      micStopLabel: 'Stop',
    },
  },
  bn: {
    nav: {
      brand: 'আব্দুল বাকি',
      links: {
        home: 'হোম',
        about: 'আমার সম্পর্কে',
        skills: 'দক্ষতা',
        'ee-tools': 'ইই টুলস',
        inspirations: 'অনুপ্রেরণা',
        contact: 'যোগাযোগ',
      },
      callNow: 'কল করুন',
      callWithNumber: 'কল করুন 01575586681',
      active: 'সক্রিয়',
      openMenu: 'নেভিগেশন মেনু খুলুন',
      closeMenu: 'নেভিগেশন মেনু বন্ধ করুন',
    },
    hero: {
      statusPrefix: 'সিস্টেম অনলাইন',
      statusCert: 'EIM LV-3 সার্টিফায়েড',
      greeting: 'হাই, আমি',
      name: 'আব্দুল বাকি',
      role: 'ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং স্টুডেন্ট',
      institute: 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট',
      lead: 'নিরাপদ ইলেকট্রিক্যাল ইনস্টলেশন, হাউজ ওয়্যারিং, সুশৃঙ্খল ট্রাবলশুটিং এবং আধুনিক ওয়েব ইন্টারফেস নির্মাণে নিবেদিত।',
      ctaContact: 'যোগাযোগ করুন',
      ctaSkills: 'দক্ষতা দেখুন',
      ctaCard: 'ডিজিটাল কার্ড / QR',
      portraitAlt: 'আব্দুল বাকি — ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং স্টুডেন্টের প্রতিকৃতি',
    },
    about: {
      kicker: 'আমার সম্পর্কে',
      heading: 'ইঞ্জিনিয়ারিং শৃঙ্খলা ও বাস্তব দক্ষতার সমন্বয়',
      highlights: {
        'ee-student': {
          title: 'ইই স্টুডেন্ট (EE Student)',
          subtitle: 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট',
        },
        'eim-lv3': {
          title: 'EIM LV-3',
          subtitle: 'সার্টিফায়েড ইলেকট্রিক্যাল ইনস্টলেশন ও মেইনটেন্যান্স',
        },
        'lifelong-learner': {
          title: 'আজীবন শিক্ষার্থী',
          subtitle: 'হার্ডওয়্যার, প্রযুক্তি ও ইতিহাসের সমন্বয়',
        },
      },
    },
    skills: {
      kicker: 'মূল সক্ষমতা',
      heading: 'প্রযুক্তিগত দক্ষতা ও সার্টিফিকেশন',
      subtitle:
        'সার্টিফায়েড নিরাপত্তা মানদণ্ড, বাস্তব হাউজ ওয়্যারিং অভিজ্ঞতা এবং আধুনিক ওয়েব প্রযুক্তির সমন্বয়ে গড়ে ওঠা ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং দক্ষতা।',
      items: {
        'eim-lv3': {
          title: 'EIM LV-3',
          subtitle: 'ইলেকট্রিক্যাল ইনস্টলেশন ও মেইনটেন্যান্স লেভেল-৩',
          description:
            'বাস্তব ইলেকট্রিক্যাল সিস্টেম, আবাসিক ও ইন্ডাস্ট্রিয়াল নিরাপত্তা মানদণ্ড, পরিদর্শন প্রোটোকল এবং নিয়মিত রক্ষণাবেক্ষণ।',
          badge: 'সার্টিফায়েড',
        },
        'house-wiring': {
          title: 'হাউজ ওয়্যারিং',
          bnTitle: 'House Wiring',
          description:
            'আবাসিক ইলেকট্রিক্যাল ওয়্যারিং, লোড ডিস্ট্রিবিউশন, আর্থিং, সুইচবোর্ড সেটআপ, সার্কিট প্রোটেকশন এবং সুশৃঙ্খল ফল্ট নির্ণয়।',
        },
        'electrical-fundamentals': {
          title: 'ইলেকট্রিক্যাল ফান্ডামেন্টালস',
          description:
            'সার্কিট অ্যানালাইসিস, এসি/ডিসি পাওয়ার ডিস্ট্রিবিউশন, সুইচগিয়ার ধারণা এবং ইলেকট্রিক্যাল ইঞ্জিনিয়ারিংয়ের মৌলিক নীতি।',
        },
        'problem-solving': {
          title: 'সমস্যা সমাধান ও ট্রাবলশুটিং',
          description:
            'পদ্ধতিগত ডায়াগনস্টিকস, মাল্টিমিটার টেস্টিং, মূল ত্রুটি শনাক্তকরণ এবং নির্ভরযোগ্য বাস্তব কারিগরি সমাধান।',
        },
        'web-development': {
          title: 'ওয়েব ডেভেলপমেন্ট বেসিকস',
          description:
            'পরিচ্ছন্ন HTML, আধুনিক রেসপন্সিভ CSS লেআউট এবং দ্রুত ও দৃষ্টিনন্দন ওয়েব ইন্টারফেস তৈরি।',
        },
        'continuous-learning': {
          title: 'নিরন্তর শেখার আগ্রহ',
          description:
            'আধুনিক ইঞ্জিনিয়ারিং টুলস, স্মার্ট হোম অটোমেশন ধারণা এবং নতুন কৃত্রিম বুদ্ধিমত্তা (AI) প্রযুক্তি অন্বেষণ।',
        },
      },
    },
    eeTools: {
      kicker: 'ইন্টারেক্টিভ ইঞ্জিনিয়ারিং টুলস',
      heading: 'ইই টুলস — ইলেকট্রিক্যাল কুইক ক্যালকুলেটর',
      subtitle:
        'বাসাবাড়ির মোট লোড, সিঙ্গেল-ফেজ কারেন্ট, তার ও MCB-এর সাধারণ ধারণা এবং প্রতিটি যন্ত্রের আলাদা ব্যবহারের ঘণ্টা অনুযায়ী সঠিক মাসিক বিদ্যুৎ বিল হিসাব করুন।',
      tabLoad: 'হাউজ লোড ও তার নির্ণায়ক',
      tabBill: 'বিদ্যুৎ বিল (ইউনিট) হিসাব',
      load: {
        appliancesTitle: 'যন্ত্রপাতি, সংখ্যা ও দৈনিক ব্যবহারের ঘণ্টা',
        reset: 'রিসেট',
        qtyLabel: 'সংখ্যা',
        hoursLabel: 'ঘণ্টা/দিন',
        hoursUnit: 'ঘণ্টা/দিন',
        pumpHpLabel: 'মোটরের ক্ষমতা',
        customLoadLabel: 'অতিরিক্ত কাস্টম লোড',
        customLoadHint: 'যেমন: ইস্ত্রি, মাইক্রোওয়েভ, ইন্ডাকশন কুকার',
        summaryTitle: 'তাৎক্ষণিক লোড হিসাব',
        totalPower: 'মোট সংযুক্ত লোড',
        estimatedCurrent: 'আনুমানিক কারেন্ট (২২০V, PF 0.85)',
        currentFormulaNote: 'সূত্র: I = P / (220 × 0.85)',
        cableLabel: 'মেইন তারের সাধারণ সাইজ',
        mcbLabel: 'সম্ভাব্য MCB ব্রেকার রেটিং',
        dailyEnergyPreview: 'দৈনিক আনুমানিক ইউনিট',
        emptyPrompt: 'হিসাব দেখতে যন্ত্র যোগ করুন',
        sendToBill: 'বিস্তারিত মাসিক বিল দেখুন',
        disclaimer:
          'সতর্কতা: এটি একটি সাধারণ প্রাথমিক ধারণা মাত্র। চূড়ান্ত তারের সাইজ ও MCB নির্বাচন তারের দূরত্ব (ভোল্টেজ ড্রপ), ওয়্যারিং পদ্ধতি ও সরেজমিন পরিদর্শনের ওপর নির্ভর করে।',
        appliances: {
          led: 'এলইডি লাইট (LED)',
          fan: 'সিলিং ফ্যান',
          tv: 'টেলিভিশন (TV)',
          fridge: 'ফ্রিজ (Refrigerator)',
          pump: 'পানির পাম্প',
          ac: 'এসি (১.৫ টন)',
        },
        phaseNote: 'অধিক লোড — একাধিক সার্কিট বা থ্রি-ফেজ যাচাই করুন',
      },
      bill: {
        inputsTitle: 'ইউনিট দর ও যন্ত্রভিত্তিক হিসাব',
        rateLabel: 'প্রতি ইউনিট দর (টাকা / kWh)',
        rateHint: 'ডিফল্ট ৮.৫ টাকা/ইউনিট (আপনার ট্যারিফ অনুযায়ী বদলান)',
        breakdownTitle: 'যন্ত্রভিত্তিক দৈনিক ইউনিট (ওয়াট × সংখ্যা × ঘণ্টা ÷ ১০০০)',
        editAppliancesBtn: 'যন্ত্র ও সংখ্যা পরিবর্তন করুন',
        emptyBreakdown:
          'কোনো যন্ত্র নির্বাচিত নেই। স্বয়ংক্রিয় বিল হিসাব দেখতে হাউজ লোড ট্যাবে গিয়ে যন্ত্রের সংখ্যা যোগ করুন।',
        customRowLabel: 'কাস্টম লোড',
        connectedLoadLabel: 'সংযুক্ত লোড',
        summaryTitle: 'আনুমানিক ইউনিট ও মাসিক বিল',
        dailyUnits: 'দৈনিক ইউনিট',
        monthlyUnits: 'মাসিক ইউনিট (৩০ দিন)',
        estimatedBill: 'আনুমানিক মাসিক বিল',
        dailyCostLabel: 'আনুমানিক দৈনিক খরচ',
        unitsSuffix: 'ইউনিট (kWh)',
        currencySymbol: '৳',
        bdtLabel: 'টাকা',
        note: 'প্রতিটি যন্ত্রের আলাদা দৈনিক ব্যবহারের ঘণ্টা যোগ করে এই হিসাব তৈরি করা হয়েছে। বিদ্যুৎ বিলের স্ল্যাব, ডিমান্ড চার্জ, মিটার ভাড়া ও ভ্যাটের কারণে প্রকৃত বিল কিছুটা ভিন্ন হতে পারে।',
        reset: 'ডিফল্ট রিসেট',
      },
    },
    digitalCard: {
      buttonLabel: 'ডিজিটাল কার্ড / QR',
      modalKicker: 'ডিজিটাল ভিজিটিং কার্ড',
      modalTitle: 'QR স্ক্যান করুন বা কন্টাক্ট সেভ করুন',
      name: 'আব্দুল বাকি',
      title: 'ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং স্টুডেন্ট • EIM LV-3 সার্টিফায়েড',
      institute: 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট',
      phoneLabel: 'ফোন / হোয়াটসঅ্যাপ',
      websiteLabel: 'পোর্টফোলিও ওয়েবসাইট',
      scanCaption: 'পোর্টফোলিও খুলতে QR কোড স্ক্যান করুন',
      qrAlt: 'https://abdulbaki-e1m.pages.dev এর QR কোড',
      qrFallback: 'abdulbaki-e1m.pages.dev',
      saveVcf: 'কন্টাক্ট সেভ করুন (.vcf)',
      savedVcf: 'কন্টাক্ট সেভ হয়েছে!',
      copyLink: 'লিংক কপি করুন',
      copiedLink: 'লিংক কপি হয়েছে!',
      closeAria: 'ডিজিটাল ভিজিটিং কার্ড বন্ধ করুন',
    },
    inspirations: {
      kicker: 'জ্ঞান ও অনুপ্রেরণা',
      headingMain: 'অনুপ্রেরণা ও ইতিহাস',
      subtitle: 'ইতিহাস, আদর্শ ও শিক্ষণীয় ঘটনাবলি',
    },
    contact: {
      kicker: 'যোগাযোগ করুন',
      heading: 'আব্দুল বাকির সাথে যোগাযোগ',
      subtitle:
        'ইলেকট্রিক্যাল ইনস্টলেশন, হাউজ ওয়্যারিং বা যেকোনো প্রজেক্ট নিয়ে কথা বলতে চান? সরাসরি যোগাযোগ করুন অথবা নিচের ফর্মে বার্তা পাঠান।',
      connectTitle: 'সরাসরি যোগাযোগ করুন',
      connectSubtitle:
        'সরাসরি ফোন কল করতে বা সোশ্যাল মেসেজিংয়ে যুক্ত হতে নিচে ক্লিক করুন।',
      callNow: 'কল করুন',
      dial: 'ডায়াল',
      formTitle: 'বার্তা পাঠান',
      formSubtitle:
        'নিচের ফর্মটি পূরণ করে বার্তা পাঠান—আমি যত দ্রুত সম্ভব উত্তর দেব।',
      labelName: 'আপনার নাম',
      placeholderName: 'যেমন: তারিকুল ইসলাম',
      labelEmail: 'ইমেইল ঠিকানা',
      placeholderEmail: 'you@example.com',
      labelMessage: 'আপনার বার্তা',
      placeholderMessage:
        'আপনার বার্তা, প্রজেক্টের বিবরণ বা যেকোনো প্রশ্ন এখানে লিখুন...',
      sendButton: 'বার্তা পাঠান',
      sendingButton: 'পাঠানো হচ্ছে...',
      validation: {
        nameRequired: 'অনুগ্রহ করে আপনার নাম লিখুন।',
        nameShort: 'নাম কমপক্ষে ২ অক্ষরের হতে হবে।',
        emailRequired: 'অনুগ্রহ করে আপনার ইমেইল ঠিকানা লিখুন।',
        emailInvalid: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।',
        messageRequired: 'অনুগ্রহ করে একটি সংক্ষিপ্ত বার্তা লিখুন।',
        messageShort: 'বার্তাটি কমপক্ষে ১০ অক্ষরের হতে হবে।',
      },
      errorFallback:
        'এই মুহূর্তে বার্তা পাঠানো সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      errorNetwork:
        'বার্তা পাঠাতে নেটওয়ার্ক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি কল করুন।',
      successPrefix: 'ধন্যবাদ,',
      successSuffix:
        '! আপনার বার্তাটি আব্দুল বাকির ইমেইলে সফলভাবে পৌঁছে গেছে। জরুরি প্রয়োজনে সরাসরি কল করুন',
      toastTitle: 'বার্তা সফলভাবে পাঠানো হয়েছে',
      toastBodyPrefix: 'ধন্যবাদ',
      toastBodySuffix: ', আব্দুল বাকি শীঘ্রই আপনার বার্তার উত্তর দেবেন।',
      dismiss: 'নোটিফিকেশন বন্ধ করুন',
    },
    footer: {
      copyright: '© ২০২৬ আব্দুল বাকি',
      location: 'বগুড়া, বাংলাদেশ',
      backToTop: 'উপরে ফিরুন ↑',
    },
    khiora: {
      roleBadge: 'ইই সহকারী',
      headerSub: 'বাংলা ও English • আব্দুল বাকি পোর্টফোলিও',
      welcome:
        'আসসালামু আলাইকুম! আমি KHIORA, আব্দুল বাকির AI সহকারী। তাঁর ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং দক্ষতা, EIM LV-3 সার্টিফিকেশন, যোগাযোগের মাধ্যম বা যেকোনো বিষয়ে আমাকে জিজ্ঞাসা করুন!',
      quickLabel: 'দ্রুত প্রশ্ন',
      quickQuestions: [
        'আব্দুল বাকির দক্ষতাগুলো কী কী?',
        'EIM LV-3 এবং হাউজ ওয়্যারিং সম্পর্কে বলুন',
        'আব্দুল বাকির সাথে কীভাবে যোগাযোগ করব?',
      ],
      thinking: 'KHIORA উত্তর তৈরি করছে...',
      placeholder: 'বাংলা বা ইংরেজিতে প্রশ্ন লিখুন...',
      previewUnavailable:
        'Cloudflare Pages-এ লাইভ হলে KHIORA স্বয়ংক্রিয়ভাবে AI ব্যাকএন্ডের সাথে যুক্ত হয়ে যাবে। লোকাল বা AI Studio প্রিভিউতে /api/chat Pages Function সক্রিয় থাকে না—Cloudflare Pages-এ GEMINI_API_KEY সেট করা থাকলে আমি বাংলা ও ইংরেজি উভয় ভাষাতেই তাৎক্ষণিক উত্তর দেব!',
      resetTitle: 'কথোপকথন রিসেট করুন',
      closeAria: 'KHIORA AI চ্যাট বন্ধ করুন',
      openAria: 'KHIORA AI সহকারী খুলুন',
      sendAria: 'বার্তা পাঠান',
      micStartAria: 'ভয়েস ইনপুট চালু করুন',
      micStopAria: 'ভয়েস ইনপুট বন্ধ করুন',
      micListening: 'শুনছি... / Listening...',
      micLangLabel: 'ভয়েস',
      micUnsupported:
        'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে Chrome, Edge বা Safari ব্যবহার করুন অথবা নিচে টাইপ করে প্রশ্ন করুন।',
      micPermissionDenied:
        'মাইক্রোফোনের অনুমতি দেওয়া হয়নি। ভয়েস ইনপুট ব্যবহার করতে ব্রাউজার সেটিংস থেকে মাইক্রোফোনের অনুমতি দিন।',
      micNoSpeech: 'কোনো কথা শোনা যায়নি। মাইক্রোফোনে ট্যাপ করে আবার বলুন।',
      micErrorGeneric: 'এই মুহূর্তে ভয়েস শোনা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন বা টাইপ করুন।',
      micStopLabel: 'থামান',
    },
  },
};
