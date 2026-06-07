import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { reviewApi } from "../../api/reviewApi";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { groqApi } from "../../api/groqApi";
import { Sparkles, ThumbsUp, ThumbsDown, Loader } from "lucide-react";

function StarRating({ rating, onRate, interactive = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={20}
            className={
              star <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewSection({ productId }) {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await reviewApi.getProductReviews(productId);
      const data = response.data.data;
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);

      if (user) {
        const existing = data.reviews.find(
          (r) => r.userId === parseInt(user.id),
        );
        if (existing) setUserReview(existing);
      }
    } catch {
      console.error("Failed to fetch reviews");
    }
  }, [productId, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      if (editing && userReview) {
        await reviewApi.updateReview(userReview.id, {
          rating,
          comment,
          productId,
        });
        toast.success("Review updated!");
      } else {
        await reviewApi.addReview({ rating, comment, productId });
        toast.success("Review added!");
      }
      setRating(0);
      setComment("");
      setEditing(false);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeReviews = async () => {
    if (reviews.length === 0) {
      toast.error("No reviews to summarize");
      return;
    }
    setSummaryLoading(true);
    try {
      const summary = await groqApi.summarizeReviews(reviews, 'this product');
      setAiSummary(summary);
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewApi.deleteReview(reviewId);
      toast.success("Review deleted!");
      setUserReview(null);
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = () => {
    setRating(userReview.rating);
    setComment(userReview.comment || "");
    setEditing(true);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Reviews & Ratings
      </h2>

      {/* Average Rating */}
      <div className="bg-gray-50 rounded-2xl p-6 flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-indigo-600">
            {averageRating || 0}
          </p>
          <StarRating rating={Math.round(averageRating)} />
          <p className="text-gray-500 text-sm mt-1">{totalReviews} reviews</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600 w-4">{star}</span>
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Review Summary */}
      {reviews.length > 0 && (
        <div className="mb-6">
          {!aiSummary ? (
            <button
              onClick={handleSummarizeReviews}
              disabled={summaryLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {summaryLoading ? (
                <>
                  <Loader size={16} className="animate-spin" /> Analyzing
                  reviews...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> AI Summarize Reviews
                </>
              )}
            </button>
          ) : (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="font-bold text-gray-800">AI Review Summary</h3>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                    aiSummary.verdict === "Excellent"
                      ? "bg-green-100 text-green-600"
                      : aiSummary.verdict === "Good"
                        ? "bg-blue-100 text-blue-600"
                        : aiSummary.verdict === "Average"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
                  {aiSummary.verdict}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{aiSummary.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <ThumbsUp size={14} className="text-green-500" />
                    <span className="text-sm font-semibold text-green-600">
                      Pros
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {aiSummary.pros?.map((pro, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 flex items-start gap-1"
                      >
                        <span className="text-green-500 mt-0.5">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <ThumbsDown size={14} className="text-red-500" />
                    <span className="text-sm font-semibold text-red-600">
                      Cons
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {aiSummary.cons?.map((con, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 flex items-start gap-1"
                      >
                        <span className="text-red-500 mt-0.5">✗</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setAiSummary(null)}
                className="mt-3 text-xs text-indigo-600 hover:underline"
              >
                Regenerate Summary
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Review Form */}
      {user && !userReview && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <StarRating
                rating={rating}
                onRate={setRating}
                interactive={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="self-start bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Edit Review Form */}
      {user && userReview && editing && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Edit Your Review
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <StarRating
                rating={rating}
                onRate={setRating}
                interactive={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
              >
                {loading ? "Updating..." : "Update Review"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {review.userName}
                    </span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-600 mt-3">{review.comment}</p>
              )}
              {user && review.userId === parseInt(user.id) && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handleEdit}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
