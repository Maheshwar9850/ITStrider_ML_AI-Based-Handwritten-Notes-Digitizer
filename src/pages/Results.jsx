import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import FAB from '../components/ui/FAB';
import { Save, Edit2, Languages, ArrowLeft, FileText } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPdf = location.state?.isPdf || false;
  const pageCount = location.state?.pageCount || 1;
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full flex-grow flex flex-col relative py-8 md:py-12 px-2 md:px-6 h-full min-h-[80vh]">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="absolute top-0 left-4 p-2 text-white/50 hover:text-white transition-colors z-50 flex items-center space-x-2"
      >
        <ArrowLeft className="w-5 h-5" /> <span>To Dashboard</span>
      </button>

      <div className="w-full flex-grow flex flex-col lg:flex-row gap-6 mt-12 mb-8">
        
        {/* Document Navigator for PDEs */}
        {isPdf && (
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex lg:flex-col gap-3 overflow-y-auto lg:h-[700px] w-full lg:w-24 p-3 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-glass shrink-0 CustomScrollbar items-center"
          >
            {Array.from({ length: pageCount }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-14 h-16 shrink-0 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-teal-glow/80 text-white shadow-glass-glow border border-teal-glow scale-105' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-transparent'
                  }`}
                >
                  <FileText className={`w-5 h-5 mb-1.5 ${isActive ? 'text-white' : ''}`} />
                  <span className="text-xs font-bold">{pageNum}</span>
                </button>
              );
            })}
          </motion.div>
        )}

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden h-full">
          {/* Left Pane: Raw OCR */}
          <motion.div
            key={`raw-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col h-[500px] lg:h-[700px] min-w-0"
          >
            <h2 className="text-xl font-semibold mb-4 text-white/80 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-soft-purple mr-3 shadow-[0_0_10px_#6b21a8]"></span> Raw Text Extract {isPdf && <span className="ml-2 text-white/40 text-sm">(Page {currentPage})</span>}
            </h2>
            <Card className="flex-grow overflow-y-auto p-8 font-mono text-sm md:text-base text-white/70 leading-relaxed bg-black/20 border-white/10 CustomScrollbar">
              {isPdf ? <div className="text-teal-glow/80 mb-4">[ PAGE {currentPage} DATA ]</div> : ''}
              12/04/2026<br/>
              Grocery Mart<br/>
              <br/>
              Apples - $4.99<br/>
              Bananas - $1.99<br/>
              Oat Milk - $5.49<br/>
              Coffee Beans - $12.99<br/>
              <br/>
              SUBTOTAL: $25.46<br/>
              TAX: $2.10<br/>
              TOTAL: $27.56
            </Card>
          </motion.div>

          {/* Right Pane: AI Structured */}
          <motion.div
            key={`ai-${currentPage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="flex flex-col h-[500px] lg:h-[700px] relative min-w-0"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center drop-shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-glow mr-3 animate-pulse shadow-[0_0_10px_#14b8a6]"></span> AI Structured Data {isPdf && <span className="ml-2 text-white/40 text-sm">(Page {currentPage})</span>}
            </h2>
            <Card className="flex-grow overflow-y-auto p-8 lg:p-12 relative bg-white/5 CustomScrollbar">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">Grocery Receipt {isPdf ? `Pg. ${currentPage}` : ''}</h1>
              <p className="text-white/60 mb-8 flex items-center text-lg"><span className="mr-2 opacity-80">📅</span> Dec 4, 2026</p>
              
              <div className="space-y-4 text-lg">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/90">Apples</span><span className="font-medium">$4.99</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/90">Bananas</span><span className="font-medium">$1.99</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/90">Oat Milk</span><span className="font-medium">$5.49</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/90">Coffee Beans</span><span className="font-medium">$12.99</span>
                </div>
                <div className="flex justify-between pt-6 font-bold text-teal-glow text-2xl drop-shadow-sm">
                  <span>Total</span><span>$27.56</span>
                </div>
              </div>

              {/* Summary Block */}
              <div className="mt-12 p-6 rounded-2xl bg-teal-glow/10 border border-teal-glow/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.1)]">
                <h4 className="font-bold text-teal-glow mb-2 text-lg">AI Summary</h4>
                <p className="text-white/80 leading-relaxed">A standard grocery run totaling $27.56. Coffee beans account for nearly 50% of the total cost.</p>
              </div>
            </Card>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-[-20px] lg:bottom-8 right-0 lg:-right-6 flex flex-row lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 justify-end">
              <FAB icon={Languages} onClick={() => {}} className="bg-soft-purple/60 border-soft-purple hover:bg-soft-purple/80 w-12 h-12" />
              <FAB icon={Edit2} onClick={() => {}} className="bg-white/20 border-white/40 hover:bg-white/30 w-12 h-12" />
              <FAB icon={Save} onClick={() => navigate('/dashboard')} className="w-16 h-16 shadow-[0_0_20px_rgba(20,184,166,0.5)] bg-teal-glow/80" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
