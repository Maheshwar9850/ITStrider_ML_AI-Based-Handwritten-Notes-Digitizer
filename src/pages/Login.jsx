import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Globe, Mail, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center px-4 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 p-2 text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <Card className="w-full max-w-md">
        <div className="text-center mb-8 relative h-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'login'}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute w-full"
            >
              <h2 className="text-3xl font-bold tracking-tight">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-white/60 mt-1">{isSignUp ? 'Start your journey today' : 'Enter your details to proceed'}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 mt-4">
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal-glow transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal-glow transition-colors"
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-teal-glow transition-colors"
          />
          
          <Button glow className="w-full mt-6 py-3 rounded-xl" type="submit">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/40 text-sm">or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button className="w-full flex items-center justify-center space-x-2 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl py-3">
              <Mail className="w-5 h-5" /> <span>Google</span>
            </Button>
            <Button className="w-full flex items-center justify-center space-x-2 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl py-3">
              <Globe className="w-5 h-5" /> <span>GitHub</span>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </Card>
    </div>
  );
}
