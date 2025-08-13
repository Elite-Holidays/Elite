import { TravelPackage, Review, HeroSlide, Feature, Statistic, Mannn, Das, Group, AboutUs, Office } from '../types';

import img_1 from './bali.jpg'
import img_2 from './paris.jpg'
import img_3 from './kyoto.jpg'
import img_4 from './santorini.jpg'
import img_5 from './NewYork.jpg'
import img_6 from './Dubai.jpg'
import img_7 from './Rome.jpg'
import img_8 from './Sydney.jpg'
import img_9 from './MachuPicchu.jpg'
import img_10 from './mumbai.jpg'
import img_11 from './goa.jpg'
import img_12 from './jaipur.jpg'
import img_13 from './hm.jpg'
import img_14 from './gt.jpg'
import img_15 from './ft.jpg'
import img_16 from './st.jpg'
import img_17 from './thailand.jpg'
import img_18 from './rushikesh.jpg'
import img_19 from './iceland.jpg'
import img_20 from './spain.jpg'
import img_21 from './office.jpg'



export const assets = {
    img_1,
    img_2
}


export const heroSlides: HeroSlide[] = [
  {
    title: 'Explore Thailand',
    description: 'Experience the enchanting beauty of Thailand with its pristine beaches, rich cultural heritage, and world-renowned hospitality. Discover ancient temples, savor exotic cuisines, and create unforgettable memories.',
    image: 'https://public.readdy.ai/ai/img_res/b0d6d154f222b24f9327c356a0ca93e1.jpg',
    overlayImages: [
      'https://public.readdy.ai/ai/img_res/b0d6d154f222b24f9327c356a0ca93e1.jpg',
      'https://public.readdy.ai/ai/img_res/fe64dab32ceffaa4a28616d6a6b7b3d2.jpg',
      'https://public.readdy.ai/ai/img_res/687c38222146896384ea6962b8b0e3aa.jpg'
    ]
  },
  {
    title: 'Discover Bali',
    description: 'Immerse yourself in the spiritual and natural wonders of Bali. From terraced rice fields to ancient temples, pristine beaches to vibrant arts scene, every moment in Bali is filled with magic and tranquility.',
    image: 'https://public.readdy.ai/ai/img_res/8625d420287a0a1e110c8076025f3e0c.jpg',
    overlayImages: [
      'https://public.readdy.ai/ai/img_res/91c53ee02ed52b5a7d3b15ba54516002.jpg',
      'https://public.readdy.ai/ai/img_res/e1f9757edd13203da6e8733832ce16ca.jpg',
      'https://public.readdy.ai/ai/img_res/5de318b2868cc6b9de56c118762099ec.jpg'
    ]
  },
  {
    title: 'Explore Maldives',
    description: 'Step into paradise in the Maldives, where crystal-clear waters meet powder-white beaches. Experience world-class luxury resorts, vibrant marine life, and the most stunning sunsets on Earth.',
    image: 'https://public.readdy.ai/ai/img_res/39539722737845481e99f7abf4d7f87c.jpg',
    overlayImages: [
      'https://public.readdy.ai/ai/img_res/1fa88d500cb8032a8779717baf7796ca.jpg',
      'https://public.readdy.ai/ai/img_res/d96d0b60cda57c5fd1e9554eda0d8179.jpg',
      'https://public.readdy.ai/ai/img_res/88b2f8a7b5f190e3b69a5fbb3cf439dc.jpg'
    ]
  }
];

export const travelPackages: TravelPackage[] = [
  {
    id: 1,
    title: 'Luxury Maldives Escape',
    location: 'Maldives',
    price: 3999,
    duration: '7 Days',
    rating: 4.9,
    image: 'https://public.readdy.ai/ai/img_res/3111fd259e4640dd9c2197dca17fd2c8.jpg',
    description: 'Experience ultimate luxury in an overwater villa with private pool and direct ocean access.'
  },
  {
    id: 2,
    title: 'Thai Island Paradise',
    location: 'Thailand',
    price: 2499,
    duration: '10 Days',
    rating: 4.8,
    image: 'https://public.readdy.ai/ai/img_res/802404a451f27ce7a547c77e62f9c0a9.jpg',
    description: 'Island hop through Thailand\'s most beautiful destinations with luxury accommodations.'
  },
  {
    id: 3,
    title: 'Bali Cultural Journey',
    location: 'Indonesia',
    price: 1999,
    duration: '8 Days',
    rating: 4.7,
    image: 'https://public.readdy.ai/ai/img_res/a8ac1913d5fc7b698a78b9413f7706ff.jpg',
    description: 'Immerse yourself in Balinese culture while staying in luxury jungle villas.'
  }
];

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Isabella Thompson',
    location: 'London, UK',
    rating: 5,
    comment: 'The Maldives package exceeded all expectations. The overwater villa was a dream come true, and the service was impeccable.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    date: '2023-06-15'
  },
  {
    id: 2,
    name: 'Alexander Chen',
    location: 'Singapore',
    rating: 5,
    comment: 'Our Thai island adventure was perfectly organized. Every detail was considered, and the exclusive experiences were unforgettable.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    date: '2023-07-22'
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    location: 'Paris, France',
    rating: 5,
    comment: 'The cultural immersion in Bali was magical. The private villa, local experiences, and attention to detail were outstanding.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    date: '2023-08-05'
  },
  {
    id: 4,
    name: 'Michael Rodriguez',
    location: 'New York, USA',
    rating: 4,
    comment: 'Great experience overall! The tour guides were knowledgeable and friendly. Would have liked a bit more free time to explore on our own.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    date: '2023-09-12'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    location: 'Sydney, Australia',
    rating: 5,
    comment: 'Absolutely phenomenal! From the moment we landed until our departure, everything was handled with utmost professionalism. Will definitely book again!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    date: '2023-10-30'
  },
  {
    id: 6,
    name: 'Raj Patel',
    location: 'Mumbai, India',
    rating: 4,
    comment: 'The accommodations were luxurious and the itinerary was well-planned. The only hiccup was a slight delay with one of our transfers.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    date: '2023-11-15'
  },
  {
    id: 7,
    name: 'Olivia Martinez',
    location: 'Barcelona, Spain',
    rating: 5,
    comment: 'This was our third trip with Elite Holidays and they continue to impress. The personalized touches make all the difference!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    date: '2024-01-08'
  },
  {
    id: 8,
    name: 'James Kim',
    location: 'Seoul, South Korea',
    rating: 5,
    comment: 'The exclusive access to local experiences was the highlight of our trip. We felt like VIPs throughout our entire journey.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    date: '2024-02-20'
  }
];

export const features: Feature[] = [
  {
    icon: 'gem',
    title: 'Luxury Experience',
    description: 'Indulge in handpicked 5-star accommodations and exclusive VIP services tailored to your preferences.'
  },
  {
    icon: 'shield',
    title: 'Safe & Secure',
    description: 'Travel with confidence knowing you have 24/7 support and comprehensive travel insurance coverage.'
  },
  {
    icon: 'heart',
    title: 'Personalized Service',
    description: 'Enjoy customized itineraries crafted by expert travel consultants who understand your unique needs.'
  }
];

export const statistics: Statistic[] = [
  { number: '15K+', label: 'Happy Travelers' },
  { number: '650+', label: 'Destinations' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '24/7', label: 'Support' }
];

export const mannn: Mannn[] = [
  {
      id: 1,
      title: "Bali, Indonesia",
      image: img_1, 
      rating: 4.8,
      description: "A tropical paradise known for its stunning beaches and vibrant culture.",
      price: 1200,
      tripType: "Beach & Relaxation",
      tripCategory: "International"  // Added category
  },
  {
      id: 2,
      title: "Paris, France",
      image: img_2, 
      rating: 4.9,
      description: "The city of love, home to the Eiffel Tower and world-class cuisine.",
      price: 1800,
      tripType: "Romantic Getaway",
      tripCategory: "International"
  },
  {
      id: 3,
      title: "Kyoto, Japan",
      image: img_3, 
      rating: 4.7,
      description: "A historical city filled with ancient temples and cherry blossoms.",
      price: 1400,
      tripType: "Cultural Exploration",
      tripCategory: "International"
  },
  {
      id: 4,
      title: "Santorini, Greece",
      image: img_4, 
      rating: 4.8,
      description: "Famous for its whitewashed houses and stunning sunsets over the Aegean Sea.",
      price: 1600,
      tripType: "Luxury & Relaxation",
      tripCategory: "International"
  },
  {
      id: 5,
      title: "New York City, USA",
      image: img_5, 
      rating: 4.9,
      description: "The city that never sleeps, with iconic landmarks and diverse culture.",
      price: 2000,
      tripType: "Urban Adventure",
      tripCategory: "International"
  },
  {
      id: 6,
      title: "Dubai, UAE",
      image: img_6, 
      rating: 4.7,
      description: "A luxury destination known for skyscrapers, shopping, and desert safaris.",
      price: 2200,
      tripType: "Luxury Shopping & Desert Safari",
      tripCategory: "International"
  },
  {
      id: 7,
      title: "Rome, Italy",
      image: img_7, 
      rating: 4.8,
      description: "Explore ancient ruins, Vatican City, and delicious Italian cuisine.",
      price: 1700,
      tripType: "Historical & Culinary Tour",
      tripCategory: "International"
  },
  {
      id: 8,
      title: "Sydney, Australia",
      image: img_8, 
      rating: 4.7,
      description: "A vibrant city known for the Opera House and stunning beaches.",
      price: 1900,
      tripType: "Outdoor & City Life",
      tripCategory: "International"
  },
  {
      id: 9,
      title: "Machu Picchu, Peru",
      image: img_9, 
      rating: 4.9,
      description: "A breathtaking ancient Incan city in the Andes Mountains.",
      price: 1500,
      tripType: "Adventure & Hiking",
      tripCategory: "International"
  },
  {
      id: 10,
      title: "Mumbai, India",
      image: img_10, 
      rating: 4.8,
      description: "A bustling metropolis blending history, Bollywood, and street food.",
      price: 1300,
      tripType: "City & Cultural",
      tripCategory: "Domestic"
  },
  {
      id: 11,
      title: "Goa, India",
      image: img_11, 
      rating: 4.7,
      description: "Famous for its golden beaches, nightlife, and vibrant markets.",
      price: 1100,
      tripType: "Beach & Party",
      tripCategory: "Domestic"
  },
  {
      id: 12,
      title: "Jaipur, India",
      image: img_12, 
      rating: 4.8,
      description: "The Pink City, rich in royal heritage and architectural beauty.",
      price: 1000,
      tripType: "Heritage & Culture",
      tripCategory: "Domestic"
  }
];

export const das: Das[] = [
  {
      id: 1,
      title: "Honey Moon",
      image: img_13, 
      description: "Embark on a romantic escape filled with luxury, privacy, and unforgettable moments with your loved one.",
  },
  {
      id: 2,
      title: "Group Trip",
      image: img_14, 
      description: "Join a vibrant group of adventurers, make new friends, and explore exciting destinations together.",
  },
  {
      id: 3,
      title: "Family Trip",
      image: img_15, 
      description: "Create cherished memories with your loved ones on a family-friendly adventure filled with fun and relaxation.",

  },
  {
      id: 4,
      title: "Solo Trip",
      image: img_16, 
      description: "Embrace the freedom of solo travel, discovering new places, cultures, and a deeper connection with yourself",
  },
];


export const group: Group[] = [
  {   
      id: 1,
      title: "Thailand",
      image: img_17,
      price: 6000,
      Days: "6 Days 5 Nights",
      description:"Discover temples, jungle treks, and vibrant markets.",
  
  }, 

  {
      id: 2,
      title: "Rishikesh",
      image: img_18, 
      price: 6000,
      Days: "6 Days 5 Nights",
      description: "Enjoy rafting, yoga retreats, and serene nature.",
  
  }, 

  {
      id: 3,
      title: "Iceland",
      image: img_19, 
      price: 6000,
      Days: "6 Days 5 Nights",
      description: "Explore geysers, hot springs, and northern lights.",
  },

  {
      id: 4,
      title: "Goa",
      image: img_11,
      price: 6000,
      Days: "6 Days 5 Nights",
      description: "Relax on beaches, try water sports, and enjoy nightlife.",
  },

  {
      id: 5,
      title: "Peru",
      image: img_9,
      price: 6000,
      Days: "6 Days 5 Nights",
      description: "Hike to Machu Picchu and enjoy local culture.",
  },

  {
      id: 6,
      title: "Spain",
      image: img_20,
      price: 6000,
      Days: "6 Days 5 Nights",
      description: "Experience beaches, architecture, and tapas tours.",
  }
];

export const aboutUs: AboutUs[] = [
  {
    id: 1,
    name: 'Mr Suraj',
    image: img_10,
    designation: 'CEo'
  },
  {
    id: 1,
    name: 'Mrs',
    image: img_11,
    designation: 'CEo'
  }
  
]

export const office: Office[] = [
  {
    id: 1,
    name: 'Our office',
    image: img_21,

  }
  
]