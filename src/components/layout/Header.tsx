
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'bg-white/80 backdrop-blur-md border-b' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-medium text-xl"
        >
          <Clock className="h-6 w-6 text-primary" />
          <span className="inline-block animate-fade-in">TimeFlow</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                location.pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/70 hover:text-foreground hover:bg-accent'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-foreground"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white animate-fade-in">
          <div className="container mx-auto px-4 pt-20 pb-6">
            <div className="flex flex-col space-y-3">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'px-4 py-3 rounded-md text-base font-medium transition-all duration-200',
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link
                to="/login"
                className="px-4 py-3 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-3 rounded-md text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
