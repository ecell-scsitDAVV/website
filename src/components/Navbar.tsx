
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effect to lock/unlock body scroll when mobile menu is opened/closed
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // Lock scrolling
    } else {
      document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-4 transition-all duration-300 ease-in-out ${
          isScrolled ? 'md:bg-white/30 md:backdrop-blur-lg dark:bg-black/30 dark:backdrop-blur-lg bg-white/80 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* E-Cell Logo */}
            <a 
              href="#" 
              className="flex items-center"
            >
              <img 
                src="/lovable-uploads/499b3589-d0d9-48f7-80dd-6ce910174b88.png"
                alt="E-Cell Logo" 
                className="h-12 w-auto" 
              />
            </a>
            
            {/* SCSIT Logo */}
            <a 
              href="https://scs.dauniv.ac.in/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img 
                src="/lovable-uploads/0f47e3fe-e528-4ba8-8eb0-e8ee09167a92.png"
                alt="SCSIT Logo" 
                className="h-12 w-auto" 
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/#about"
              className="text-sm font-medium hover:text-black/70 dark:hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              About
            </Link>
            <Link
              to="/#initiatives"
              className="text-sm font-medium hover:text-black/70 dark:hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              Initiatives
            </Link>
            <Link
              to="/gallery"
              className="text-sm font-medium hover:text-black/70 dark:hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              Gallery
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium hover:text-black/70 dark:hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              Blog
            </Link>
            <Link
              to="/team"
              className="text-sm font-medium hover:text-black/70 dark:hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              Team
            </Link>
            <Link
              to="/#contact"
              className="text-sm font-medium hover:text-black/70 dark:hover:text-white/70 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <span 
              className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span 
              className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ease-in-out ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span 
              className={`block w-6 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay with blur effect */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/70 dark:bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center space-y-8">
              <Link
                to="/#about"
                className="text-2xl font-medium text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/#initiatives"
                className="text-2xl font-medium text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Initiatives
              </Link>
              <Link
                to="/gallery"
                className="text-2xl font-medium text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                to="/blog"
                className="text-2xl font-medium text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/team"
                className="text-2xl font-medium text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Team
              </Link>
              <Link
                to="/#contact"
                className="text-2xl font-medium text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/admin"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
