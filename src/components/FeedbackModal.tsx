import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppFeedback, AppItem, UserSession } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem | null;
  user: UserSession;
  onSubmitFeedback: (feedback: AppFeedback) => void;
}

export function FeedbackModal({ isOpen, onClose, app, user, onSubmitFeedback }: Props) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !app) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newFeedback: AppFeedback = {
        id: `fb_${Date.now()}`,
        appId: app.id,
        appName: app.name,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatarUrl,
        rating,
        comment: comment.trim(),
        createdAt: 'Just now',
      };

      onSubmitFeedback(newFeedback);
      setIsSubmitting(false);
      setSubmitted(true);

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel border border-yellow-500/40 rounded-3xl p-6 relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">Rate {app.name}</h3>
            <p className="text-xs text-slate-400 font-mono">Feedback is linked to BuildJob & visible to App Admins</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-400 mx-auto flex items-center justify-center text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-display">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-300">
              Your rating has been recorded and will help train future agentic generations.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star selector */}
            <div className="text-center py-2">
              <div className="text-xs font-mono text-slate-400 uppercase mb-2">Select Your Rating</div>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating !== null ? star <= hoverRating : star <= rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs font-mono text-yellow-400 font-bold mt-1">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Phenomenal Vibe!' : rating === 4 ? '⭐⭐⭐⭐ Great Build' : rating === 3 ? '⭐⭐⭐ Decent' : 'Needs Polish'}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Review or Feature Suggestion
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What did you love? Any improvements or features you'd like the AI to add next?"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <span>Recording Feedback on Base...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SUBMIT 5-STAR REVIEW</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
