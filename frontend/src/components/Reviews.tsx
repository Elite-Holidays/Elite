import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Star } from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getApiUrl } from '../utils/apiConfig';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Review {
  _id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

const Reviews: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState<Omit<Review, '_id'>>({
    name: '',
    location: '',
    rating: 0,
    comment: '',
    date: new Date().toLocaleDateString(),
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ Fetch all reviews from the backend
  useEffect(() => {
    axios.get(getApiUrl('/api/reviews'))
      .then((response) => setReviewList(response.data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

  // ✅ Handle image file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
      setErrorMessage(null); // Clear any previous error messages
    }
  };

  // ✅ Handle review submission
  const handleAddReview = async () => {
    // Reset error message
    setErrorMessage(null);

    if (!isSignedIn) {
      setErrorMessage('You must be logged in to add a review.');
      return;
    }

    if (!newReview.name.trim() || !newReview.location.trim() || newReview.rating === 0) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!imageFile) {
      setErrorMessage('Please upload an image for your review.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', newReview.name);
    formData.append('location', newReview.location);
    formData.append('rating', newReview.rating.toString());
    formData.append('comment', newReview.comment);
    formData.append('date', newReview.date);
    formData.append('image', imageFile);

    try {
      // Get the session token specifically for API authentication
      const token = await getToken({ template: "api-key" });
      
      if (!token) {
        throw new Error('Authentication token not available');
      }
      
      console.log('Using token for review submission');
      
      const response = await axios.post(getApiUrl('/api/reviews'), formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setReviewList([response.data, ...reviewList]); // Add new review to the list
      setShowModal(false);
      
      // Reset form
      setNewReview({
        name: '',
        location: '',
        rating: 0,
        comment: '',
        date: new Date().toLocaleDateString(),
        image: '',
      });
      setImageFile(null);
      
    } catch (error: any) {
      console.error('Error adding review:', error);
      if (error.response?.status === 401) {
        setErrorMessage('Authentication failed. Please try logging out and logging in again.');
      } else {
        setErrorMessage(error.response?.data?.error || 'Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {reviewList.map((review) => (
            <SwiperSlide key={review._id}>
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

        {/* Add Review Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => isSignedIn ? setShowModal(true) : alert('You must be logged in to add a review.')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            {isSignedIn ? 'Add Review' : 'Login to Add Review'}
          </button>
        </div>

        {/* Modal (Popup) */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Add a Review</h3>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <input
                type="text"
                placeholder="Your Name *"
                className="w-full mb-2 p-2 border rounded"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              />

              <input
                type="text"
                placeholder="Location *"
                className="w-full mb-2 p-2 border rounded"
                value={newReview.location}
                onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
              />

              <textarea
                placeholder="Your Review (Optional)"
                className="w-full mb-2 p-2 border rounded"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />

              <div className="mb-4">
                <p className="font-semibold mb-2">Rate Your Experience *</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer ${
                        newReview.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    />
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <p className="font-semibold mb-2">Upload Your Photo *</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
                {imageFile && (
                  <p className="text-green-600 text-sm mt-1">
                    Image selected: {imageFile.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors`}
                  onClick={handleAddReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
