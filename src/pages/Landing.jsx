import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Sparkles, Scan, FileText, Cpu } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 mt-12 w-full px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40 leading-tight"
        >
          Intelligence,<br />Materialized.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-light"
        >
          Transform physical documents into structured, AI-ready data with a single snap.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <Button 
            glow 
            className="mt-8 px-10 py-5 text-xl rounded-full"
            onClick={() => navigate('/upload')}
          >
            <Sparkles className="mr-3 w-6 h-6 text-teal-glow" /> 
            <span className="font-semibold tracking-wide">Start Digitizing</span>
          </Button>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <Card tilt className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-glow/20 flex items-center justify-center mb-4">
            <Scan className="w-8 h-8 text-teal-glow" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">1. Capture</h3>
          <p className="text-white/60 leading-relaxed">Upload or snap a photo of your receipt, document, or handwritten note.</p>
        </Card>
        
        <Card tilt className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <Cpu className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">2. Process</h3>
          <p className="text-white/60 leading-relaxed">Our AI extracts the raw text using state-of-the-art OCR technology with extreme precision.</p>
        </Card>
        
        <Card tilt className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-indigo-300" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">3. Structure</h3>
          <p className="text-white/60 leading-relaxed">Data is intelligently formatted into clean, searchable, and exportable Markdown notes.</p>
        </Card>
      </section>
    </div>
  );
}
