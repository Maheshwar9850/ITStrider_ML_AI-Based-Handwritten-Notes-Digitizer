import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { LogIn } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="mesh-bg" />
      <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Antigravity Header */}
        <header className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-lg border-b border-white/10 px-8 py-4 flex justify-between items-center transition-all duration-300 pt-5 pb-5">
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <motion.h1 
              className="text-3xl font-black tracking-tight font-sans drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
              whileHover={{ textShadow: "0px 0px 20px rgba(255,255,255,0.8)" }}
              style={{
                background: 'linear-gradient(to bottom right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              NoteScribe
            </motion.h1>
          </motion.div>

          {location.pathname !== '/login' && (
            <Button glow onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-full text-sm font-bold border border-white/30 bg-white/5 backdrop-blur-xl shadow-glass">
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Button>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </>
  );
}
