import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import events from "../data/events.json";
import EventStatusBadge from "../components/EventStatusBadge/EventStatusBadge";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = useMemo(() => events.find((e) => e.id === id), [id]);

  if (!event) {
    return (
      <main className="event-detail-notfound">
        <p className="art-page-count">Event not found</p>
        <button className="viewer-nav-btn" onClick={() => navigate("/events")}>
          ← Back to Events
        </button>
      </main>
    );
  }

  const dateRange = event.endDate
    ? `${formatDate(event.date)} — ${formatDate(event.endDate)}`
    : formatDate(event.date);

  return (
    <main>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="event-detail-back">
          <button
            onClick={() => navigate("/events")}
            className="event-back-btn"
            aria-label="Back to events"
          >
            ← Events
          </button>
        </div>

        <div className="event-detail-hero">
          <div className="event-detail-img-wrap">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="event-detail-img"
              />
            ) : (
              <div className="event-detail-img-placeholder" />
            )}
          </div>

          <div className="event-detail-hero-meta">
            <div className="event-detail-top-row">
              <EventStatusBadge type={event.type} />

              <div className="event-detail-tags">
                {event.tags?.map((tag) => (
                  <span key={tag} className="event-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="event-detail-title">{event.title}</h1>

            <div className="event-detail-meta-row">
              <span className="event-detail-date">{dateRange}</span>
              <span className="event-detail-dot" aria-hidden="true">
                ·
              </span>
              <span className="event-detail-venue">
                {event.venue}, {event.city}
              </span>
            </div>

            {event.inviteUrl && (
              <a
                href={event.inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-outline event-invite-btn"
              >
                RSVP / View Invite →
              </a>
            )}
          </div>
        </div>

        <div className="event-detail-body">
          <div className="event-detail-longdesc">
            {(event.longDescription ?? event.description)
              .split("\n\n")
              .map((para, i) => (
                <p key={i} className="event-detail-para">
                  {para}
                </p>
              ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}