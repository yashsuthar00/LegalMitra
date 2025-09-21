'use client';

import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export const ResponsiveGrid = ({ children, className = "" }) => {
  const { isMobile, isTablet } = useResponsive();
  
  const gridClass = isMobile 
    ? "grid-cols-1" 
    : isTablet 
    ? "grid-cols-2" 
    : "grid-cols-4";
    
  return (
    <div className={`grid gap-4 md:gap-6 ${gridClass} ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveText = ({ children, className = "" }) => {
  const { isMobile } = useResponsive();
  
  const textSize = isMobile ? "text-sm" : "text-base";
  
  return (
    <div className={`${textSize} ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveCard = ({ children, className = "" }) => {
  const { isMobile } = useResponsive();
  
  const padding = isMobile ? "p-4" : "p-6 md:p-8";
  const margin = isMobile ? "mx-2" : "mx-0";
  
  return (
    <div className={`${padding} ${margin} ${className}`}>
      {children}
    </div>
  );
};