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

  return (
    <div className="space-y-4">
      {/* Main image with magnifier and arrows */}
      <div className="relative bg-gray-50 rounded-xl overflow-hidden">
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
        <ImageMagnifier
          src={currentImage}
          alt={alt}
          zoomLevel={zoomLevel}
          magnifierSize={magnifierSize}
        />
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={src}
                alt={`${alt} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;
