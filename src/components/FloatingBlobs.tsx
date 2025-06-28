import React from 'react';

const FloatingBlobs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Blob 1 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#A5E3D8]/20 rounded-full blur-3xl animate-float-slow"></div>
      
      {/* Floating Blob 2 */}
      <div className="absolute top-40 right-20 w-80 h-80 bg-[#C2E7FF]/15 rounded-full blur-3xl animate-float-medium"></div>
      
      {/* Floating Blob 3 */}
      <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-[#FFF6B3]/20 rounded-full blur-3xl animate-float-fast"></div>
      
      {/* Floating Blob 4 */}
      <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-[#D2F8D2]/15 rounded-full blur-3xl animate-float-slow"></div>
    </div>
  );
};

export default FloatingBlobs;