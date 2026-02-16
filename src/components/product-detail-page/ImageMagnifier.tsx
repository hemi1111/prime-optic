import { useState, useRef } from "react";

type ImageMagnifierProps = {
  src: string;
  alt: string;
  zoomLevel?: number;
  magnifierSize?: number;
};

const ImageMagnifier = ({
  src,
  alt,
  zoomLevel = 2,
  magnifierSize = 150,
}: ImageMagnifierProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageInfo, setImageInfo] = useState({
    displayedWidth: 0,
    displayedHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    scaleX: 1,
    scaleY: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const computedStyle = window.getComputedStyle(img);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      
      // Get the actual displayed image dimensions (excluding padding)
      const displayedWidth = img.offsetWidth - paddingLeft - paddingRight;
      const displayedHeight = img.offsetHeight - paddingTop - paddingBottom;
      
      // Get natural image dimensions
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      
      // Calculate scale factors (how much the image is scaled down from natural size)
      const scaleX = naturalWidth / displayedWidth;
      const scaleY = naturalHeight / displayedHeight;
      
      setImageInfo({
        displayedWidth,
        displayedHeight,
        naturalWidth,
        naturalHeight,
        scaleX,
        scaleY,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate position relative to image element (including padding)
    const imageRect = imageRef.current.getBoundingClientRect();
    const imageX = e.clientX - imageRect.left;
    const imageY = e.clientY - imageRect.top;

    // Get computed styles to account for padding
    const computedStyle = window.getComputedStyle(imageRef.current);
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    
    // Calculate position relative to actual image content (excluding padding)
    const contentX = imageX - paddingLeft;
    const contentY = imageY - paddingTop;

    // Clamp to image bounds
    const clampedX = Math.max(0, Math.min(contentX, imageInfo.displayedWidth || contentX));
    const clampedY = Math.max(0, Math.min(contentY, imageInfo.displayedHeight || contentY));

    setMousePosition({ x, y });
    setMagnifierPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Calculate the background position for the magnified image
  // We need to map the displayed position to the natural image position
  // and then calculate where to position the background so the cursor point is centered
  const naturalX = magnifierPosition.x * imageInfo.scaleX;
  const naturalY = magnifierPosition.y * imageInfo.scaleY;
  
  // The background is zoomed, so we need to position it so that the point under the cursor
  // appears at the center of the magnifier
  // Background size is zoomLevel * 100% of the magnifier size
  // We want: naturalX * zoomLevel to be at magnifierSize / 2
  const backgroundX = -(naturalX * zoomLevel - magnifierSize / 2);
  const backgroundY = -(naturalY * zoomLevel - magnifierSize / 2);

  return (
    <div
      ref={containerRef}
      className="relative bg-gray-50 rounded-xl overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-96 lg:h-[500px] object-contain p-8 pointer-events-none select-none"
        onLoad={handleImageLoad}
      />

      {isHovering && (
        <>
          {/* Magnifying glass circle */}
          <div
            className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg z-10"
            style={{
              left: `${mousePosition.x - magnifierSize / 2}px`,
              top: `${mousePosition.y - magnifierSize / 2}px`,
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              backgroundImage: `url(${src})`,
              backgroundSize: `${imageInfo.naturalWidth * zoomLevel}px ${imageInfo.naturalHeight * zoomLevel}px`,
              backgroundPosition: `${backgroundX}px ${backgroundY}px`,
              backgroundRepeat: "no-repeat",
              transform: "translateZ(0)",
            }}
          />

          {/* Overlay to darken non-magnified area */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle ${magnifierSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0, 0, 0, 0.1) 100%)`,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ImageMagnifier;