import React, { useState, useEffect } from 'react';
import { 
  Github, 
  ShieldCheck, 
  Menu, 
  X, 
  ExternalLink, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { KaspaLogo } from './KaspaLogo';
import { GitHubRepoMeta } from '../types';
import { GITHUB_REPO_URL, GITHUB_RELEASES_URL } from '../data/kaspaData';

interface NavbarProps {
  repoMeta: GitHubRepoMeta | null;
  onQrClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  repoMeta,
  onQrClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'About Us', href: '#about-us' },
    { label: 'Features', href: '#features' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Latest Release', href: '#releases' },
    { label: 'Installation', href: '#install-guide' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <header 
      id="navbar-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0C0D10]/90 backdrop-blur-md border-b border-[#282C37]/80 py-3 shadow-lg shadow-black/40' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          id="nav-brand-logo"
          href="#" 
          className="flex items-center gap-3 group text-decoration-none"
        >
          <KaspaLogo className="w-9 h-9 rounded-full shadow-sm transition-transform group-hover:scale-105" />
          <span className="font-extrabold text-xl tracking-tight text-[#F3F4F6] group-hover:text-white transition-colors">
            Kaspa<span className="text-[#70C7BA]">Browser</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-[#70C7BA] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#70C7BA] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* GitHub Button */}
          <a
            id="nav-github-star-btn"
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#282C37] text-xs font-mono text-gray-300 hover:text-white hover:border-gray-500 transition-all hover:bg-[#1f222b]"
          >
            <Github className="w-3.5 h-3.5 text-gray-400" />
            <span>GitHub</span>
          </a>

          {/* Quick QR button */}
          <button
            id="nav-qr-btn"
            onClick={onQrClick}
            title="Scan QR on Android phone"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14161C] border border-[#282C37] text-xs font-mono text-gray-300 hover:text-[#70C7BA] hover:border-[#70C7BA]/50 transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          id="nav-mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#14161C] border border-[#282C37] text-gray-300 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="nav-mobile-menu"
          className="lg:hidden bg-[#14161C] border-b border-[#282C37] px-4 pt-3 pb-6 space-y-3 mt-2"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-[#70C7BA] hover:bg-[#0C0D10]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#282C37] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onQrClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#14161C] border border-[#70C7BA]/40 text-[#70C7BA] font-bold text-sm"
            >
              <Radio className="w-4 h-4" />
              Scan QR for Android
            </button>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0C0D10] border border-[#282C37] text-xs font-mono text-gray-300"
            >
              <Github className="w-4 h-4" />
              View GitHub Repository
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
