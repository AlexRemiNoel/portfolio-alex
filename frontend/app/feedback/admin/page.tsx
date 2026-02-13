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

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [allFeedback, setAllFeedback] = useState<Feedback[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeedback();
    }
  }, [isAuthenticated, filter]);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
    } catch (err) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeedback = async () => {
    const token = localStorage.getItem("access_token");
    const endpoint = filter === "pending" 
      ? "http://localhost:8000/feedback/pending"
      : filter === "approved"
      ? "http://localhost:8000/feedback/approved"
      : "http://localhost:8000/feedback/all";

    try {
      const response = await fetch(endpoint, {
        headers: filter !== "approved" ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setAllFeedback(data);
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    }
  };

  const handleApprove = async (id: number, approve: boolean) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/feedback/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approve }),
      });

      if (response.ok) {
        loadFeedback();
      }
    } catch (err) {
      console.error("Failed to approve feedback:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadFeedback();
      }
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-blue-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  const StarRating = ({ rating }: { rating?: number }) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blue-950">
      <nav className="sticky top-0 border-b border-zinc-200 dark:border-blue-800 bg-white/80 dark:bg-blue-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Feedback Management
          </h1>
          
          <a
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Portfolio
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilter("pending")}
            className={`pb-3 px-4 font-medium transition ${
              filter === "pending"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Pending ({allFeedback.filter(f => !f.is_approved).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`pb-3 px-4 font-medium transition ${
              filter === "approved"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            Approved ({allFeedback.filter(f => f.is_approved).length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`pb-3 px-4 font-medium transition ${
              filter === "all"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            All ({allFeedback.length})
          </button>
        </div>

        {/* Feedback List */}
        {allFeedback.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-12">
            No feedback in this category.
          </p>
        ) : (
          <div className="space-y-6">
            {allFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className={`p-6 border rounded-lg ${
                  feedback.is_approved
                    ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white">
                      {feedback.name}
                    </h3>
                    {feedback.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feedback.email}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(feedback.created_at).toLocaleString()}
                    </p>
                  </div>
                  <StarRating rating={feedback.rating} />
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {feedback.message}
                </p>

                <div className="flex gap-3">
                  {!feedback.is_approved ? (
                    <button
                      onClick={() => handleApprove(feedback.id, true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      ✓ Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(feedback.id, false)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Delete
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}