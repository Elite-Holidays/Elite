import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Star } from 'lucide-react';
import { reviews } from '../data';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Using the Review type from the static data

const Reviews: React.FC = () => {

  // Using static reviews data from the data file

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Travelers Say</h2>

        {/* Swiper for reviews */}
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          spaceBetween={30}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src={review.image || 'https://via.placeholder.com/50'}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-gray-600 text-sm">{review.location}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-gray-400 text-sm">{review.date}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>


      </div>
    </section>
  );
};

export default Reviews;
