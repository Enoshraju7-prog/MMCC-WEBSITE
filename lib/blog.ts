export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  content: BlogSection[]
}

type BlogSection = {
  type: 'p' | 'h2' | 'h3' | 'ul' | 'tip'
  text?: string
  items?: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'car-care-kakinada-summer',
    title: 'How to Protect Your Car During Kakinada\'s Hot Summer',
    description: 'Kakinada summers are harsh on paint, tyres, and AC systems. Here\'s exactly what to do before and during summer to keep your car in top condition.',
    date: '2026-06-01',
    readTime: '5 min read',
    category: 'Car Care Tips',
    content: [
      { type: 'p', text: 'Kakinada summers are brutal — temperatures cross 40°C easily, and the combination of heat, humidity, and coastal salt air can do serious damage to your car if you\'re not prepared. Here\'s what every car owner in Kakinada should do before and during summer.' },
      { type: 'h2', text: '1. Protect Your Paint with a Ceramic Coating or Wax' },
      { type: 'p', text: 'UV rays are the biggest enemy of your car\'s paint. Prolonged sun exposure causes the paint to fade, oxidise, and eventually develop tiny cracks. A ceramic coating creates a hard, UV-resistant layer on top of your paint that lasts 2–3 years. If ceramic coating isn\'t in your budget, at minimum get your car waxed before summer — it adds a sacrificial layer that absorbs UV before your paint does.' },
      { type: 'h2', text: '2. Park in Shade Whenever Possible' },
      { type: 'p', text: 'This sounds obvious, but most car owners underestimate how much heat builds up inside a parked car in full sun. Interior temperatures can reach 70°C on a 40°C day, which damages your dashboard, fades upholstery, and degrades rubber seals over time. If shade isn\'t available, use a windshield sun shade — it makes a significant difference.' },
      { type: 'h2', text: '3. Service Your Car AC Before Peak Heat' },
      { type: 'p', text: 'The worst time to discover your AC isn\'t working is mid-June in 42°C heat. Get your AC serviced in April or early May — before the rush. A proper AC service includes checking refrigerant levels, cleaning the cabin air filter, and inspecting the compressor. A weak AC in Kakinada summer is not just uncomfortable, it\'s a safety concern when driving.' },
      { type: 'tip', text: 'MM Car Care tip: If your AC takes more than 3 minutes to cool the cabin from hot to comfortable, your refrigerant is likely low. Call us at 9848377309 to book an AC check.' },
      { type: 'h2', text: '4. Check Your Tyres' },
      { type: 'p', text: 'Hot roads increase tyre pressure. If your tyres are already at the maximum recommended pressure in the morning, they could exceed safe limits by afternoon on a hot highway. Check your tyre pressure every two weeks in summer, and always check when the tyres are cold (before driving). Also inspect for cracks in the sidewalls — heat accelerates tyre ageing.' },
      { type: 'h2', text: '5. Use a Tinted Windshield (or Window Tinting)' },
      { type: 'p', text: 'UV rays don\'t just damage your paint — they damage you. If you\'re driving for more than 20 minutes in direct sun, you\'re getting a meaningful UV exposure through the windshield. Good window tinting blocks up to 99% of UV rays, reduces cabin temperature significantly, and protects your dashboard and seats.' },
      { type: 'h2', text: '6. Wash Your Car More Frequently in Summer' },
      { type: 'p', text: 'In summer, bird droppings, tree sap, and road dust stick to paint faster in the heat. Bird droppings in particular are highly acidic and etch into paint within hours in hot weather. Wash your car at least once a week in summer, and if you park outdoors, even more frequently. Always wash in the early morning or evening — never in direct sun — to prevent water spots.' },
      { type: 'h2', text: 'Summary' },
      { type: 'ul', items: [
        'Get a ceramic coating or wax before summer to protect paint',
        'Park in shade or use a sun shade',
        'Service your AC in April/May before the rush',
        'Check tyre pressure every two weeks',
        'Wash weekly, always in shade or early morning',
      ]},
      { type: 'p', text: 'MM Car Care in Kakinada offers full summer car preparation packages — AC service, exterior detailing, wax or ceramic coating, and tyre inspection. Call 9848377309 or visit us opposite APSP Petrol Bunk, Kakinada.' },
    ],
  },
  {
    slug: 'ceramic-coating-vs-wax',
    title: 'Ceramic Coating vs Regular Wax: Which Is Better for Your Car?',
    description: 'Trying to decide between ceramic coating and regular wax for your car? Here\'s a simple breakdown of the difference, cost, and which one makes sense for you.',
    date: '2026-06-03',
    readTime: '4 min read',
    category: 'Detailing',
    content: [
      { type: 'p', text: 'If you\'ve ever asked "is ceramic coating worth it?" — you\'re not alone. It\'s one of the most common questions we get at MM Car Care. Here\'s a clear, honest comparison to help you decide.' },
      { type: 'h2', text: 'What Does Each One Actually Do?' },
      { type: 'p', text: 'Both ceramic coatings and waxes protect your car\'s paint from the elements. But they work very differently.' },
      { type: 'p', text: 'Wax sits on top of your paint as a soft, thin layer. It repels water, gives your car shine, and offers some UV protection. It works well — but it wears off in 1–3 months and needs to be reapplied regularly.' },
      { type: 'p', text: 'Ceramic coating is a liquid polymer that chemically bonds to your car\'s paint. It becomes a hard, semi-permanent protective layer — much harder than wax. It\'s hydrophobic (water beads off immediately), UV resistant, and scratch resistant to light scratches and swirl marks.' },
      { type: 'h2', text: 'How Long Does Each Last?' },
      { type: 'ul', items: [
        'Wax: 1–3 months depending on weather and how often you wash',
        'Ceramic coating: 2–5 years with proper maintenance',
      ]},
      { type: 'h2', text: 'Which Is Better for Kakinada\'s Climate?' },
      { type: 'p', text: 'Kakinada has a coastal climate — high humidity, salt air from the sea, intense UV in summer, and monsoon rains. This is exactly the kind of environment where ceramic coating performs best. Salt air causes paint to oxidise faster. Ceramic coating\'s hardness and chemical resistance is far more effective than wax in these conditions.' },
      { type: 'tip', text: 'If you park outdoors in Kakinada year-round, ceramic coating will save you money over time compared to reapplying wax every few months.' },
      { type: 'h2', text: 'What About Cost?' },
      { type: 'p', text: 'Wax costs less upfront — but you\'re paying every 2–3 months. Ceramic coating has a higher one-time cost but lasts years. Over a 3-year period, ceramic coating usually works out cheaper or comparable to regular waxing, with significantly better protection.' },
      { type: 'h2', text: 'When Should You Choose Wax Instead?' },
      { type: 'ul', items: [
        'Your car is older and not in showroom condition',
        'You just need a quick polish before selling',
        'You prefer to change products frequently or experiment',
        'Budget is the primary concern right now',
      ]},
      { type: 'h2', text: 'When Should You Choose Ceramic Coating?' },
      { type: 'ul', items: [
        'Your car is new or recently paint-corrected',
        'You want 2–3 years of protection without regular reapplication',
        'You park outdoors and want maximum UV and salt protection',
        'You want the glossy, showroom look to last',
      ]},
      { type: 'p', text: 'At MM Car Care, we\'ve done ceramic coatings on hundreds of cars in Kakinada. If you\'re unsure which option is right for your car and budget, just call us at 9848377309 and we\'ll give you an honest recommendation.' },
    ],
  },
  {
    slug: 'car-ac-service-signs',
    title: '5 Signs Your Car AC Needs Servicing (Don\'t Ignore These)',
    description: 'Don\'t wait until your AC stops working in peak summer. These 5 signs tell you your car AC needs attention before it fails completely.',
    date: '2026-06-05',
    readTime: '4 min read',
    category: 'AC Service',
    content: [
      { type: 'p', text: 'In Kakinada, a working car AC isn\'t a luxury — it\'s a necessity. Temperatures regularly cross 40°C from April to June, and a failed AC on the highway can be genuinely dangerous. The good news: your AC gives warning signs well before it fails. Here\'s what to watch for.' },
      { type: 'h2', text: '1. AC Takes Too Long to Cool the Cabin' },
      { type: 'p', text: 'If your AC used to cool the car quickly but now takes 10–15 minutes to bring the temperature down, the refrigerant level is likely low. Refrigerant is what actually transfers heat out of your car. As it drops, cooling efficiency drops. This is the most common issue and the easiest to fix — just a refrigerant top-up at any good service centre.' },
      { type: 'h2', text: '2. Weak Airflow Even on Maximum Fan Speed' },
      { type: 'p', text: 'If the air coming from your vents feels weak even at max fan, the cabin air filter is likely clogged. The cabin air filter catches dust, pollen, and pollutants before they enter the cabin. In Kakinada\'s dusty conditions, these filters clog faster than in cleaner environments. A clogged filter reduces airflow and can strain the blower motor. Replacing it is inexpensive.' },
      { type: 'tip', text: 'Cabin air filters should typically be replaced every 15,000–20,000 km. In Kakinada\'s dust, every 10,000 km is more realistic.' },
      { type: 'h2', text: '3. Bad Smell When AC Is On' },
      { type: 'p', text: 'A musty or mouldy smell when you turn on the AC means bacteria and mould have built up inside the evaporator. This is common in humid coastal areas like Kakinada. It\'s not just unpleasant — you\'re breathing in those bacteria every time you use the AC. An AC antibacterial treatment clears this out completely.' },
      { type: 'h2', text: '4. Water Dripping Inside the Car' },
      { type: 'p', text: 'A little condensation outside the car (under the dashboard, dripping onto the road) is normal. But if water is dripping inside the car — onto the passenger floor mat, for example — the drainage tube is blocked. Water is building up on the evaporator and overflowing inward instead of draining out. Left unchecked, this causes mould under the carpet and electrical issues.' },
      { type: 'h2', text: '5. Clicking or Grinding Noise When AC Is On' },
      { type: 'p', text: 'Any unusual noise when you turn on the AC — clicking, grinding, or a high-pitched squeal — usually means the compressor or compressor clutch is struggling. This is more serious. Continuing to run the AC with a failing compressor can cause complete compressor failure, which is an expensive repair. Get it checked immediately.' },
      { type: 'h2', text: 'When to Get Your AC Serviced' },
      { type: 'p', text: 'Ideally, service your car AC once a year — and in Kakinada, the best time is March or early April, before summer hits and every service centre gets busy. A basic AC service includes refrigerant check, cabin filter replacement, evaporator cleaning, and a full system inspection.' },
      { type: 'p', text: 'MM Car Care handles full car AC service in Kakinada. Call 9848377309 to book, or visit us opposite APSP Petrol Bunk.' },
    ],
  },
  {
    slug: 'how-often-car-wash-kakinada',
    title: 'How Often Should You Wash Your Car in Kakinada?',
    description: 'Kakinada\'s coastal climate, dust, and monsoon rains mean your car needs more frequent washing than you might think. Here\'s the right schedule.',
    date: '2026-06-07',
    readTime: '3 min read',
    category: 'Car Wash',
    content: [
      { type: 'p', text: 'There\'s no single right answer for everyone, but Kakinada\'s environment — coastal salt air, summer dust, monsoon mud, and strong UV — means most car owners should be washing more often than they do. Here\'s a practical guide.' },
      { type: 'h2', text: 'The General Rule: Once a Week' },
      { type: 'p', text: 'For most car owners in Kakinada who park outdoors, a weekly wash is the right cadence. Weekly washing removes the layer of dust, salt, and pollutants that accumulate on your car before they have a chance to embed in the paint or cause corrosion. If you park in a garage and drive short distances, you can stretch to once every two weeks.' },
      { type: 'h2', text: 'Wash More Often During These Times' },
      { type: 'ul', items: [
        'Summer (April–June): Wash 2x per week if parked outdoors. Bird droppings and sap etch into paint within hours in the heat.',
        'After monsoon rains: Rainwater in Kakinada carries road dirt and pollutants. Don\'t let it dry on your car — wash within 24 hours.',
        'Near the coast: Salt air accelerates corrosion. If you live or park near the sea, wash weekly without exception.',
        'After long highway drives: Road tar and insects stick to bumpers and bonnets. Wash within a day or two.',
      ]},
      { type: 'h2', text: 'How to Wash Without Damaging Your Paint' },
      { type: 'p', text: 'Washing your car the wrong way can cause micro-scratches and swirl marks that dull your paint over time. Here are the basics.' },
      { type: 'ul', items: [
        'Never wash in direct sunlight — water and soap dry too fast and leave marks',
        'Use a dedicated car shampoo, not dish soap — dish soap strips wax',
        'Use the two-bucket method: one with soapy water, one with clean rinse water',
        'Use a microfibre wash mitt, not a sponge or household cloth',
        'Dry with a clean microfibre towel — air drying causes water spots',
      ]},
      { type: 'tip', text: 'The most common cause of swirl marks on Indian cars isn\'t road damage — it\'s improper washing technique with rough cloths. Switch to a microfibre mitt and the difference is visible.' },
      { type: 'h2', text: 'What About a Professional Wash?' },
      { type: 'p', text: 'A home wash keeps your car clean between visits. But every 1–2 months, a professional exterior wash at a proper car care centre includes clay bar decontamination, proper drying, and tyre and trim dressing — things that a home wash won\'t do. Combined with periodic waxing or ceramic coating maintenance, this is what keeps your car looking new for years.' },
      { type: 'p', text: 'MM Car Care offers professional exterior washes and full detailing packages in Kakinada. Walk in or call 9848377309 to book a time.' },
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}
