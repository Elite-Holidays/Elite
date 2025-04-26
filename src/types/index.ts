export interface TravelPackage {
  id: number;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  description: string;
}

export interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
}

export interface HeroSlide {
  title: string;
  description: string;
  image: string;
  overlayImages: string[];
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Statistic {
  number: string;
  label: string;
}

export interface Mannn {
  id: number;
  title: string;
  image: string; // Local image paths
  rating: number;
  description: string;
  price: number;
  tripType: string; // e.g., "Adventure", "Luxury"
  tripCategory: "Domestic" | "International"; // New field
}

export interface Das {
  id: number;
  title: string;
  image: string; // Local image paths
  description: string;
}

export interface Group {
  id: number;
  title: string;
  image: string; // Local image paths
  price: number;
  Days: string;
  description: string;
  
}

export interface AboutUs {
    id: number;
    name: string;
    image: string;
    designation: string;
  }

export interface Office {
    id: number;
    name: string;
    image: string;
    
  }


