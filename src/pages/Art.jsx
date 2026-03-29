import { useState, useMemo, useEffect } from "react";
import ArtworkViewer from "../components/ArtworkViewer/ArtworkViewer";
import ArtworkGrid from "../components/ArtworkGrid/ArtworkGrid";
import ArtworkFilters from "../components/ArtworkFilters/ArtworkFilters";
import Pagination from "../components/Pagination/Pagination";

const ARTWORKS_PER_PAGE = 9;

const ARTWORKS_URL = `${import.meta.env.BASE_URL}data/artworks.json`;

export default function Art() {
  const [artworks, setArtworks] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetch(ARTWORKS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (!Array.isArray(data)) throw new Error("Invalid artworks format");
        setArtworks(data);
        setLoadStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err.message ?? "Unknown error");
        setLoadStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(artworks.map((a) => a.category))],
    [artworks]
  );

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

  if (loadStatus === "loading") {
    return (
      <main className="art-page art-page--loading">
        <p className="art-page-loading-msg">Loading artworks…</p>
      </main>
    );
  }

  if (loadStatus === "error") {
    return (
      <main className="art-page art-page--error">
        <p className="art-page-error-msg">
          Could not load artworks{loadError ? `: ${loadError}` : ""}.
        </p>
      </main>
    );
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
