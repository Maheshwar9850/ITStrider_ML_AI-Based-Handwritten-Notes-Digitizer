import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function FAB({ icon: Icon, onClick, className, ...props }) {
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-16 h-16 rounded-full",
        "bg-deep-indigo/60 backdrop-blur-xl border border-teal-glow/50 text-white shadow-glass-glow cursor-pointer",
        "hover:bg-deep-indigo/80 hover:border-teal-glow",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-7 h-7 stroke-[1.5]" />}
    </motion.button>
  );
}
