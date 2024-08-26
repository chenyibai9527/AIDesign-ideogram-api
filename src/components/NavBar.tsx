"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';

export default function NavBar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [credits, setCredits] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/credits')
        .then(res => res.json())
        .then(data => setCredits(data.credits))
        .catch(error => console.error('Error fetching credits:', error));
    }
  }, [session]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition duration-150">
            <Image
              src="/logo.png"
              alt="AIDesign Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold hidden md:inline text-gray-800 dark:text-white">AIDesign</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/generate" className={`text-lg font-semibold transition duration-300 relative group ${isScrolled ? 'text-gray-800' : 'text-green-500'}`}>
              Create
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/pricing" className={`text-lg font-semibold transition duration-300 relative group ${isScrolled ? 'text-gray-800' : 'text-green-500'}`}>
              Pricing
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            {session ? (
              <div 
                className="relative" 
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`flex items-center space-x-2 focus:outline-none ${
                    isScrolled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  } rounded-full px-3 py-1 transition duration-150`}
                >
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className={`hidden md:inline max-w-[100px] truncate ${isScrolled ? 'text-gray-800' : 'text-black-200'}`}>
                    {session.user?.name}
                  </span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaUser className="inline-block mr-2" />
                      Dashboard
                    </Link>
                    <div className="block px-4 py-2 text-sm text-gray-700">
                      <FaCreditCard className="inline-block mr-2" />
                      Credits: {credits}
                    </div>
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FaSignOutAlt className="inline-block mr-2" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => signIn()} className={`text-lg font-semibold transition duration-300 relative group ${isScrolled ? 'text-gray-800' : 'text-green-500'}`}>
                Sign in
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}