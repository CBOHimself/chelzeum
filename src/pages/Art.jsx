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
  const [activeYear, setActiveYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const years = useMemo(() => {
    const seen = new Set();
    for (const a of artworks) {
      const y = a.year != null && a.year !== "" ? String(a.year) : null;
      if (y) seen.add(y);
    }
    const sorted = [...seen].sort((a, b) => Number(b) - Number(a));
    return ["All", ...sorted];
  }, [artworks]);

  const filtered = useMemo(
    () =>
      activeYear === "All"
        ? artworks
        : artworks.filter((a) => String(a.year) === activeYear),
    [artworks, activeYear]
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

  function handleYearChange(year) {
    setActiveYear(year);
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
        <a
          href="https://www.etsy.com/uk/shop/CHELZEUM"
          className="art-page-shop-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shop Now
        </a>
      </header>

      <ArtworkFilters years={years} active={activeYear} onChange={handleYearChange} />

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
