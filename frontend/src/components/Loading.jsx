import React from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white relative overflow-hidden">
      {/* Animation Confetti */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="confetti"></div>
      </div>

      {/* Spinning Doll Icon */}
      <div className="flex flex-col items-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="w-32 h-32 border-t-8 border-red-500 border-dashed rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046874.png" 
            alt="popcorn"
            className="w-20 h-20 animate-bounce"
          />

          </div>
        </div>

        {/* POP CORN Text */}
        <h1 className="text-6xl font-extrabold text-red-500 tracking-widest animate-pulse">
          POP CORN
        </h1>
      </div>
    </div>
  );
}

export default Loading;
