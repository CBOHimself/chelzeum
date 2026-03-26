export default function EventStatusBadge({ type }) {
    const isUpcoming = type === "upcoming";
    return (
      <span
        className={`event-status-badge ${
          isUpcoming ? "event-status-badge--upcoming" : "event-status-badge--past"
        }`}
      >
        {isUpcoming ? "Upcoming" : "Past"}
      </span>
    );
  }