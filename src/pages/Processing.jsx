import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScanText, Zap, LayoutList, Layers } from 'lucide-react';

export default function Processing() {
  const [step, setStep] = useState(0);
  const [pagesProcessed, setPagesProcessed] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const isPdf = location.state?.isPdf || false;
  const pageCount = location.state?.pageCount || 1;

  const steps = isPdf ? [
    { label: "Parsing PDF Document", icon: ScanText },
    { label: "Extracting Pages", icon: Layers },
    { label: "AI OCR & Structuring", icon: LayoutList }
  ] : [
    { label: "Scanning Document", icon: ScanText },
    { label: "Extracting Raw Text", icon: Zap },
    { label: "AI Structuring Data", icon: LayoutList }
  ];

  useEffect(() => {
    // Simulate multi-step processing sequence
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 2500);

    const timer2 = setTimeout(() => {
      setStep(2);
    }, 5000);

    const timer3 = setTimeout(() => {
      navigate('/results', { state: { isPdf, pageCount } });
    }, 8500);

    // Simulate page processing counter
    let intervalId;
    if (isPdf) {
      intervalId = setInterval(() => {
        setPagesProcessed(prev => {
          if (prev < pageCount) return prev + 1;
          return prev;
        });
      }, 7000 / pageCount);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (intervalId) clearInterval(intervalId);
    };
  }, [navigate, isPdf, pageCount]);

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center p-4">
      {/* 3D-style Holographic Loader Animation */}
      <div className="relative flex items-center justify-center mb-28 mt-8">
        
        {/* Floating Page Counter for PDFs */}
        <AnimatePresence>
          {isPdf && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap glass-panel px-6 py-2 rounded-full border-teal-glow/50 shadow-glass-glow z-50 flex items-center space-x-2"
            >
              <div className="w-2 h-2 rounded-full bg-teal-glow animate-pulse"></div>
              <span className="text-teal-glow font-bold tracking-wide">
                Page {pagesProcessed} of {pageCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Holographic Pulses */}
        <motion.div 
          animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute w-48 h-48 rounded-full bg-teal-glow/20 blur-xl"
        />
        
        <motion.div
          animate={{ rotateX: 60, rotateZ: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-56 h-56 rounded-full border-2 border-teal-glow/30 border-t-teal-glow shadow-[0_0_40px_rgba(20,184,166,0.3)] absolute"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ rotateX: 60, rotateZ: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-40 h-40 rounded-full border-2 border-soft-purple/30 border-b-soft-purple/80 shadow-[0_0_30px_rgba(107,33,168,0.4)]"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-20 h-20 rounded-full bg-[#1e1b4b] border border-white/20 flex items-center justify-center shadow-glass-glow"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {(() => {
                const Icon = steps[step]?.icon || Zap;
                return <Icon className="w-10 h-10 text-teal-glow drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />;
              })()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress Stepper */}
      <div className="w-full max-w-md space-y-8">
        {steps.map((s, idx) => {
          const isActive = idx === step;
          const isDone = idx < step;
          const Icon = s.icon;

          return (
            <div key={idx} className="flex items-center space-x-6">
              <motion.div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                  isActive ? 'bg-teal-glow text-white shadow-glass-glow border border-teal-glow/50' : 
                  isDone ? 'bg-teal-glow/20 text-teal-glow border border-teal-glow/20' : 'bg-white/5 text-white/30 border border-white/5'
                }`}
                animate={isActive ? { scale: [1, 1.05, 1], y: [0, -2, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <div className="flex-grow">
                <h4 className={`text-xl font-bold transition-colors duration-500 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : isDone ? 'text-white/80' : 'text-white/30'}`}>
                  {s.label}
                </h4>
                {isActive && (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    transition={{ duration: 2.5, ease: "linear" }}
                    className="h-1.5 mt-3 bg-teal-glow rounded-full shadow-[0_0_12px_#14b8a6]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
