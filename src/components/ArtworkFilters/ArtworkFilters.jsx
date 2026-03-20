export default function ArtworkFilters({ categories, active, onChange }) {
    return (
      <div className="art-filters" role="group" aria-label="Filter artworks by category">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`art-filter-pill ${active === cat ? "art-filter-pill--active" : ""}`}
            aria-pressed={active === cat}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }