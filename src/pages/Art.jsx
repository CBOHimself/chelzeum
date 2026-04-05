import { useState, useMemo, useEffect } from "react";
import artworksData from "../data/artworks.json";
import ArtworkViewer from "../components/ArtworkViewer/ArtworkViewer";
import ArtworkGrid from "../components/ArtworkGrid/ArtworkGrid";
import ArtworkFilters from "../components/ArtworkFilters/ArtworkFilters";
import Pagination from "../components/Pagination/Pagination";

const ARTWORKS_PER_PAGE = 9;

function sortArtworksNewestFirst(list) {
  return [...list].sort((a, b) => {
    const yA = Number(a.year) || 0;
    const yB = Number(b.year) || 0;
    if (yB !== yA) return yB - yA;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });
}

export default function Art() {
  const artworks = useMemo(
    () => sortArtworksNewestFirst(artworksData),
    [artworksData]
  );
  const [activeId, setActiveId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const seen = new Set();
    const order = [];
    for (const a of artworks) {
      if (!seen.has(a.category)) {
        seen.add(a.category);
        order.push(a.category);
      }
    }
    return ["All", ...order];
  }, [artworks]);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? artworks
        : artworks.filter((a) => a.category === activeFilter),
    [artworks, activeFilter]
  );

  const totalPages = Math.ceil(filtered.length / ARTWORKS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ARTWORKS_PER_PAGE;
    return filtered.slice(start, start + ARTWORKS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
    setCurrentPage(1);
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
            {String(filtered.length).padStart(2, "0")} Artworks
          </p>
          <h1 className="art-page-title">Artworks</h1>
        </div>
      </header>

      <ArtworkFilters
        categories={categories}
        active={activeFilter}
        onChange={handleFilterChange}
      />

      <ArtworkGrid
        artworks={paginated}
        activeId={activeId}
        onSelect={handleSelect}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveId(null);
        }}
      />
    </main>
  );
}
