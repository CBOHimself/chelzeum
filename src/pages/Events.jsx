import { motion } from 'framer-motion';

export default function Events() {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold text-text-light">Events</h1>
    </motion.div>
  );
}
