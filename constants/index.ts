import { MenuItem, Testimonial, WhyLoveUsCard, TeamMember } from '../types';

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'About Us', href: '/about' },
  { label: 'Delivery', href: '/menu#delivery' },
  { label: 'Contact Us', href: '/contact' },
];

export const BRAND_COLORS = {
  primary: '#ED2C02',
  background: '#FFEFED',
  darkBrown: '#2A0300',
  buttonShadow: '#FF8787',
  footer: '#2A0300',
};

export const WHY_LOVE_US_DATA: WhyLoveUsCard[] = [
  {
    id: 'grilled-daily',
    title: 'Freshly Grilled Daily',
    description: 'We source only premium, fresh seafood and BBQ cuts, grilling them to perfection every single day with no overnight leftovers.',
    icon: '🔥',
    image: '/images/rs=w_365,h_365,cg_true.webp',
  },
  {
    id: 'doorstep-delivery',
    title: 'Fast Doorstep Delivery',
    description: 'Craving the sizzle? Our specialized delivery network ensures your orders arrive hot, fresh, and ready to feast.',
    icon: '🛵',
    image: '/images/Rectangle 24.png',
  },
  {
    id: 'exceptional-taste',
    title: 'Exceptional Taste',
    description: 'Our secret blend of local spices and house marinades gives every bite a unique, unforgettable Tylicious flavor.',
    icon: '👑',
    image: '/images/rs=w_1160,h_1150.webp',
  },
];

export const FAVORITES_DATA: MenuItem[] = [
  {
    id: 'grilled-fish',
    name: 'Grilled Fish',
    description: 'Fresh whole fish grilled to perfection with Tylicious signature blend of spices, served with golden fries or spicy plantains.',
    price: 50,
    image: '/images/rs=w_1160,h_1218.webp',
    category: 'fish',
    popular: true,
  },
  {
    id: 'grilled-tilapia',
    name: 'Grilled Tilapia Fish',
    description: 'Premium fresh Tilapia, slow grilled over open charcoal, infused with garlic, ginger, and local herbs.',
    price: 55,
    image: '/images/rs=w_1160,h_1257.webp',
    category: 'fish',
    popular: true,
  },
  {
    id: 'grilled-croaker',
    name: 'Grilled Croaker Fish',
    description: 'Fleshy croaker fish marinated in chili peppers, lemon, and aromatic spices, grilled on live coals for that smoky finish.',
    price: 65,
    image: '/images/rs=w_1160,h_1532.webp',
    category: 'fish',
    popular: true,
  },
];

export const FULL_MENU_DATA: MenuItem[] = [
  ...FAVORITES_DATA,
  {
    id: 'seafood-platter',
    name: 'Tylicious Seafood Platter',
    description: 'A grand feast of grilled jumbo prawns, calamari, lobster tails, and croaker fish, served with spicy dip and corn.',
    price: 150,
    image: '/images/Gemini_Generated_Image_cibfydcibfydcibf.png',
    category: 'specials',
    popular: true,
  },
  {
    id: 'bbq-pork-ribs',
    name: 'Smoked BBQ Pork Ribs',
    description: 'Tender baby back ribs slow-cooked for 6 hours, glazed with our rich sticky house honey-BBQ sauce.',
    price: 85,
    image: '/images/rs=w_1160,h_1536.webp',
    category: 'bbq',
    popular: true,
  },
  {
    id: 'grilled-chicken-skewers',
    name: 'Spicy Chicken Skewers',
    description: 'Juicy chunks of chicken breast marinated in Suya spice, grilled with fresh bell peppers and onions.',
    price: 35,
    image: '/images/Frame 153.png',
    category: 'bbq',
    spicy: true,
  },
  {
    id: 'sweet-potato-fries',
    name: 'Crispy Sweet Potato Fries',
    description: 'Golden-fried sweet potato sticks tossed in sea salt and a touch of cinnamon.',
    price: 15,
    image: '/images/Rectangle 24.png',
    category: 'sides',
  },
  {
    id: 'grilled-corn',
    name: 'Charcoal Grilled Sweetcorn',
    description: 'Fresh corn on the cob brushed with spicy butter and grilled to a light char.',
    price: 10,
    image: '/images/rs=w_365,h_365,cg_true.webp',
    category: 'sides',
  },
  {
    id: 'signature-chapman',
    name: 'Tylicious Chapman Cocktail',
    description: 'Our refreshing signature punch blend of bitters, citrus juice, soda, and fresh cucumber garnish.',
    price: 12,
    image: '/images/rs=w_1160,h_1150.webp',
    category: 'drinks',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Sandra Nwosu',
    rating: 5,
    comment: 'The grilled fish was absolutely amazing. Delivery was quick too.',
    role: 'Loyal Customer',
  },
  {
    id: '2',
    name: 'David Adeleke',
    rating: 5,
    comment: "Best grill spot I've tried in a long time.",
    role: 'Food Enthusiast',
  },
  {
    id: '3',
    name: 'Amina Bello',
    rating: 5,
    comment: 'Food arrived hot and tasted incredible.',
    role: 'Regular Patron',
  },
];

export const GALLERY_DATA = [
  { src: '/images/rs=w_1160,h_1536.webp', alt: 'Smoked BBQ Ribs' },
  { src: '/images/rs=w_1160,h_1773.webp', alt: 'Fresh Tilapia preparation' },
  { src: '/images/Frame 153.png', alt: 'Charcoal grill station' },
  { src: '/images/rs=w_1160,h_1150.webp', alt: 'Tylicious grilled fish dish' },
  { src: '/images/rs=w_1160,h_1218.webp', alt: 'Whole Croaker grilling' },
  { src: '/images/rs=w_1160,h_1257.webp', alt: 'Seafood and BBQ spread' },
];

export const TEAM_DATA: TeamMember[] = [
  {
    id: '1',
    name: 'Chef Tunde',
    role: 'Founder & Head Grill Master',
    image: '/images/rs=w_1160,h_1536.webp',
  },
  {
    id: '2',
    name: 'Chef Grace',
    role: 'Seafood Specialist',
    image: '/images/rs=w_1160,h_1773.webp',
  },
  {
    id: '3',
    name: 'Miracle John',
    role: 'Operations Lead',
    image: '/images/Frame 153.png',
  },
];
