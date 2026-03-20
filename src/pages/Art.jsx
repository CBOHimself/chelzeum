import { useState, useMemo } from "react";
import artworks from "../data/artworks.json";
import ArtworkViewer from "../components/ArtworkViewer/ArtworkViewer";
import ArtworkGrid from "../components/ArtworkGrid/ArtworkGrid";
import ArtworkFilters from "../components/ArtworkFilters/ArtworkFilters";

const CATEGORIES = ["All", ...new Set(artworks.map((a) => a.category))];

export default function Art() {
  const [activeId, setActiveId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? artworks
        : artworks.filter((a) => a.category === activeFilter),
    [activeFilter]
  );

  const activeIndex = filtered.findIndex((a) => a.id === activeId);
  const activeArtwork = activeIndex !== -1 ? filtered[activeIndex] : null;

  function handleSelect(id) {
    setActiveId(id);
  }

  function handleClose() {
    setActiveId(null);
  }

  function handleNavigate(dir) {
    const next = filtered[activeIndex + dir];
    if (next) setActiveId(next.id);
  }

  function handleFilterChange(cat) {
    setActiveFilter(cat);
    setActiveId(null);
  }

  return (
    <main>
      <ArtworkViewer
        artwork={activeArtwork}
        index={activeIndex}
        total={filtered.length}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />

      <header className="art-page-header">
        <div>
          <p className="art-page-count">
            {String(filtered.length).padStart(2, "0")} Works
          </p>
          <h1 className="art-page-title">Works</h1>
        </div>
      </header>

      <ArtworkFilters
        categories={CATEGORIES}
        active={activeFilter}
        onChange={handleFilterChange}
      />

      <ArtworkGrid
        artworks={filtered}
        activeId={activeId}
        onSelect={handleSelect}
      />
    </main>
  );
}