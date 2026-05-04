export default function ArtworkFilters({ years, active, onChange }) {
  return (
    <div className="art-filters" role="group" aria-label="Filter artworks by year">
      {years.map((y) => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className={`art-filter-pill ${active === y ? "art-filter-pill--active" : ""}`}
          aria-pressed={active === y}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
