import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { UploadCloud, ChevronDown, CheckCircle2, ArrowRight, Search, FileText } from 'lucide-react';

const ALL_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 
  'Portuguese', 'Japanese', 'Korean', 'Chinese', 
  'Russian', 'Arabic', 'Hindi', 'Dutch', 'Turkish'
];

export default function Upload() {
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');
  
  // PDF state
  const [isPdf, setIsPdf] = useState(false);
  const [scanAll, setScanAll] = useState(true);
  const [pageSelection, setPageSelection] = useState('1, 3-5');

  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (langOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [langOpen]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const isFilePdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    setIsPdf(isFilePdf);
    
    if (selectedFile.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setFile({ file: selectedFile, url: imageUrl, isPdf: false });
    } else if (isFilePdf) {
      // Mocking 6 pages for the PDF previewer
      setFile({ file: selectedFile, isPdf: true, pages: [1, 2, 3, 4, 5, 6] });
    }
  };

  const processFile = () => {
    navigate('/processing', { state: { isPdf, pageCount: isPdf ? file.pages.length : 1 } });
  };

  const filteredLanguages = ALL_LANGUAGES.filter(lang => 
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center space-y-8 px-4 py-8">
      <div className="text-center space-y-4 max-w-xl mb-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-white/60 text-lg">Drag and drop your image or PDF. We'll extract and structure the data instantly.</p>
      </div>

      <div className="w-full max-w-3xl relative">
        <div className="absolute -top-6 right-6 md:right-10 z-40">
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-2 bg-[#1e1b4b]/80 backdrop-blur-xl border border-teal-glow/40 rounded-2xl px-5 py-3 hover:bg-white/20 transition-all shadow-[0_4px_20px_rgba(20,184,166,0.2)] hover:shadow-[0_4px_25px_rgba(20,184,166,0.4)]"
            >
              <span className="text-sm font-semibold tracking-wide text-white/90">{language}</span>
              <ChevronDown className={`w-4 h-4 text-teal-glow transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute top-full right-0 mt-4 w-72 bg-[#0a0f1d]/60 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05),0_30px_60px_rgba(0,0,0,0.6)] flex flex-col"
                >
                  <div className="p-4 border-b border-white/10 relative flex items-center bg-white/5">
                    <Search className="w-5 h-5 text-white/50 absolute left-6" />
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search language..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-sm pl-10 pr-2 py-1"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto p-3 flex flex-col gap-1 CustomScrollbar">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map(lang => (
                        <button 
                          key={lang}
                          onClick={() => { setLanguage(lang); setLangOpen(false); }}
                          className="w-full text-left px-5 py-3.5 text-sm font-medium rounded-2xl text-white/80 transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-indigo-500/20"
                        >
                          {lang}
                        </button>
                      ))
                    ) : (
                      <div className="py-6 text-center text-white/40 text-sm font-light">No languages found.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          animate={{ scale: isHovering ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-full relative rounded-3xl overflow-hidden glass-panel border-2 transition-colors duration-300 ${isHovering ? 'border-teal-glow bg-teal-glow/10 shadow-glass-glow' : 'border-white/20'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="p-8 md:p-14 pt-16 flex flex-col items-center space-y-8">
              
              {isPdf ? (
                <div className="w-full flex flex-col items-center">
                  {/* Floating Stack of Cards Icon */}
                  <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <motion.div 
                      animate={{ y: [-5, 5, -5], rotateZ: -10 }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-20 h-24 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl left-2 top-2 shadow-glass"
                    />
                    <motion.div 
                      animate={{ y: [-5, 5, -5], rotateZ: 10 }} 
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-20 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl right-2 top-4 shadow-glass"
                    />
                    <motion.div 
                      animate={{ y: [-5, 5, -5], scale: 1.1 }} 
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 w-24 h-28 bg-deep-indigo/60 backdrop-blur-xl border border-teal-glow/50 rounded-xl flex items-center justify-center shadow-glass-glow"
                    >
                      <FileText className="w-10 h-10 text-teal-glow drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                      <div className="absolute -bottom-2 -right-2 bg-teal-glow text-[#1e1b4b] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#1e1b4b]">
                        {file.pages.length}
                      </div>
                    </motion.div>
                  </div>

                  {/* Weightless Carousel Previewer */}
                  <div className="w-full max-w-2xl px-2">
                    <div className="flex overflow-x-auto gap-4 pb-6 CustomScrollbar items-center snap-x">
                      {file.pages.map(pageNum => (
                        <motion.div 
                          key={pageNum}
                          whileHover={{ y: -10, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="snap-center flex-shrink-0 w-36 h-48 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center flex-col relative group cursor-pointer shadow-glass"
                        >
                          <div className="w-10 h-12 bg-white/10 border border-white/10 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                            <div className="w-6 h-1 bg-white/20 rounded absolute top-2 left-2"></div>
                            <div className="w-4 h-1 bg-white/20 rounded absolute top-4 left-2"></div>
                            <div className="w-6 h-1 bg-white/20 rounded absolute top-6 left-2"></div>
                          </div>
                          <span className="text-white/60 font-medium text-sm">Page {pageNum}</span>
                          <div className="absolute inset-0 bg-teal-glow/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Page Selection Toggle */}
                  <div className="w-full max-w-lg mt-4 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between shadow-glass">
                    <label className="flex items-center space-x-4 cursor-pointer mb-4 md:mb-0">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={scanAll} onChange={() => setScanAll(!scanAll)} />
                        <div className={`block w-12 h-6 rounded-full transition-colors ${scanAll ? 'bg-teal-glow/80 shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-white/10'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${scanAll ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <span className="text-white/80 font-medium whitespace-nowrap">Scan All Pages</span>
                    </label>

                    <AnimatePresence>
                      {!scanAll && (
                        <motion.div 
                          initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                          animate={{ opacity: 1, width: 'auto', marginLeft: 16 }}
                          exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                          className="flex items-center space-x-3 overflow-hidden"
                        >
                          <span className="text-sm text-white/50 whitespace-nowrap">Pages:</span>
                          <input 
                            type="text" 
                            value={pageSelection}
                            onChange={(e) => setPageSelection(e.target.value)}
                            placeholder="e.g. 1, 3-5"
                            className="w-32 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-teal-glow transition-colors shadow-inner"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <img src={file.url} alt="Preview" className="w-full h-auto object-cover max-h-72" />
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full p-2 shadow-lg border border-teal-glow/30">
                    <CheckCircle2 className="w-6 h-6 text-teal-glow drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                  </div>
                </div>
              )}

              <p className="text-white/80 font-medium truncate max-w-xs">{file.file.name}</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
                <Button onClick={() => setFile(null)} className="px-6 py-3 bg-white/5 w-full sm:w-auto hover:bg-white/10">
                  Cancel
                </Button>
                <Button glow onClick={processFile} className="px-8 py-3 flex items-center justify-center w-full sm:w-auto">
                  <span className="font-semibold">{isPdf ? 'Extract PDF Data' : 'Extract Image Text'}</span> <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="p-16 md:p-24 pt-20 flex flex-col items-center justify-center text-center cursor-pointer min-h-[400px]"
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-teal-glow/20 flex items-center justify-center mb-8 shadow-glass-glow border border-teal-glow/30"
              >
                <UploadCloud className="w-10 h-10 text-teal-glow" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Drag & Drop Image or PDF</h3>
              <p className="text-white/50 max-w-xs font-light">Supported formats: PDF, JPG, PNG, WEBP. Max size: 25MB.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                className="hidden" 
                accept="image/*,.pdf,application/pdf" 
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
