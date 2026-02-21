import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

export default function Art() {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold text-text-light">Art</h1>
      <Outlet />
    </motion.div>
  );
}
