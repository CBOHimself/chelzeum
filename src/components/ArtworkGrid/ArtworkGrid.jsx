import { motion, AnimatePresence } from "framer-motion";
import ArtworkCard from "../ArtworkCard/ArtworkCard";

const containerVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function ArtworkGrid({ artworks, activeId, onSelect }) {
  const isCollapsed = activeId !== null;

  return (
    <motion.div
      className={`art-grid ${isCollapsed ? "art-grid--collapsed" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            isActive={artwork.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}