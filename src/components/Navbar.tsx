import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Gamepad2, 
  LogIn, 
  UserPlus, 
  Coins,
  Menu,
  X 
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const NavLinks = ({ isMobile = false }) => {
    const linkBaseClasses = "flex items-center space-x-2 py-3 px-4 ";
    const linkHoverClasses = "hover:bg-gray-800 hover:text-emerald-400 transition-colors";
    
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center space-x-6'}`}>
        {isAuthenticated ? (
          <>
            {/* Points Display */}
            <div 
              className={`${linkBaseClasses} bg-gray-900 flex items-center space-x-2 ${isMobile ? 'w-full' : ''}`}
            >
              <Coins className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span className="font-semibold text-lg">{user?.points} Points</span>
            </div>

            {/* Games Link */}
            <Link 
              to="/play" 
              className={`${linkBaseClasses} ${linkHoverClasses}`} 
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <span>Games</span>
            </Link>

            {/* Deposit Link */}
            <Link 
              to="/deposit" 
              className={`${linkBaseClasses} ${linkHoverClasses}`} 
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <span>Deposit</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                if (isMobile) closeMobileMenu();
              }}
              className={`${linkBaseClasses} ${linkHoverClasses} w-full text-left bg-red-800 hover:bg-red-700`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login Link */}
            <Link 
              to="/login" 
              className={`${linkBaseClasses} ${linkHoverClasses}`} 
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <LogIn className="w-5 h-5 mr-2" />
              <span>Sign In</span>
            </Link>
            
            {/* Signup Link */}
            <Link 
              to="/signup" 
              className={`${linkBaseClasses} ${linkHoverClasses} bg-gradient-to-r from-emerald-700 to-cyan-800 text-white`}
              onClick={isMobile ? closeMobileMenu : undefined}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <nav 
      className="bg-gradient-to-r from-gray-900 to-black text-white py-4 
      shadow-2xl border-b border-gray-800 relative z-50"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center space-x-2 
          transform transition-all duration-300 
          hover:scale-110 hover:rotate-3 
          perspective-500 group"
        >
          <Gamepad2 
            className="w-8 h-8 text-emerald-400 
            animate-pulse group-hover:animate-spin 
            transition-all duration-500" 
          />
          <span 
            className="text-2xl font-extrabold text-transparent bg-clip-text 
            bg-gradient-to-r from-emerald-400 to-cyan-600 
            tracking-wider group-hover:tracking-widest 
            transition-all duration-300 hidden md:inline"
          >
            Crazy Paisa
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center"
            onClick={closeMobileMenu}
          >
            <div 
              className="bg-gray-900 w-[90%] max-w-md max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <Gamepad2 
                    className="w-8 h-8 text-emerald-400 
                    animate-pulse group-hover:animate-spin 
                    transition-all duration-500" 
                  />
                  <span 
                    className="text-2xl font-extrabold text-transparent bg-clip-text 
                    bg-gradient-to-r from-emerald-400 to-cyan-600 
                    tracking-wider group-hover:tracking-widest 
                    transition-all duration-300"
                  >
                    Crazy Paisa
                  </span>
                </div>
                <button 
                  onClick={closeMobileMenu}
                  className="text-white focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <NavLinks isMobile={true} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;