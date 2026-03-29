import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArtworkViewer({
  artwork,
  index,
  total,
  onClose,
  onNavigate,
}) {
  const viewerRef = useRef(null);

  // Scroll into view when artwork opens
  const isOpen = artwork !== null;

  function handleOpen(node) {
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={(node) => {
            viewerRef.current = node;
            if (node) handleOpen(node);
          }}
          key="viewer"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: "hidden" }}
          className="viewer-root"
        >
          <div className="viewer-inner">
            {/* ── Image panel ── */}
            <div className="viewer-image-panel">
              {artwork.imageUrl ? (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="viewer-image"
                />
              ) : (
                <div className="viewer-image-placeholder">
                  <span>{artwork.title}</span>
                </div>
              )}

              {/* Multi-image dots — future: pass images array */}
              <div className="viewer-dots">
                <span className="viewer-dot active" />
              </div>
            </div>

            {/* ── Meta panel ── */}
            <div className="viewer-meta">
              <div className="viewer-meta-content">
                <motion.p
                  key={artwork.id + "-index"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="viewer-index-label"
                >
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </motion.p>

                <motion.h2
                  key={artwork.id + "-title"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="viewer-title"
                >
                  {artwork.title}
                </motion.h2>

                <motion.p
                  key={artwork.id + "-year"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.28 }}
                  className="viewer-year"
                >
                  {artwork.year}
                </motion.p>

                <motion.p
                  key={artwork.id + "-medium"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.32 }}
                  className="viewer-medium"
                >
                  {artwork.medium}
                  {artwork.dimensions && ` · ${artwork.dimensions}`}
                </motion.p>

                {artwork.description && (
                  <motion.p
                    key={artwork.id + "-desc"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.38 }}
                    className="viewer-desc"
                  >
                    {artwork.description}
                  </motion.p>
                )}
              </div>

              {/* ── Navigation ── */}
              <div className="viewer-nav">
                <button
                  onClick={() => onNavigate(-1)}
                  disabled={!hasPrev}
                  className="viewer-nav-btn"
                  aria-label="Previous artwork"
                >
                  ← Prev
                </button>
                <button
                  onClick={onClose}
                  className="viewer-close-btn"
                  aria-label="Close viewer"
                >
                  Close ✕
                </button>
                <button
                  onClick={() => onNavigate(1)}
                  disabled={!hasNext}
                  className="viewer-nav-btn"
                  aria-label="Next artwork"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}