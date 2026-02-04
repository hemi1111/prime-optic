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
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate position relative to image
    const imageRect = imageRef.current.getBoundingClientRect();
    const imageX = e.clientX - imageRect.left;
    const imageY = e.clientY - imageRect.top;

    setMousePosition({ x, y });
    setMagnifierPosition({ x: imageX, y: imageY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Calculate the background position for the magnified image
  const backgroundX = -(magnifierPosition.x * zoomLevel - magnifierSize / 2);
  const backgroundY = -(magnifierPosition.y * zoomLevel - magnifierSize / 2);

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
              backgroundSize: `${zoomLevel * 100}%`,
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