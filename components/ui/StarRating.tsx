import { cn } from "@/lib/utils";
import type { Rating } from "@/lib/types";
import { ratingToStars } from "@/lib/utils";

interface StarRatingProps {
  rating: Rating;
  showCount?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  rating,
  showCount = true,
  size = "sm",
  className,
}: StarRatingProps) {
  const stars = ratingToStars(rating.score);
  const fullStars = Math.floor(stars);
  const hasHalf = stars % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={cn(
              size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5",
              i < fullStars
                ? "text-amber-400"
                : i === fullStars && hasHalf
                ? "text-amber-300"
                : "text-surface-200"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <span
        className={cn(
          "font-semibold text-surface-700",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {rating.score.toFixed(1)}
      </span>

      {showCount && (
        <span className={cn("text-surface-400", size === "sm" ? "text-xs" : "text-sm")}>
          ({rating.reviewCount.toLocaleString()} {rating.source})
        </span>
      )}
    </div>
  );
}
