import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import events from "../data/events.json";
import EventFilters from "../components/EventFilters/EventFilters";
import EventGrid from "../components/EventGrid/EventGrid";
import Pagination from "../components/Pagination/Pagination";

const FILTERS = ["All", "Upcoming", "Past"];
const EVENTS_PER_PAGE = 4;

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (activeFilter === "All") return sorted;
    return sorted.filter((e) => e.type === activeFilter.toLowerCase());
  }, [activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / EVENTS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * EVENTS_PER_PAGE;
    return filtered.slice(start, start + EVENTS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function handleEventSelect(id) {
    navigate(`/events/${id}`);
  }

  return (
    <main>
      <header className="art-page-header">
        <div>
          <p className="art-page-count">
            {String(filtered.length).padStart(2, "0")} Events
          </p>
          <h1 className="art-page-title">Events</h1>
        </div>
      </header>

      <EventFilters filters={FILTERS} active={activeFilter} onChange={handleFilterChange} />

      <EventGrid events={paginated} onSelect={handleEventSelect} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </main>
  );
}