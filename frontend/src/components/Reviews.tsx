import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import { Star, X, Send, MapPin, Calendar, Quote, CheckCircle, AlertCircle } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { Review } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/reviews`);
        if (response.data && response.data.data) {
          // Transform the data to match our Review type
          const formattedReviews = response.data.data.map((review: any) => ({
            id: review._id,
            name: review.name,
            location: review.location,
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.date).toISOString().split('T')[0]
          }));
          setReviews(formattedReviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/reviews`, newReview);
      
      if (response.data && response.data.data) {
        const addedReview = response.data.data;
        // Add the new review to the state
        setReviews(prev => [{
          id: addedReview._id,
          name: addedReview.name,
          location: addedReview.location,
          rating: addedReview.rating,
          comment: addedReview.comment,
          date: new Date(addedReview.date).toISOString().split('T')[0]
        }, ...prev]);
        
        // Reset form and close modal
        setShowForm(false);
        setNewReview({
          name: '',
          location: '',
          rating: 5,
          comment: '',
          date: new Date().toISOString().split('T')[0]
        });
        
        // Show success toast instead of alert
        setToast({
          show: true,
          message: 'Thank you for your review!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      // Show error toast instead of alert
      setToast({
        show: true,
        message: 'Failed to submit review. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg transform transition-all duration-500 animate-slideInRight ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg mr-2">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="text-sm font-medium">{toast.message}</div>
          <button 
            type="button" 
            className="ml-4 -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Traveler Stories
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl">
              Authentic experiences shared by our community of adventurers from around the world
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <span className="relative z-10 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Share Your Experience
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && !showForm && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-purple-500 animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', opacity: 0.7 }}></div>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all duration-300 ease-in-out animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Share Your Journey
                </h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newReview.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Destination</label>
                  <input
                    type="text"
                    name="location"
                    value={newReview.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Paris, France"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Your Rating</label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none mr-1"
                      >
                        <Star 
                          className={`w-6 h-6 ${newReview.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors duration-200`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 text-sm font-medium">Your Experience</label>
                  <textarea
                    name="comment"
                    value={newReview.comment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    rows={3}
                    placeholder="Share the highlights of your journey..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-3 w-3 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-2" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Swiper for reviews */}
        {!loading && reviews.length > 0 && (
          <Swiper
            modules={[Pagination, Autoplay, Navigation, EffectCoverflow]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            slidesPerView={1}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1.5, centeredSlides: true },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-gray-100">
                  <div className="mb-6 relative">
                    <Quote className="text-blue-100 w-12 h-12 absolute -top-4 -left-2 z-0" />
                    <p className="text-gray-700 relative z-10 leading-relaxed">"{review.comment}"</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{review.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex text-yellow-400 mb-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* No reviews message */}
        {!loading && reviews.length === 0 && !error && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl shadow-inner">
            <Quote className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:opacity-90 transition-all duration-200 inline-flex items-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Write a Review
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
