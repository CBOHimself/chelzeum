import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import galleryData from "../../data/bioGallery.json";

function ChevronIcon({ direction }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

export default function BioGallery() {
  const items = useMemo(
    () => galleryData.filter((item) => item.visible !== false),
    []
  );
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = items.length;
  const current = items[index] ?? null;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  const openLightbox = useCallback(() => {
    if (current) setLightboxOpen(true);
  }, [current]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (index >= total && total > 0) setIndex(total - 1);
  }, [index, total]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(e) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && hasPrev) goPrev();
      if (e.key === "ArrowRight" && hasNext) goNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, hasPrev, hasNext, goPrev, goNext, closeLightbox]);

  if (total === 0) return null;

  return (
    <section className="bio-section" aria-label="Gallery">
      <h2 className="bio-section__title">Gallery</h2>

      <div className="bio-gallery">
        <div className="bio-gallery__stage">
          <button
            type="button"
            className="bio-gallery__nav bio-gallery__nav--prev"
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous image"
          >
            <ChevronIcon direction="left" />
          </button>

          <button
            type="button"
            className="bio-gallery__slide"
            onClick={openLightbox}
            aria-label={`View larger: ${current.alt || current.caption}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="bio-gallery__frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <img
                  src={current.imageUrl}
                  alt={current.alt || current.caption}
                  className="bio-gallery__image"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
            <span className="bio-gallery__expand-hint">Click to enlarge</span>
          </button>

          <button
            type="button"
            className="bio-gallery__nav bio-gallery__nav--next"
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next image"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={current.id + "-caption"}
            className="bio-gallery__caption"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {current.caption}
          </motion.p>
        </AnimatePresence>

        <div className="bio-gallery__controls">
          <div className="bio-gallery__dots" role="tablist" aria-label="Gallery slides">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1} of ${total}`}
                className={
                  i === index
                    ? "bio-gallery__dot bio-gallery__dot--active"
                    : "bio-gallery__dot"
                }
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <p className="bio-gallery__counter" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && current && (
          <motion.div
            className="bio-gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="bio-gallery-lightbox__panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="bio-gallery-lightbox__close"
                onClick={closeLightbox}
                aria-label="Close viewer"
              >
                ✕
              </button>

              <div className="bio-gallery-lightbox__stage">
                <button
                  type="button"
                  className="bio-gallery__nav bio-gallery__nav--prev"
                  onClick={goPrev}
                  disabled={!hasPrev}
                  aria-label="Previous image"
                >
                  <ChevronIcon direction="left" />
                </button>

                <div className="bio-gallery-lightbox__frame">
                  <img
                    src={current.imageUrl}
                    alt={current.alt || current.caption}
                    className="bio-gallery-lightbox__image"
                    draggable={false}
                  />
                </div>

                <button
                  type="button"
                  className="bio-gallery__nav bio-gallery__nav--next"
                  onClick={goNext}
                  disabled={!hasNext}
                  aria-label="Next image"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>

              <p className="bio-gallery-lightbox__caption">{current.caption}</p>
              <p className="bio-gallery-lightbox__counter">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
