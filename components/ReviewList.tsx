import React from 'react';
import { Review } from '../types';
import { StarIcon } from './Icons';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-gray-500">هنوز نظری برای این محصول ثبت نشده است.</p>;
  }

  return (
    <div className="space-y-10">
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col sm:flex-row gap-x-6">
          <div className="flex-shrink-0 text-center sm:text-right mb-4 sm:mb-0">
            <p className="font-bold text-gray-900">{review.user}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(review.created_at).toLocaleDateString('fa-IR')}
            </p>
          </div>
          <div className="border-s-2 border-gray-200 ps-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-base text-gray-700 mt-4">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
