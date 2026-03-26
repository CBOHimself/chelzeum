export default function EventFilters({ filters, active, onChange }) {
    return (
      <div
        className="art-filters"
        role="group"
        aria-label="Filter events"
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`art-filter-pill ${active === f ? "art-filter-pill--active" : ""}`}
            aria-pressed={active === f}
          >
            {f}
          </button>
        ))}
      </div>
    );
  }