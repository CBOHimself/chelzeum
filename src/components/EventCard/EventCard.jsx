import { motion } from "framer-motion";
import EventStatusBadge from "../EventStatusBadge/EventStatusBadge";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.25 } },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventCard({ event, onSelect }) {
  const isPast = event.type === "past";
  const summaryText = event.longDescription || event.description;

  return (
    <motion.article
      variants={cardVariants}
      layout
      onClick={() => onSelect(event.id)}
      className={`event-card ${isPast ? "event-card--past" : ""}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(event.id)}
      aria-label={`View details for ${event.title}`}
    >
      {/* ── Image ── */}
      <div className="event-card__img-wrap">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="event-card__img"
            loading="lazy"
          />
        ) : (
          <div className="event-card__img-placeholder" />
        )}
        <div className="event-card__overlay" aria-hidden="true">
          <span className="event-card__overlay-label">View Event →</span>
        </div>
      </div>

      {/* ── Meta ── */}
      <div className="event-card__meta">
        <div className="event-card__top-row">
          <EventStatusBadge type={event.type} />
          <div className="event-card__tags">
            {event.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="event-tag event-tag--small">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="event-card__title">{event.title}</h3>

        <p className="event-card__date">
          {formatDate(event.date)}
          {event.endDate && ` — ${formatDate(event.endDate)}`}
        </p>

        <p className="event-card__venue">
          {event.venue} · {event.city}
        </p>

        <p className="event-card__desc">{summaryText}</p>
      </div>
    </motion.article>
  );
}