import React, { useEffect, useState, useRef } from 'react';
import { getApiUrl, getMediaUrl } from '../utils/apiConfig';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Link, useNavigate } from "react-router-dom";

interface Slide {
  _id?: string;
  title: string;
  description: string;
  image: string;
  overlayImages?: string[];
  packageId?: string | number; // Optional package ID to link to
}

interface HeroSectionProps {
  isVisible: boolean;
  slides: Slide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ isVisible, slides }) => {
  const [localSlides, setLocalSlides] = useState<Slide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeOverlayIndices, setActiveOverlayIndices] = useState<number[]>([]);
  const swiperRef = useRef<SwiperRef>(null);
  const navigate = useNavigate();

  // Function to handle the Book Now button click
  const handleBookNow = (slide: Slide) => {
    if (slide.packageId) {
      navigate(`/contact?booking=true&packageId=${slide.packageId}`);
    } else {
      // If no specific package is linked, just go to the contact page with booking tab active
      navigate('/contact?booking=true');
    }
  };

  // Function to add base URL to relative paths if needed
  const fixImageUrl = (url: string): string => {
    // Use the utility function for media URLs
    return getMediaUrl(url);
  };

  // Debug to check slides data
  useEffect(() => {
    if (slides && slides.length > 0) {
      console.log("Slides received in HeroSection:", slides);
    }
  }, [slides]);

  useEffect(() => {
    // Use provided slides or fetch if not available
    if (slides && slides.length > 0) {
      // Filter out slides with missing required properties
      const validSlides = slides.filter(slide => 
        slide && 
        typeof slide.title === 'string' && 
        typeof slide.description === 'string' && 
        typeof slide.image === 'string'
      ).map(slide => ({
        ...slide,
        image: fixImageUrl(slide.image),
        overlayImages: slide.overlayImages?.map(img => fixImageUrl(img)) || []
      }));
      
      console.log("Valid slides for carousel:", validSlides);
      setLocalSlides(validSlides);
      // Initialize the active overlay indices for each slide to 0
      setActiveOverlayIndices(new Array(validSlides.length).fill(0));
    } else {
      const fetchSlides = async () => {
        try {
          const response = await fetch(getApiUrl('/api/heroslides'));
          if (!response.ok) throw new Error("Failed to fetch slides");
          const data: Slide[] = await response.json();
          
          // Filter out slides with missing required properties and fix URLs
          const validSlides = data.filter(slide => 
            slide && 
            typeof slide.title === 'string' && 
            typeof slide.description === 'string' && 
            typeof slide.image === 'string'
          ).map(slide => ({
            ...slide,
            image: fixImageUrl(slide.image),
            overlayImages: slide.overlayImages?.map(img => fixImageUrl(img)) || []
          }));
          
          console.log("Valid slides from API:", validSlides);
          setLocalSlides(validSlides);
          setActiveOverlayIndices(new Array(validSlides.length).fill(0));
        } catch (error) {
          console.error("Error fetching slides:", error);
        }
      };
      fetchSlides();
    }
  }, [slides]);

  // Effect to rotate through overlay images for the current active slide
  useEffect(() => {
    if (localSlides.length === 0) return;
    
    const currentSlide = localSlides[activeSlideIndex];
    if (!currentSlide?.overlayImages?.length) return;
    
    const intervalId = setInterval(() => {
      setActiveOverlayIndices(prev => {
        const newIndices = [...prev];
        const currentOverlayIndex = prev[activeSlideIndex];
        const maxIndex = currentSlide.overlayImages!.length - 1;
        
        // Update only the active slide's overlay index
        newIndices[activeSlideIndex] = currentOverlayIndex >= maxIndex ? 0 : currentOverlayIndex + 1;
        return newIndices;
      });
    }, 3000); // Change overlay image every 3 seconds
    
    return () => clearInterval(intervalId);
  }, [localSlides, activeSlideIndex]);

  // Handle slide change
  const handleSlideChange = (swiper: any) => {
    setActiveSlideIndex(swiper.realIndex);
  };
  
  // CSS styles
  const gentleFloatAnimation = {
    animation: 'gentleFloat 10s ease-in-out infinite'
  };

  // Define the keyframes animation in a style element
  useEffect(() => {
    // Create style element for keyframes
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes gentleFloat {
        0% { transform: scale(1.05); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up function
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="pt-20">
      {localSlides.length === 0 ? (
        <div className="h-[650px] bg-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">No slides available</h2>
            <p>Please add some slides through the admin panel.</p>
          </div>
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 8000, // 8 seconds between slides
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          className="h-[650px]"
          onSlideChange={handleSlideChange}
          ref={swiperRef}
        >
          {localSlides.map((slide, slideIndex) => (
            <SwiperSlide key={slide._id || slideIndex}>
              <div className="relative h-[100%] overflow-hidden">
                <img
                  src={slide.image}
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-10000 hover:scale-100"
                  alt={slide.title}
                  style={gentleFloatAnimation}
                  onError={(e) => {
                    console.error(`Failed to load image: ${slide.image}`);
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x650?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                  <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
                    <div
                      className={`flex flex-col justify-center h-full max-w-2xl transition-all duration-1000 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                      }`}
                    >
                      <h1 className="text-8xl font-bold text-white mb-6 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex space-x-6">
                        <button 
                          onClick={() => handleBookNow(slide)}
                          className="rounded-lg whitespace-nowrap px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                        >
                          Book Now
                        </button>
                        
                      </div>
                    </div>
                    
                    {slide.overlayImages && slide.overlayImages.length > 0 && (
                      <div className="relative w-[500px] h-[600px] hidden lg:block">
                        {slide.overlayImages.map((img, imgIndex) => {
                          const isActiveOverlay = imgIndex === (activeOverlayIndices[slideIndex] || 0);
                          const zIndexValue = isActiveOverlay ? 30 : (10 - imgIndex);
                          
                          return (
                            <div
                              key={imgIndex}
                              className={`absolute w-[400px] h-[300px] rounded-lg overflow-hidden shadow-2xl transition-all duration-1000`}
                              style={{
                                top: `${130 + (imgIndex * 15)}px`,
                                right: `${(imgIndex * 10)}px`,
                                opacity: isActiveOverlay ? 1 : 0.7,
                                transform: `
                                  translateY(${isActiveOverlay ? '-10px' : '0'}) 
                                  scale(${isActiveOverlay ? 1.1 : 0.95}) 
                                  rotate(${imgIndex * 2 - 2}deg)
                                `,
                                zIndex: zIndexValue,
                                transition: 'all 0.8s ease-in-out',
                              }}
                            >
                              <img 
                                src={img} 
                                alt={`${slide.title} highlight ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default HeroSection;
