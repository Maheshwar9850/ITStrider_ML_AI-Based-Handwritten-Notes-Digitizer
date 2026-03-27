import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Button({ children, className, glow = false, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-colors rounded-2xl",
        "bg-white/10 backdrop-blur-md border border-white/20 shadow-glass",
        glow && "shadow-glass-glow bg-white/20 hover:bg-white/30",
        !glow && "hover:bg-white/15",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
