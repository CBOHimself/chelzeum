import { motion, AnimatePresence } from "framer-motion";
import EventCard from "../EventCard/EventCard";

const containerVariants = {
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function EventGrid({ events, onSelect }) {
  return (
    <motion.div
      className="event-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onSelect={onSelect} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}