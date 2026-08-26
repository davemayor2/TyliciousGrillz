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
    id: 'grilled-fish',
    name: 'Grilled Fish',
    description: 'Whole fresh fish (Catfish, Tilapia, or Croaker) flame-grilled over hot charcoal with signature spices, served with your choice of sides.',
    price: 50,
    image: '/images/rs=w_1160,h_1773.webp',
    category: 'grilled-fish',
    popular: true,
    video: '/vids/catfish.mp4',
  },

  // 2. Chicken & Turkey
  {
    id: 'chicken-bbq',
    name: 'Chicken BBQ',
    description: 'Succulent chicken BBQ including juicy flame-grilled chicken legs, glazed in rich sticky house barbecue marinade.',
    price: 40,
    image: '/images/Frame 153.png',
    category: 'chicken-turkey',
    popular: true,
    video: '/vids/chicken_wings.mp4',
  },
  {
    id: 'chicken-thigh',
    name: 'Chicken Thigh',
    description: 'Tender, juicy chicken thighs marinated in aromatic African herbs and flame-grilled for a rich, smoky taste.',
    price: 35,
    image: '/images/Frame 153.png',
    category: 'chicken-turkey',
    video: '/vids/chicken_wings.mp4',
  },
  {
    id: 'wings-stop',
    name: 'Wings- stop',
    description: 'Crispy and savory flame-grilled chicken wings seasoned to perfection with Tylicious special pepper blend.',
    price: 30,
    image: '/images/Frame 153.png',
    category: 'chicken-turkey',
    spicy: true,
    video: '/vids/chicken_wings.mp4',
  },
  {
    id: 'grilled-turkey',
    name: 'Grilled Turkey',
    description: 'Sizzling tender turkey wings char-grilled with our house spices for an authentic, unforgettable smoky flavor.',
    price: 50,
    image: '/vids/turkey_thumbnail.jpg',
    category: 'chicken-turkey',
    video: '/vids/turkey_vid.mp4',
  },

  // 3. Lamb & Beef
  {
    id: 'lamb-chops-ribs',
    name: 'Lamb Chops & Ribs',
    description: 'Tender lamb chops and baby back ribs slow-cooked for hours and glazed with our rich sticky house honey-BBQ sauce.',
    price: 85,
    image: '/images/rs=w_1536.webp',
    category: 'lamb-beef',
    popular: true,
    video: '/vids/lamb_chops_ribs.mp4',
  },
  {
    id: 'suya',
    name: 'Suya',
    description: 'Succulent beef strips seasoned with authentic Nigerian Suya pepper blend, grilled over red-hot charcoal.',
    price: 45,
    image: '/images/Frame 153.png',
    category: 'lamb-beef',
    popular: true,
    spicy: true,
    video: '/vids/suya_vid.mp4',
  },

  // 4. Seafood
  {
    id: 'jumbo-prawn',
    name: 'Jumbo Prawn',
    description: 'King jumbo prawns skewered and grilled over charcoal, brushed with rich garlic chili butter.',
    price: 60,
    image: '/images/Gemini_Generated_Image_cibfydcibfydcibf.png',
    category: 'seafood',
    video: '/vids/Tylicious Seafood Platter.mp4',
  },
  {
    id: 'grilled-seafood-prawn',
    name: 'Grilled Seafood Prawn',
    description: 'A grand feast of flame-grilled prawns and seafood delicacies seasoned with aromatic herbs and spicy garlic dip.',
    price: 75,
    image: '/images/Gemini_Generated_Image_cibfydcibfydcibf.png',
    category: 'seafood',
    popular: true,
    video: '/vids/Tylicious Seafood Platter.mp4',
  },
];

export const FAVORITES_DATA: MenuItem[] = [
  FULL_MENU_DATA[0], // Grilled Fish
  FULL_MENU_DATA[1], // Chicken BBQ
  FULL_MENU_DATA[5], // Lamb Chops & Ribs
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
