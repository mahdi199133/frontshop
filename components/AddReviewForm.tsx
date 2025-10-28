import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface AddReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('لطفاً یک امتیاز انتخاب کنید.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      // Reset form on successful submission
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت نظر.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">نظر خود را بنویسید</h3>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                type="button"
                key={starValue}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
                className="text-gray-300"
              >
                <StarIcon
                  className={`h-8 w-8 cursor-pointer ${
                    (hoverRating || rating) >= starValue ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="sr-only">
          نظر
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="تجربه خود را از این محصول بنویسید..."
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isSubmitting ? 'در حال ارسال...' : 'ثبت نظر'}
        </button>
      </div>
    </form>
  );
};

export default AddReviewForm;
