export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  subtitle: string;
  accent: 'cyan' | 'amber';
}

export interface SkillItem {
  id: string;
  title: string;
  bnTitle?: string;
  subtitle?: string;
  description: string;
  featured?: boolean;
  badge?: string;
  iconName: 'award' | 'home' | 'zap' | 'wrench' | 'code' | 'compass';
}

export interface InspirationFact {
  label: string;
  value: string;
}

export interface InspirationSpecialSection {
  title: string;
  intro: string;
  points: string[];
}

export interface InspirationItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  motif: 'octagram' | 'manuscript' | 'maritime';
  facts: InspirationFact[];
  paragraphs: string[];
  specialSection?: InspirationSpecialSection;
  lesson: string;
  source: string;
}

export interface SocialChannel {
  id: string;
  platform: string;
  displayPrimary: string;
  displaySecondary?: string;
  href: string;
  type: 'whatsapp' | 'facebook' | 'instagram' | 'telegram';
}

export const PROFILE_IMAGE_URL =
  '/assets/aistudio/PXL_20261108_074916719.PORTRAIT_2.jpg_2764c064.jpeg';

export const PHONE_DISPLAY = '01575586681';
export const PHONE_HREF = 'tel:+8801575586681';
export const PORTFOLIO_URL = 'https://abdulbaki-e1m.pages.dev';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'ee-tools', label: 'EE Tools', href: '#ee-tools' },
  { id: 'inspirations', label: 'Inspirations', href: '#inspirations' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const ABOUT_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'ee-student',
    title: 'EE Student',
    subtitle: 'Bogura Government Polytechnic Institute',
    accent: 'cyan',
  },
  {
    id: 'eim-lv3',
    title: 'EIM LV-3',
    subtitle: 'Certified Electrical Installation & Maintenance',
    accent: 'amber',
  },
  {
    id: 'lifelong-learner',
    title: 'Lifelong Learner',
    subtitle: 'Blending Hardware, Tech & History',
    accent: 'cyan',
  },
];

export const SKILLS: SkillItem[] = [
  {
    id: 'eim-lv3',
    title: 'EIM LV-3',
    subtitle: 'Electrical Installation & Maintenance Level-3',
    description:
      'Practical electrical systems, industrial and residential safety standards, inspection protocols, and preventative maintenance.',
    featured: true,
    badge: 'CERTIFIED',
    iconName: 'award',
  },
  {
    id: 'house-wiring',
    title: 'House Wiring',
    bnTitle: 'হাউজ ওয়্যারিং',
    description:
      'Residential electrical wiring, load distribution, earthing, switchboard setup, circuit protection, and systematic fault finding.',
    iconName: 'home',
  },
  {
    id: 'electrical-fundamentals',
    title: 'Electrical Fundamentals',
    description:
      'Circuit analysis, AC/DC power distribution, switchgear concepts, and core electrical engineering principles.',
    iconName: 'zap',
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving & Troubleshooting',
    description:
      'Systematic diagnostics, multimeter testing, root-cause fault isolation, and dependable practical technical solutions.',
    iconName: 'wrench',
  },
  {
    id: 'web-development',
    title: 'Web Development Basics',
    description:
      'Clean semantic HTML, modern responsive CSS layouts, and building clear, fast user interfaces for the web.',
    iconName: 'code',
  },
  {
    id: 'continuous-learning',
    title: 'Continuous Learning',
    description:
      'Exploring modern engineering tools, smart home automation concepts, and emerging AI technologies.',
    iconName: 'compass',
  },
];

export const INSPIRATIONS: InspirationItem[] = [
  {
    id: 'prophet-muhammad',
    title: 'হযরত মুহাম্মদ (সা.) — সংক্ষিপ্ত জীবনী',
    category: 'সীরাত ও আদর্শ',
    motif: 'octagram',
    summary:
      '৫৭০ খ্রিস্টাব্দে হস্তিবর্ষে মক্কার সম্ভ্রান্ত কুরাইশ বংশের বনু হাশিম গোত্রে জন্মগ্রহণকারী মানবতার শ্রেষ্ঠ আদর্শ হযরত মুহাম্মদ (সা.)-এর সংক্ষিপ্ত জীবনবৃত্তান্ত ও সত্য-ন্যায়ের অনন্য বিপ্লব।',
    facts: [
      { label: 'জন্ম', value: '৫৭০ খ্রিস্টাব্দ (হস্তিবর্ষ, মক্কা)' },
      { label: 'ওফাত', value: '৬৩২ খ্রিস্টাব্দ / ১১ হিজরি (মদিনা)' },
      { label: 'পিতা ও মাতা', value: 'আব্দুল্লাহ ইবনে আব্দুল মুত্তালিব ও আমিনা বিনতে ওয়াহাব' },
      { label: 'বংশ ও গোত্র', value: 'কুরাইশ বংশের বনু হাশিম গোত্র' },
    ],
    paragraphs: [
      'সর্বশেষ ও সর্বশ্রেষ্ঠ নবী হযরত মুহাম্মদ (সা.) ৫৭০ খ্রিস্টাব্দে (ঐতিহাসিক হস্তিবর্ষে) আরবের পবিত্র মক্কা নগরীতে জন্মগ্রহণ করেন। তাঁর পিতা ছিলেন আব্দুল্লাহ ইবনে আব্দুল মুত্তালিব এবং মাতা আমিনা বিনতে ওয়াহাব। তিনি আরবের সম্ভ্রান্ত কুরাইশ বংশের সম্মানিত বনু হাশিম গোত্রের সন্তান ছিলেন। জন্মের পূর্বেই পিতা এবং শৈশবেই মাতা ও দাদাকে হারিয়ে অত্যন্ত সংগ্রামময় পরিবেশে তিনি বেড়ে ওঠেন, তবুও তাঁর সততা, আমানতদারিতা ও কোমল আচরণের কারণে মক্কাবাসী তাঁকে ‘আল-আমিন’ (বিশ্বস্ত) ও ‘আস-সাদিক’ (সত্যবাদী) উপাধিতে ভূষিত করেছিল।',
      'তৎকালীন আরব সমাজ ছিল আইয়ামে জাহেলিয়াতের ঘোর অন্ধকার, কুসংস্কার, গোত্রীয় হানাহানি, কন্যাশিশু হত্যা ও চরম অন্যায়-অবিচারে নিমজ্জিত। চল্লিশ বছর বয়সে হেরা গুহায় ওহী লাভের পর তিনি মানুষকে এক আল্লাহর ইবাদত অর্থাৎ তাওহিদের পথে আহ্বান জানান। মক্কার তেরো বছরের দাওয়াতি জীবনে তিনি ও তাঁর অনুসারীরা অবর্ণনীয় নির্যাতন, সামাজিক বয়কট ও নিপীড়নের শিকার হন; কিন্তু অসাধারণ ধৈর্য, প্রজ্ঞা ও অটল সত্যনিষ্ঠা থেকে তিনি কখনো বিচ্যুত হননি।',
      'মদিনায় হিজরতের পর তিনি মদিনা সনদের মাধ্যমে ধর্ম-বর্ণ নির্বিশেষে ন্যায়বিচার, মানবিক মর্যাদা ও ভ্রাতৃত্বভিত্তিক এক আদর্শ সমাজ প্রতিষ্ঠা করেন। তাঁর ২৩ বছরের নবুয়তি জীবন শেষে ৬৩২ খ্রিস্টাব্দে (১১ হিজরি) মদিনায় ওফাতের আগেই আরব উপদ্বীপের বুকে সত্য, ন্যায় ও ইসলামের আলো সুপ্রতিষ্ঠিত হয়, যা আজও সমগ্র মানবজাতির জন্য চিরন্তন পথনির্দেশনা হয়ে আছে।',
    ],
    specialSection: {
      title: 'বিদায় হজের ঐতিহাসিক ভাষণ (১০ হিজরি / ৬৩২ খ্রি., আরাফাতের ময়দান)',
      intro:
        'ওফাতের মাত্র কয়েক মাস আগে ১০ হিজরির ৯ জিলহজ আরাফাতের ময়দানে লক্ষাধিক সাহাবির সামনে মহানবী হযরত মুহাম্মদ (সা.) যে ঐতিহাসিক ভাষণ প্রদান করেন, তা মানবতার ইতিহাসে মানবাধিকার ও ন্যায়বিচারের সর্বশ্রেষ্ঠ সনদ হিসেবে চিরস্মরণীয় হয়ে আছে। তাঁর ভাষণের মূল বার্তাগুলো ছিল:',
      points: [
        'মানুষের জীবন, রক্ত ও সম্পদের পবিত্রতা রক্ষা করা এবং অন্যায়ভাবে কারও কোনো ক্ষতি না করা।',
        'আইয়ামে জাহেলিয়াতের সকল রক্তপাত, প্রতিশোধপ্রবণতা ও সুদ (রিবা) চিরতরে বাতিল ঘোষণা।',
        'নারীদের অধিকার, মর্যাদা ও নিরাপত্তার নিশ্চয়তা এবং তাদের সাথে সর্বদা সদ্ব্যবহারের স্পষ্ট নির্দেশ।',
        'বংশ, বর্ণ বা ভাষার ভিত্তিতে কোনো শ্রেষ্ঠত্ব নেই—সাদা-কালো বা আরব-অনারব সবাই সমান; আল্লাহর কাছে মর্যাদার একমাত্র মাপকাঠি হলো তাকওয়া (খোদাভীতি)।',
        'সত্য ও সঠিক পথে অটল থাকতে মহাগ্রন্থ আল-কুরআন ও রাসূলের সুন্নাহকে দৃঢ়ভাবে আঁকড়ে ধরার আহ্বান।',
      ],
    },
    lesson:
      'সত্যের পথে অটল থাকা, প্রতিকূলতায় ধৈর্য ধারণ করা এবং ন্যায় ও মানবতার মাধ্যমে সমাজ পরিবর্তন করাই সীরাতের সর্বশ্রেষ্ঠ শিক্ষা।',
    source: 'তথ্যসূত্র: আর-রাহীকুল মাখতূম, সীরাতে ইবনে হিশাম ও সহীহ মুসলিম',
  },
  {
    id: 'bani-israel-to-jews',
    title: 'বনী ইসরায়েল থেকে আজকের ইহুদি জাতি',
    category: 'ঐতিহাসিক পথপরিক্রমা',
    motif: 'manuscript',
    summary:
      'হযরত ইয়াকুব (আ.)-এর উপাধি ‘ইসরায়েল’ থেকে বনী ইসরায়েল জাতির সূচনা, মিসর-সিনাই-ফিলিস্তিনের ঐতিহাসিক যাত্রা এবং ‘ইয়াহুদা’ গোত্র থেকে আজকের ইহুদি পরিচয়ের তথ্যভিত্তিক ইতিহাস।',
    facts: [
      { label: 'মূল পূর্বপুরুষ', value: 'হযরত ইয়াকুব (আ.), যাঁর অপর নাম ‘ইসরায়েল’' },
      { label: 'ঐতিহাসিক অঞ্চল', value: 'মিসর, সিনাই উপদ্বীপ ও ফিলিস্তিন (কানআন)' },
      { label: 'নামের উৎপত্তি', value: 'চতুর্থ পুত্র ‘ইয়াহুদা’ ও যিহূদা রাজ্য (Judah)' },
      { label: 'উল্লেখযোগ্য নবীগণ', value: 'হযরত ইউসুফ, মূসা, দাউদ ও সুলাইমান (আ.)' },
    ],
    paragraphs: [
      'হযরত ইব্রাহীম (আ.)-এর পৌত্র এবং হযরত ইসহাক (আ.)-এর পুত্র হযরত ইয়াকুব (আ.)-এর অপর নাম বা উপাধি ছিল ‘ইসরায়েল’ (আল্লাহর বান্দা)। তাঁর বারো পুত্রের বংশধররাই ইতিহাসে ‘বনী ইসরায়েল’ বা ইসরায়েলের সন্তান নামে পরিচিত। হযরত ইউসুফ (আ.)-এর সময়কালে এই বংশের মানুষ কানআন (ফিলিস্তিন) অঞ্চল থেকে মিসরে বসবাস শুরু করে এবং শতাব্দীর পর শতাব্দী সেখানে বিস্তৃত হয়।',
      'পরবর্তীকালে মিসরের ফিরাউনদের চরম দাসত্ব ও নির্যাতনের মুখে আল্লাহ তাআলা হযরত মূসা (আ.) ও হারূন (আ.)-কে প্রেরণ করেন। লোহিত সাগর অতিক্রম করে সিনাই মরুভূমির দীর্ঘ পথপরিক্রমা শেষে বনী ইসরায়েল পুনরায় ফিলিস্তিন অঞ্চলে প্রবেশ করে। এরপর হযরত দাউদ (আ.) ও হযরত সুলাইমান (আ.)-এর শাসনামলে তারা এক শক্তিশালী ও সমৃদ্ধ রাষ্ট্র গড়ে তোলে এবং জেরুজালেম তাদের ধর্মীয় ও রাজনৈতিক কেন্দ্রে পরিণত হয়।',
      'হযরত সুলাইমান (আ.)-এর ওফাতের পর বনী ইসরায়েলের রাজ্য উত্তর (ইসরায়েল) ও দক্ষিণ (ইয়াহুদা বা যিহূদা)—এই দুই ভাগে বিভক্ত হয়ে পড়ে। উত্তরের দশটি গোত্র আসিরীয় আক্রমণে বিচ্ছিন্ন হয়ে যাওয়ার পর দক্ষিণের ‘ইয়াহুদা’ গোত্রের বংশধররাই মূল ধর্মীয় ঐতিহ্য ধরে রাখে। পরবর্তীতে ব্যবিলনীয় নির্বাসন ও রোমান শাসনামলে বিশ্বজুড়ে ছড়িয়ে পড়ার মধ্য দিয়ে সেই ‘ইয়াহুদা’ নাম থেকেই ‘ইহুদি’ (Jews) পরিচয়টি গড়ে ওঠে, যা আজও ইতিহাসে পরিচিত।',
    ],
    lesson:
      'ইতিহাসের উত্থান-পতন আমাদের শেখায় যে আল্লাহর নেয়ামতের কৃতজ্ঞতা, ন্যায়পরায়ণতা ও ঐক্যই কোনো জাতির স্থায়িত্বের মূল ভিত্তি।',
    source: 'তথ্যসূত্র: আল-কুরআন ও ইসলামিক ইতিহাস',
  },
  {
    id: 'ashabus-sabt',
    title: 'আসহাবুস সাবত — শনিবার মাছ ধরার নিষেধাজ্ঞা ও পরিণতি',
    category: 'কুরআনের শিক্ষণীয় ঘটনা',
    motif: 'maritime',
    summary:
      'হযরত দাউদ (আ.)-এর সময়কার লোহিত সাগর তীরবর্তী ‘আইলাহ’ জনপদের সেই ঐতিহাসিক পরীক্ষা, কৌশলগত অবাধ্যতা এবং তার ভয়াবহ পরিণতির শিক্ষণীয় বিবরণ।',
    facts: [
      { label: 'সময়কাল', value: 'হযরত দাউদ (আ.)-এর সময়কার ঘটনা' },
      { label: 'স্থান', value: 'লোহিত সাগর তীরবর্তী ‘আইলাহ’ জনপদ' },
      { label: 'বিধান ও পরীক্ষা', value: 'শনিবার মাছ ধরা নিষিদ্ধ, অথচ সেদিনই মাছ ভেসে উঠত' },
      { label: 'পরিণতি', value: 'অবাধ্যরা আল্লাহর গজবে লাঞ্ছিত বানরে পরিণত হয়' },
    ],
    paragraphs: [
      'আসহাবুস সাবত বা শনিবারওয়ালাদের ঘটনাটি হযরত দাউদ (আ.)-এর সময়কার লোহিত সাগর তীরবর্তী ‘আইলাহ’ নামক একটি সমুদ্র-উপকূলীয় জনপদের ঘটনা। বনী ইসরায়েলের এই জনপদের মানুষের জন্য আল্লাহর পক্ষ থেকে শনিবার দিনটি সম্পূর্ণরূপে ইবাদতের জন্য নির্ধারিত ছিল এবং সেদিন মাছ ধরা কঠোরভাবে নিষিদ্ধ ছিল। কিন্তু আল্লাহর পক্ষ থেকে এক কঠিন পরীক্ষার অংশ হিসেবে শনিবারেই বিপুল পরিমাণ মাছ পানির ওপরে ভেসে উঠত, আর সপ্তাহের অন্যান্য দিনে মাছ সহজে দেখা যেত না।',
      'এই পরীক্ষায় জনপদের মানুষ তিনটি দলে বিভক্ত হয়ে পড়ে। একদল লোভ সংবরণ করতে না পেরে সূক্ষ্ম কৌশল অবলম্বন করে—তারা শুক্রবারে সমুদ্রের তীরে গর্ত বা খাল কেটে বাঁধ দিয়ে রাখত, যাতে শনিবারে মাছগুলো সহজেই সেই গর্তে এসে আটকে পড়ে, আর রবিবার সকালে তারা গিয়ে মাছগুলো ধরে নিত। বাহ্যিকভাবে তারা দাবি করত যে তারা শনিবারে মাছ ধরেনি, কিন্তু প্রকৃতপক্ষে এটি ছিল আল্লাহর নির্দেশের সঙ্গে স্পষ্ট প্রতারণা ও অবাধ্যতা।',
      'জনপদের সৎ ও আল্লাহভীরু মানুষরা বারবার তাদের এই সীমালঙ্ঘন থেকে বিরত থাকার জন্য সতর্ক করেছিলেন এবং আরেক দল ছিল নীরব দর্শক। বারবার নিষেধ সত্ত্বেও অবাধ্য দলটি যখন অহংকারবশত নিজেদের কৌশল ও পাপাচার চালিয়ে যেতে থাকল, তখন আল্লাহর কঠিন গজব নেমে আসে। আল্লাহ তাআলা সৎ ও নিষেধকারী মানুষদের রক্ষা করেন, আর অবাধ্যদের আকৃতি বিকৃত করে লাঞ্ছিত বানরে পরিণত করেন—যা পরবর্তী সকল প্রজন্মের জন্য এক গভীর সতর্কবার্তা হয়ে রয়েছে।',
    ],
    lesson:
      'নৈতিক বিধান বা স্রষ্টার নির্দেশকে চাতুরী ও কৌশলের মাধ্যমে এড়িয়ে যাওয়ার চেষ্টা কখনো কল্যাণ বয়ে আনে না; বরং সত্যনিষ্ঠা ও অন্যায়ের প্রতিবাদই প্রকৃত মুক্তির পথ।',
    source: "তথ্যসূত্র: আল-কুরআন (সূরা আল-আ'রাফ ৭:১৬৩–১৬৬, সূরা আল-বাকারাহ ২:৬৫)",
  },
];

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    displayPrimary: '01575586681',
    displaySecondary: '@bakia8542',
    href: 'https://wa.me/8801575586681',
    type: 'whatsapp',
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    displayPrimary: 'Abdulbaki231',
    displaySecondary: 'facebook.com/Abdulbaki231',
    href: 'https://www.facebook.com/Abdulbaki231',
    type: 'facebook',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    displayPrimary: '@abdul_baki_6.5',
    displaySecondary: 'instagram.com/abdul_baki_6.5',
    href: 'https://www.instagram.com/abdul_baki_6.5',
    type: 'instagram',
  },
  {
    id: 'telegram',
    platform: 'Telegram',
    displayPrimary: '@Abdul23104',
    displaySecondary: 't.me/Abdul23104',
    href: 'https://t.me/Abdul23104',
    type: 'telegram',
  },
];
