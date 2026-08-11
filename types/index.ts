import { ReactNode } from 'react';

// Shared UI Types
export interface ContainerProps {
  children: ReactNode;
  className?: string;
  clean?: boolean;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: ReactNode;
}

export interface SectionHeadingProps {
  title: string;
  highlightedWord?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  dark?: boolean;
}

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  dark?: boolean;
}

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  video?: string;
  onAddToCart?: () => void;
}

export interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  role?: string;
  avatar?: string;
}

export interface ImageCardProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  triggerOnce?: boolean;
}

// Data Model Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'fish' | 'specials' | 'sides' | 'catering';
  popular?: boolean;
  spicy?: boolean;
  video?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  role: string;
}

export interface WhyLoveUsCard {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide Icon name
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}
