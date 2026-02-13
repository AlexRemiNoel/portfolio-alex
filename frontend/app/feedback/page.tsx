"use client"


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Feedback {
  id: number;
  name: string;
  email?: string;
  message: string;
  rating?: number;
  is_approved: boolean;
  created_at: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [approvedFeedback, setApprovedFeedback] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApprovedFeedback();
  }, []);

  const loadApprovedFeedback = async () => {
    try {
      const response = await fetch("http://localhost:8000/feedback/approved");
      if (response.ok) {
        const data = await response.json();
        setApprovedFeedback(data);
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email || null,
          message,
          rating,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setRating(5);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to submit feedback");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating: currentRating, onRate }: { rating: number; onRate?: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate && onRate(star)}
            className={`text-2xl transition ${
              star <= currentRating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            } ${onRate ? "hover:text-yellow-300 cursor-pointer" : ""}`}
            disabled={!onRate}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blue-950">
      {/* Navigation */}
      <nav className="sticky top-0 border-b border-zinc-200 dark:border-blue-800 bg-white/80 dark:bg-blue-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">Feedback</h1>
          <a
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Portfolio
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Submit Feedback Form */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
            Leave Your Feedback
          </h2>
          
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-medium">
                ✅ Thank you! Your feedback has been submitted and is pending approval.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 dark:bg-blue-900/30 p-8 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={1000}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Share your thoughts..."
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {message.length}/1000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </section>

        {/* Approved Feedback */}
        <section>
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
            What Others Are Saying
          </h2>

          {approvedFeedback.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-12">
              No feedback yet. Be the first to leave a comment!
            </p>
          ) : (
            <div className="space-y-6">
              {approvedFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-6 bg-white dark:bg-blue-900/30 border border-gray-200 dark:border-blue-800 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-black dark:text-white">
                        {feedback.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {feedback.rating && <StarRating rating={feedback.rating} />}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      </div>
  );
}