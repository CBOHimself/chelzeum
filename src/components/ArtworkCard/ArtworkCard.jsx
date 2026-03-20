import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: 10,  transition: { duration: 0.25 } },
};

export default function ArtworkCard({ artwork, isActive, onSelect }) {
  return (
    <motion.article
      variants={cardVariants}
      layout
      onClick={() => onSelect(artwork.id)}
      className={`art-card ${isActive ? "art-card--active" : ""}`}
      aria-label={`View ${artwork.title}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(artwork.id)}
    >
      {/* ── Image ── */}
      <div className="art-card__img-wrap">
        {artwork.imageUrl ? (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="art-card__img"
            loading="lazy"
          />
        ) : (
          <div className="art-card__img-placeholder" />
        )}

        {/* Hover overlay */}
        <div className="art-card__overlay" aria-hidden="true">
          <p className="art-card__overlay-title">{artwork.title}</p>
          <p className="art-card__overlay-sub">View work</p>
        </div>
      </div>

      {/* ── Caption ── */}
      <div className="art-card__caption">
        <h3 className="art-card__title">{artwork.title}</h3>
        <p className="art-card__sub">
          {artwork.year} · {artwork.medium}
        </p>
      </div>
    </motion.article>
  );
}