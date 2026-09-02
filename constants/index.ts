import { MenuItem, Testimonial, WhyLoveUsCard, TeamMember } from '../types';

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Catering', href: '/catering' },
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

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/Tyliciousgrillz',
  tiktok: 'https://www.tiktok.com/@tyliciousgrillz?is_from_webapp=1&sender_device=pc',
  instagram: 'https://www.instagram.com/tyliciousgrillz?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==',
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

export const FULL_MENU_DATA: MenuItem[] = [
  // 1. Grilled Fish
  {
    id: 'grilled-catfish',
    name: 'Grilled Catfish',
    description: 'Grilled Catfish seasoned with Tylicious signature spices, served with Fried Plantain & Chips.',
    price: 25,
    image: '/images/catfish_pfp.png',
    category: 'grilled-fish',
    popular: true,
    video: '/vids/catfish.mp4',
  },
  {
    id: 'grilled-tilapia',
    name: 'Grilled Tilapia Fish',
    description: 'Grilled Tilapia infused with garlic, ginger, and local herbs, served with Fried Plantain & Chips.',
    price: 25,
    image: '/images/tilapia_pfp.png',
    category: 'grilled-fish',
    popular: true,
    video: '/vids/grilled_tilapia.mp4',
  },
  {
    id: 'grilled-croaker',
    name: 'Grilled Croaker Fish',
    description: 'Grilled Croaker fish marinated in chili peppers, lemon, and aromatic spices, served with Fried Plantain & Chips.',
    price: 25,
    image: '/images/rs=w_1160,h_1218.webp',
    category: 'grilled-fish',
    popular: true,
    video: '/vids/grilled_croaker.mp4',
  },

  // 2. Chicken & Turkey
  {
    id: 'chicken-bbq',
    name: 'Chicken BBQ',
    description: 'Succulent Chicken BBQ including chicken legs glazed in rich sticky sauce, served with Fried Plantain & Chips.',
    price: 15,
    image: '/images/Frame 153.png',
    category: 'chicken-turkey',
    popular: true,
    video: '/vids/bbq_chicken.mp4',
  },
  {
    id: 'chicken-thigh',
    name: 'Chicken Thigh',
    description: 'Tender chicken thighs marinated in aromatic African herbs and flame-grilled, served with Fried Plantain & Chips.',
    price: 15,
    image: '/images/Frame 153.png',
    category: 'chicken-turkey',
    video: '/vids/chicken_wings.mp4',
  },
  {
    id: 'wings-stop',
    name: 'Grilled Chicken Wings (Wings-stop)',
    description: 'Grilled Chicken Wings seasoned with Tylicious special pepper blend, served with Fried Plantain & Chips.',
    price: 15,
    image: '/images/wings_pfp.png',
    category: 'chicken-turkey',
    spicy: true,
    video: '/vids/chicken_wings_2.mp4',
  },
  {
    id: 'grilled-turkey',
    name: 'Grilled Virgin Turkey',
    description: 'Sizzling tender turkey char-grilled with our house spices, served with Fried Plantain & Chips.',
    price: 20,
    image: '/vids/turkey_thumbnail.jpg',
    category: 'chicken-turkey',
    video: '/vids/turkey_vid.mp4',
  },

  // 3. Lamb & Beef
  {
    id: 'grilled-lamb-chops',
    name: 'Grilled Lamb Chops',
    description: 'Grilled Lamb Chops and ribs slow-cooked and glazed with sticky house BBQ sauce, served with Fried Plantain & Chips.',
    price: 25,
    image: '/images/lamb_pfp.png',
    category: 'lamb-beef',
    popular: true,
    video: '/vids/lamb_chops_ribs.mp4',
  },
  {
    id: 'mixed-grill',
    name: 'Mixed Grill',
    description: 'Turkey, Lamb Chops & Lamb Ribs char-grilled and served with Fried Plantain & Chips.',
    price: 35,
    image: '/images/lamb&beef.webp',
    category: 'lamb-beef',
    popular: true,
    video: '/vids/mixed_grill.mp4',
  },
  {
    id: 'suya',
    name: 'Sizzling Suya',
    description: 'Suya with fresh Tomatoes & Onions, seasoned with authentic Suya pepper, served with Fried Plantain & Chips.',
    price: 15,
    image: '/images/suya_pfp.jpg',
    category: 'lamb-beef',
    popular: true,
    spicy: true,
    video: '/vids/suya_vid.mp4',
  },

  // 4. Seafood
  {
    id: 'grilled-prawns',
    name: 'Grilled Prawns (Jumbo Prawn)',
    description: 'Grilled Prawns skewered over charcoal and brushed with garlic chili butter, served with Fried Plantain & Chips.',
    price: 15,
    image: '/images/Gemini_Generated_Image_cibfydcibfydcibf.png',
    category: 'seafood',
    video: '/vids/Tylicious Seafood Platter.mp4',
  },
];

export const FAVORITES_DATA: MenuItem[] = [
  FULL_MENU_DATA[0], // Grilled Catfish - £25
  FULL_MENU_DATA[1], // Grilled Tilapia Fish - £25
  FULL_MENU_DATA[7], // Grilled Lamb Chops - £25
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'George Thomas',
    rating: 5,
    comment: 'The grilled fish was absolutely amazing. Delivery was quick too.',
    role: 'Loyal Customer',
  },
  {
    id: '2',
    name: 'William Henry',
    rating: 5,
    comment: "Best grill spot I've tried in a long time.",
    role: 'Food Enthusiast',
  },
  {
    id: '3',
    name: 'Oliver James',
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
