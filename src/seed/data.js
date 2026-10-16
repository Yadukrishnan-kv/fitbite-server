/**
 * Seed content mirrored from the original static site (src/data/*.js and the
 * hardcoded component content). Editing the live site should be done through
 * the admin panel; this file only defines the initial state.
 */

export const siteSettings = [
  { key: 'siteTitle', value: 'Fitbite — Chef Crafted Nutrition. Delivered Daily.', type: 'text', label: 'Site Title', group: 'general', sortOrder: 1 },
  { key: 'tagline', value: 'Chef-crafted nutrition delivered daily. Fuel your performance, support your wellness, simplify your life.', type: 'textarea', label: 'Footer Tagline', group: 'general', sortOrder: 2 },
  { key: 'logo', value: '/logo.png', type: 'image', label: 'Logo', group: 'branding', sortOrder: 3 },
  { key: 'phoneDisplay', value: '+91 80898 39740', type: 'phone', label: 'Phone (display)', group: 'contact', sortOrder: 4 },
  { key: 'phoneRaw', value: '918089839740', type: 'text', label: 'Phone (dial/whatsapp number, no symbols)', group: 'contact', sortOrder: 5 },
  { key: 'email', value: 'hello@fitbite.in', type: 'email', label: 'Email', group: 'contact', sortOrder: 6 },
  { key: 'locationFull', value: 'Kozhikode, Kerala, India', type: 'text', label: 'Location (full)', group: 'contact', sortOrder: 7 },
  { key: 'locationShort', value: 'Kozhikode, Kerala', type: 'text', label: 'Location (short)', group: 'contact', sortOrder: 8 },
  { key: 'metaDescription', value: 'Fitbite delivers chef-crafted, nutritionist-approved healthy meals daily in Kozhikode, Kerala. High-protein power bowls and salads to fuel your performance.', type: 'textarea', label: 'Default Meta Description', group: 'seo', sortOrder: 9 },
  { key: 'metaKeywords', value: 'healthy meals, meal delivery, high protein, Kozhikode, Kerala, salads, power bowls, fitness food', type: 'text', label: 'Default Meta Keywords', group: 'seo', sortOrder: 10 },
];

export const socialLinks = [
  { platform: 'instagram', url: 'https://www.instagram.com/fit_bite1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', icon: 'instagram', sortOrder: 1, isEnabled: true },
  { platform: 'whatsapp', url: 'https://wa.me/918089839740', icon: 'whatsapp', sortOrder: 2, isEnabled: true },
];

// Header navigation (mirrors Navbar.jsx `links`).
export const headerMenuItems = [
  { label: 'Menu', url: '/dishes', linkType: 'internal', target: '_self', sortOrder: 1 },
  { label: 'Why Us', url: '#why', linkType: 'anchor', target: '_self', sortOrder: 2 },
  { label: 'Process', url: '#process', linkType: 'anchor', target: '_self', sortOrder: 3 },
  { label: 'Reviews', url: '#testimonials', linkType: 'anchor', target: '_self', sortOrder: 4 },
  { label: 'FAQ', url: '#faq', linkType: 'anchor', target: '_self', sortOrder: 5 },
  { label: 'Contact', url: '#contact', linkType: 'anchor', target: '_self', sortOrder: 6 },
];

// Footer link columns (mirrors Footer.jsx `footerLinks`). Parent items are
// column headings; children are the links under them.
export const footerMenuTree = [
  {
    label: 'Company',
    url: '#',
    linkType: 'anchor',
    sortOrder: 1,
    children: [
      { label: 'About Us', url: '#about', linkType: 'anchor', sortOrder: 1 },
      { label: 'Our Menu', url: '#menu', linkType: 'anchor', sortOrder: 2 },
    ],
  },
  {
    label: 'Support',
    url: '#',
    linkType: 'anchor',
    sortOrder: 2,
    children: [
      { label: 'FAQ', url: '#faq', linkType: 'anchor', sortOrder: 1 },
      { label: 'Contact', url: '#contact', linkType: 'anchor', sortOrder: 2 },
    ],
  },
];

export const sections = [
  {
    key: 'hero',
    name: 'Hero',
    tag: '',
    title: 'Chef Crafted Nutrition. Delivered Daily.',
    subtitle: 'Healthy meals designed to fuel performance, support wellness, and simplify your lifestyle.',
    sortOrder: 1,
    isVisible: true,
    content: {
      badge: '100% Fresh Ingredients',
      headingLine1: 'Chef Crafted Nutrition.',
      headingEm: 'Delivered Daily.',
      primaryBtn: { label: 'View Menu', href: '#menu' },
      secondaryBtn: { label: 'Get Started', href: '#contact' },
      stats: [
        { num: '5K+', label: 'Meals Delivered' },
        { num: '1K+', label: 'Happy Clients' },
        { num: '100%', label: 'Fresh Ingredients' },
      ],
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=85',
      floatCards: [
        { label: "Today's Special", val: '₹490', sub: 'Harmony Bowl' },
        { label: 'Avg. Protein', val: '35g', sub: 'Per meal' },
      ],
    },
  },
  {
    key: 'trustbar',
    name: 'Trust Bar',
    sortOrder: 2,
    isVisible: true,
    content: {
      items: [
        { icon: '🥬', title: 'Fresh Ingredients', desc: 'Sourced fresh every morning' },
        { icon: '🏆', title: 'Nutrition Approved', desc: 'Certified dietitian-designed' },
        { icon: '🚀', title: 'Daily Delivery', desc: 'Fresh to your door daily' },
        { icon: '💪', title: 'High Protein', desc: '30+ grams per serving' },
      ],
    },
  },
  {
    key: 'about',
    name: 'About / Our Story',
    tag: 'Our Story',
    title: 'We Believe Eating Healthy Should Be Effortless',
    subtitle:
      "Fitbite was born from a simple idea: healthy eating shouldn't require hours of meal prep or sacrificing taste. We bring chef-crafted, nutritionist-approved meals directly to your doorstep.",
    sortOrder: 3,
    isVisible: true,
    content: {
      titleEm: 'Eating Healthy',
      paragraph2:
        'Every bowl we craft tells a story of carefully selected ingredients, balanced macros, and flavors that make clean eating something to look forward to.',
      counters: [
        { num: '5K+', label: 'Meals Delivered' },
        { num: '1K+', label: 'Happy Customers' },
        { num: '15+', label: 'Menu Items' },
        { num: '100%', label: 'Clean Ingredients' },
      ],
      image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=85',
      ratingBadge: { num: '⭐ 4.9', label: 'Customer Rating' },
    },
  },
  {
    key: 'whyChoose',
    name: 'Why Choose Fitbite',
    tag: 'Why Fitbite',
    title: "Everything You Need, Nothing You Don't",
    sortOrder: 4,
    isVisible: true,
    content: {
      titleLine1: 'Everything You Need,',
      titleEm: "Nothing You Don't",
      reasons: [
        { icon: '🧑‍🍳', title: 'Fresh Daily Preparation', desc: 'Every bowl is made fresh each morning. No pre-made, no frozen — just pure, same-day freshness in every bite.' },
        { icon: '🥗', title: 'Expert Nutrition Planning', desc: 'Macro-balanced meals crafted with certified nutrition expertise. Every dish hits your protein, carb, and fat targets.' },
        { icon: '🚀', title: 'Doorstep Delivery', desc: 'We deliver directly to you — fresh, packaged perfectly, arriving on time every single time.' },
        { icon: '📋', title: 'Custom Meal Plans', desc: 'Weight loss, muscle gain, maintenance — we build a plan around your specific goals and dietary needs.' },
        { icon: '💰', title: 'Affordable Packages', desc: "Premium quality that doesn't break the bank. Starting from just ₹149 per meal — cheaper than eating out unhealthy." },
        { icon: '✅', title: 'Quality Ingredients', desc: 'We source only the finest, cleanest ingredients — no preservatives, no hidden nasties, just honest whole food.' },
      ],
    },
  },
  {
    key: 'process',
    name: 'Process / How It Works',
    tag: 'How It Works',
    title: 'Your Journey to Eating Better',
    subtitle: 'Four simple steps stand between you and the healthiest meals of your life.',
    sortOrder: 5,
    isVisible: true,
    content: {
      titleEm: 'Eating Better',
      steps: [
        { num: '1', title: 'Choose Your Plan', desc: 'Select from our weight loss, high protein, or custom plan options based on your goals.' },
        { num: '2', title: 'Select Meals', desc: 'Pick from our chef-curated menu of 15+ power bowls and salads tailored to your needs.' },
        { num: '3', title: 'We Prepare Fresh', desc: 'Our chefs freshly prepare every meal the same morning using only clean, whole ingredients.' },
        { num: '4', title: 'Delivered Fresh', desc: 'Your meals arrive at your door — hot, fresh and ready to power your day.' },
      ],
    },
  },
  {
    key: 'behind',
    name: 'Behind Fitbite / Philosophy',
    tag: 'Our Philosophy',
    sortOrder: 6,
    isVisible: true,
    content: {
      quote: 'Food is not just fuel — it’s medicine, performance, and joy all in one bowl.',
      quoteEm: 'medicine, performance, and joy',
      paragraphs: [
        'At Fitbite, we started with one belief: healthy food should taste exceptional. We got tired of bland diet meals and cardboard protein bars. So we built something different — a meal service where every bite delivers both nutrition and satisfaction.',
        'We work with local suppliers, use zero artificial additives, and design every menu item around real nutritional science. This isn’t just a food business — it’s a lifestyle mission.',
      ],
      signature: 'Fitbite Team',
      role: 'Founders & Nutrition Team — Kozhikode, Kerala',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    },
  },
  {
    key: 'cta',
    name: 'Call To Action',
    tag: 'Get Started Today',
    title: 'Ready To Transform Your Eating Habits?',
    subtitle:
      'Join 1,000+ people already eating smarter with Fitbite. Your first step toward a healthier you starts now.',
    sortOrder: 7,
    isVisible: true,
    content: {
      titleEm: 'Transform',
      stats: [
        { num: '1,000+', label: 'Happy Customers' },
        { num: '15+', label: 'Power Bowls' },
        { num: 'Daily', label: 'Fresh Delivery' },
      ],
      primaryBtn: { label: 'Get Started Today', href: '#contact' },
      secondaryBtn: { label: 'Call Us Now', href: 'tel:8089839740' },
    },
  },
  {
    key: 'contact',
    name: 'Contact',
    tag: 'Contact Us',
    title: "Let's Get You Started",
    subtitle: 'Have questions or ready to order? Reach out and our team will get back to you within minutes.',
    sortOrder: 8,
    isVisible: true,
    content: {
      titleEm: 'Started',
      whatsappHeading: 'Chat With Us on WhatsApp',
      whatsappText: 'Tap the button below to start a conversation. We typically respond within minutes.',
      whatsappBtnLabel: 'Message Us on WhatsApp',
    },
  },
];

export const salads = [
  { name: 'Pro-Fuel Creamy Chicken Salad', desc: 'Tender chicken breast, fresh garden greens, cucumber, cherry tomatoes, and crunchy seeds dressed in our signature light, creamy garlic yogurt dressing.', price: 200, type: 'salad', categories: ['high-protein'], calories: 410, protein: '38g', carbs: '12g', rating: 4.9, reviews: 145, image: '/images/dishes/pro-fuel-creamy-chicken.jpeg', sortOrder: 1 },
  { name: 'Thai Peanut Chicken Crunch Salad', desc: 'A crisp blend of shredded red & green cabbage, carrots, bell peppers, and grilled chicken, topped with roasted peanuts and a rich, creamy Thai peanut dressing.', price: 180, type: 'salad', categories: ['high-protein'], calories: 430, protein: '34g', carbs: '20g', rating: 4.8, reviews: 112, image: '/images/dishes/thai-peanut-crunch.jpeg', sortOrder: 2 },
  { name: 'Premium Chicken & Paneer Fusion Bowl', desc: 'The ultimate double-protein feast! Succulent grilled chicken breast and golden paneer cubes served with steamed broccoli, cherry tomatoes, and zesty herbs.', price: 220, type: 'salad', categories: ['high-protein'], calories: 540, protein: '46g', carbs: '15g', rating: 4.9, reviews: 167, image: '/images/dishes/premium-chicken-paneer.jpeg', sortOrder: 3 },
  { name: 'Tzatziki Chicken Salad', desc: 'Refreshing Mediterranean bowl featuring grilled chicken, sliced cucumbers, black olives, cherry tomatoes, and red onions with a creamy garlic Tzatziki Greek yogurt sauce.', price: 180, type: 'salad', categories: ['weight-loss'], calories: 350, protein: '32g', carbs: '10g', rating: 4.7, reviews: 86, image: '/images/dishes/tzatziki-chicken.jpeg', sortOrder: 4 },
  { name: 'Grilled Chicken & Sweet Potato Harmony Bowl', desc: 'A nourishing balance of roasted sweet potato cubes, tender grilled chicken, steamed broccoli, and baby spinach, finished with a citrus dressing.', price: 190, type: 'salad', categories: ['high-protein'], calories: 470, protein: '36g', carbs: '38g', rating: 4.9, reviews: 189, image: '/images/dishes/grilled-chicken-sweet-potato.jpeg', sortOrder: 5 },
  { name: 'Chicken Quinoa Power Salad', desc: 'A superfood blend of fluffy organic quinoa, grilled chicken strips, broccoli florets, and red cabbage, tossed with a zesty lemon-herb vinaigrette.', price: 210, type: 'salad', categories: ['high-protein'], calories: 420, protein: '35g', carbs: '28g', rating: 4.8, reviews: 134, image: '/images/dishes/chicken-quinoa-power.jpeg', sortOrder: 6 },
  { name: 'Smash Potato Greek Salad', desc: 'Deliciously seasoned smashed baby potatoes served over a bed of fresh greens, red onions, cucumbers, olives, and cherry tomatoes, drizzled with a light vinaigrette.', price: 170, type: 'salad', categories: ['veg', 'weight-loss'], calories: 310, protein: '10g', carbs: '34g', rating: 4.8, reviews: 64, image: 'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=800&auto=format&fit=crop&q=80', sortOrder: 7 },
  { name: 'Golden Nut Paneer Bowl', desc: 'Golden-grilled paneer cubes, sweet corn, peanuts, bell peppers, and fresh greens, served with a zesty and crunch-filled dressing.', price: 170, type: 'salad', categories: ['veg', 'high-protein'], calories: 390, protein: '22g', carbs: '36g', rating: 4.7, reviews: 84, image: '/images/dishes/golden-nut-paneer.jpeg', sortOrder: 8 },
  { name: 'Masala Egg Scramble Garden Bowl', desc: 'Spiced, fluffy scrambled eggs cooked with aromatic herbs and paired with roasted potato chunks, steamed broccoli, and fresh garden vegetables.', price: 149, type: 'salad', categories: ['veg', 'weight-loss'], calories: 330, protein: '24g', carbs: '26g', rating: 4.6, reviews: 73, image: '/images/dishes/masala-egg-scramble.jpeg', sortOrder: 9 },
  { name: 'Signature Egg & Paneer Medley', desc: 'A power-packed fusion of soft paneer cubes and hard-boiled eggs, tossed with seasonal greens, bell peppers, and a savory herb dressing.', price: 175, type: 'salad', categories: ['veg', 'high-protein'], calories: 450, protein: '32g', carbs: '14g', rating: 4.8, reviews: 105, image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=80', sortOrder: 10 },
];

export const lunches = [
  { name: 'Kerala Style Fish Curry Meal', desc: 'Steamed red rice served with tangy Kerala-style fish curry, mixed vegetable thoran, and a papadum on the side.', price: 220, type: 'lunch', categories: ['non-veg', 'high-protein'], calories: 620, protein: '32g', carbs: '70g', rating: 4.8, reviews: 58, image: 'https://images.unsplash.com/photo-1626777553635-be544d1eb0e7?w=800&auto=format&fit=crop&q=80', sortOrder: 1 },
  { name: 'Grilled Chicken Rice Bowl', desc: 'Grilled chicken breast over steamed rice with sautéed vegetables and a light garlic sauce — a balanced midday meal.', price: 210, type: 'lunch', categories: ['non-veg', 'high-protein'], calories: 580, protein: '40g', carbs: '55g', rating: 4.7, reviews: 47, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80', sortOrder: 2 },
  { name: 'Veg Thali Combo', desc: 'A wholesome plate of dal, two seasonal vegetable curries, rice, chapati, salad and pickle.', price: 180, type: 'lunch', categories: ['veg'], calories: 540, protein: '18g', carbs: '80g', rating: 4.6, reviews: 39, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80', sortOrder: 3 },
  { name: 'Paneer Butter Masala Lunch Box', desc: 'Creamy paneer butter masala with jeera rice, chapati and a side salad — a comforting vegetarian classic.', price: 190, type: 'lunch', categories: ['veg', 'high-protein'], calories: 610, protein: '22g', carbs: '65g', rating: 4.7, reviews: 44, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80', sortOrder: 4 },
];

export const wraps = [
  { name: 'Peri-Peri Chicken Wrap', desc: 'Spicy peri-peri grilled chicken, crisp lettuce, and a creamy mint sauce rolled in a soft whole-wheat tortilla.', price: 150, type: 'wrap', categories: ['non-veg', 'high-protein'], calories: 420, protein: '28g', carbs: '38g', rating: 4.8, reviews: 61, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80', sortOrder: 1 },
  { name: 'Paneer Tikka Wrap', desc: 'Char-grilled paneer tikka with onions, peppers and mint chutney, rolled in a soft tortilla.', price: 140, type: 'wrap', categories: ['veg', 'high-protein'], calories: 390, protein: '20g', carbs: '36g', rating: 4.7, reviews: 52, image: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=800&auto=format&fit=crop&q=80', sortOrder: 2 },
  { name: 'Falafel & Hummus Wrap', desc: 'Crispy falafel, fresh salad and creamy hummus wrapped up with a tangy tahini drizzle.', price: 145, type: 'wrap', categories: ['veg', 'weight-loss'], calories: 360, protein: '14g', carbs: '42g', rating: 4.6, reviews: 33, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop&q=80', sortOrder: 3 },
];

export const testimonials = [
  { name: 'Vishnu Tv', tag: 'Regular Customer', text: 'The food is incredibly fresh and high quality. The Pro-Fuel Creamy Chicken Salad has become my daily lunch. Delivery is always right on time!', initials: 'VT', sortOrder: 1 },
  { name: 'Yadu', tag: 'Regular Customer', text: "Fitbite's service is top-notch. They make eating healthy so easy and delicious. The Premium Chicken & Paneer Fusion Bowl is my absolute favorite.", initials: 'YA', sortOrder: 2 },
  { name: 'Gouri Nanda', tag: 'Regular Customer', text: 'Healthy food is usually boring, but Fitbite completely changed that. Their salads are extremely flavorful and the portions are perfect for my goals.', initials: 'GN', sortOrder: 3 },
  { name: 'Fasil', tag: 'Regular Customer', text: 'I love the variety on their menu. The Thai Peanut Crunchy Chicken Salad has the perfect crunch and dressing. Highly recommend their daily meal plans!', initials: 'FA', sortOrder: 4 },
  { name: 'Abhijith gk', tag: 'Regular Customer', text: 'Exactly what I need after a heavy workout. The macro distribution is perfect, the service is prompt, and the food tastes clean and home-cooked.', initials: 'AG', sortOrder: 5 },
  { name: 'Oxygen Fitness Studio', tag: 'Gym Partner', text: 'We recommend Fitbite to all our members. Their high-protein salads and clean eating options are perfect for anyone serious about their fitness results.', initials: 'OF', sortOrder: 6 },
];

export const faqs = [
  { question: 'How often do you deliver?', answer: 'We deliver fresh meals daily. You can place orders on a daily basis or subscribe to weekly/monthly plans for better convenience and discounts. Delivery times can be customized to your schedule.', sortOrder: 1 },
  { question: 'Are meals customizable?', answer: "Absolutely! We offer customization based on dietary restrictions, allergies, and personal preferences. Just let us know your requirements when placing your order and we'll tailor your meal accordingly.", sortOrder: 2 },
  { question: 'Do you offer weight loss plans?', answer: 'Yes! Our weight loss meal plans are designed by certified nutrition experts with calorie-controlled, macro-balanced meals. We offer 1-week, 2-week, and monthly weight loss packages with customizable calorie targets.', sortOrder: 3 },
  { question: 'How fresh are the meals?', answer: 'Every meal is prepared fresh the same morning of delivery. We source ingredients daily from local suppliers and use zero preservatives or artificial additives. Our meals are best consumed within 4-6 hours of delivery.', sortOrder: 4 },
  { question: 'Can I cancel anytime?', answer: 'Yes, you can pause or cancel your subscription at any time with no questions asked. We believe in complete flexibility. Just contact us 24 hours before your next delivery to make any changes.', sortOrder: 5 },
  { question: 'Do you provide nutrition information?', answer: "Every meal comes with complete nutritional information including calories, protein, carbohydrates, fats, and fiber content. We're fully transparent about what goes into every bowl we serve.", sortOrder: 6 },
];

// System pages that map to existing routes. Body content is minimal because
// these routes are composed of section blocks, but the SEO fields are managed here.
export const pages = [
  {
    title: 'Home',
    slug: 'home',
    heading: 'Chef Crafted Nutrition. Delivered Daily.',
    bodyHtml: '',
    seoTitle: 'Fitbite — Chef Crafted Nutrition. Delivered Daily.',
    metaDescription: 'Fitbite delivers chef-crafted, nutritionist-approved healthy meals daily in Kozhikode, Kerala. High-protein power bowls and salads to fuel your performance.',
    metaKeywords: 'healthy meals, meal delivery, high protein, Kozhikode, Kerala',
    status: 'published',
    isSystem: true,
    sortOrder: 1,
  },
  {
    title: 'Our Menu',
    slug: 'dishes',
    heading: 'Chef-Crafted Power Bowls',
    bodyHtml: '',
    seoTitle: 'Our Menu — Fitbite Power Bowls & Salads',
    metaDescription: 'Explore Fitbite’s full menu of chef-crafted power bowls and salads. High-protein, veg, and weight-loss options delivered fresh daily.',
    metaKeywords: 'fitbite menu, power bowls, salads, high protein meals',
    status: 'published',
    isSystem: true,
    sortOrder: 2,
  },
];
