import { motion } from "framer-motion";

export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="pagination"
      role="navigation"
      aria-label="Page navigation"
    >
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination__arrow"
        aria-label="Previous page"
      >
        ←
      </button>

      <div className="pagination__pages">
        {pages.map((page) => (
          <motion.button
            key={page}
            onClick={() => onChange(page)}
            className={`pagination__page ${
              page === currentPage ? "pagination__page--active" : ""
            }`}
            whileTap={{ scale: 0.92 }}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {String(page).padStart(2, "0")}
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination__arrow"
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}