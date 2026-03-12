import { useState } from "react";
import ImageMagnifier from "./ImageMagnifier";

type ProductImageSliderProps = {
  images: string[];
  alt: string;
  zoomLevel?: number;
  magnifierSize?: number;
};

const ProductImageSlider = ({
  images,
  alt,
  zoomLevel = 1.35,
  magnifierSize = 160,
}: ProductImageSliderProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!images.length) {
    return null;
  }

  const currentImage = images[selectedIndex];
  const hasMultiple = images.length > 1;

  const goPrev = () => {
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setSelectedIndex((i) => (i + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX == null || !hasMultiple) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = touchStartX - endX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) goNext();
      else goPrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="flex flex-col">
      {/* Mobile: simple slider with swipe + dots */}
      <div
        className="relative min-h-[min(85vw,520px)] overflow-hidden rounded-xl bg-gray-50 sm:min-h-[min(75vw,560px)] lg:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage}
          alt={alt}
          className="h-full min-h-[min(85vw,520px)] w-full object-contain p-2 sm:min-h-[min(75vw,560px)] sm:p-3"
        />
        {hasMultiple && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === selectedIndex ? "bg-slate-900" : "bg-slate-300"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Desktop: full images stacked vertically, scroll to view more */}
      <div className="hidden flex-col gap-6 lg:flex">
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="overflow-hidden rounded-xl bg-gray-50">
            <ImageMagnifier
              src={src}
              alt={`${alt} view ${index + 1}`}
              zoomLevel={zoomLevel}
              magnifierSize={magnifierSize}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
