import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import Card from '../components/ui/Card';

const mockNotes = [
  { id: 1, title: 'Meeting Notes', date: 'Oct 12', color: 'from-purple-500/20 to-indigo-500/20' },
  { id: 2, title: 'Grocery Receipt', date: 'Oct 11', color: 'from-teal-500/20 to-emerald-500/20', height: 'h-[300px]' },
  { id: 3, title: 'Whiteboard Scan', date: 'Oct 10', color: 'from-blue-500/20 to-cyan-500/20', height: 'h-[200px]' },
  { id: 4, title: 'Invoice #002', date: 'Oct 08', color: 'from-rose-500/20 to-orange-500/20' },
  { id: 5, title: 'Journal Entry', date: 'Oct 07', color: 'from-fuchsia-500/20 to-pink-500/20', height: 'h-[350px]' },
];

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="w-full flex-grow flex flex-col px-4 py-8 relative">
      <div className="sticky top-0 z-40 mb-12 pt-6">
        <div className="w-full max-w-3xl mx-auto glass-panel rounded-full flex items-center px-6 py-4 shadow-glass-glow border-teal-glow/30">
          <Search className="w-6 h-6 text-white/50 mr-4" />
          <input 
            type="text" 
            placeholder="Search your structured notes..." 
            className="flex-grow bg-transparent border-none outline-none text-white text-lg placeholder-white/40"
          />
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2 bg-white/5">
            <Filter className="w-5 h-5 text-teal-glow" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
        {mockNotes.map(item => (
          <motion.div
            layoutId={`card-container-${item.id}`}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className="cursor-pointer break-inside-avoid relative group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Card className={`bg-gradient-to-br ${item.color} ${item.height || 'h-[250px]'} flex flex-col justify-between border-white/10 group-hover:border-white/30 transition-colors shadow-glass`}>
              <div>
                <motion.h3 layoutId={`title-${item.id}`} className="text-2xl font-bold tracking-tight">{item.title}</motion.h3>
                <motion.p layoutId={`date-${item.id}`} className="text-white/60 mt-2 font-medium">{item.date}</motion.p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center self-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white/70">↗</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedId(null)}
          >
            {(() => {
              const item = mockNotes.find(n => n.id === selectedId);
              return (
                <motion.div
                  layoutId={`card-container-${item.id}`}
                  className={`w-full max-w-4xl glass-panel bg-gradient-to-br ${item.color} rounded-[2rem] p-10 md:p-14 relative shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-y-auto max-h-[90vh]`}
                  onClick={e => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setSelectedId(null)}
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md z-10 shadow-lg border border-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <motion.h2 layoutId={`title-${item.id}`} className="text-5xl font-black tracking-tight mb-4">{item.title}</motion.h2>
                  <motion.p layoutId={`date-${item.id}`} className="text-white/60 mb-10 text-xl font-medium">{item.date}</motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6 text-white/80 leading-relaxed font-light text-lg"
                  >
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                    <p>Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
                    
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 my-8 shadow-inner">
                      <h4 className="font-bold text-white mb-4 text-xl flex items-center">
                        <span className="text-teal-glow mr-3 text-2xl">•</span> Key Takeaways
                      </h4>
                      <ul className="space-y-3 pl-2">
                        <li className="flex items-start"><span className="text-teal-glow mr-2">✓</span> AI extraction is highly accurate</li>
                        <li className="flex items-start"><span className="text-teal-glow mr-2">✓</span> Markdown supports rich text formatting</li>
                        <li className="flex items-start"><span className="text-teal-glow mr-2">✓</span> Glassmorphism improves readability</li>
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
