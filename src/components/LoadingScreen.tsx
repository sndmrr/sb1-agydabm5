import React from 'react';
import { Sprout, Leaf, TreePine } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-green-200 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Planting Animation */}
        <div className="mb-8 relative">
          <div className="relative w-40 h-40 mx-auto">
            {/* Soil base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-amber-600 to-yellow-700 rounded-full opacity-80"></div>
            
            {/* Growing plant stem */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 bg-gradient-to-t from-green-600 to-green-500 rounded-t-sm animate-grow-up origin-bottom" style={{
              height: '40px',
              animationDuration: '1.5s',
              animationFillMode: 'forwards'
            }}></div>
            
            {/* First leaves - appear after stem */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-fade-in-scale" style={{
              animationDelay: '1.5s',
              animationDuration: '0.8s',
              animationFillMode: 'forwards',
              opacity: 0
            }}>
              <div className="relative">
                <Leaf className="h-8 w-8 text-green-500 transform -rotate-45" />
                <Leaf className="absolute top-0 left-4 h-8 w-8 text-green-400 transform rotate-45" />
              </div>
            </div>
            
            {/* Second set of leaves */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 animate-fade-in-scale" style={{
              animationDelay: '2.2s',
              animationDuration: '0.8s',
              animationFillMode: 'forwards',
              opacity: 0
            }}>
              <div className="relative">
                <Leaf className="h-6 w-6 text-green-600 transform -rotate-30" />
                <Leaf className="absolute top-0 left-3 h-6 w-6 text-green-500 transform rotate-30" />
              </div>
            </div>

            {/* Floating seeds/particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-leaf"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 30}%`,
                  animationDelay: `${2 + Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-70"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-3 animate-pulse">
            🌱 Menanam Masa Depan Hijau
          </h2>
          <p className="text-green-600 text-lg font-medium animate-fade-in" style={{
            animationDelay: '0.5s'
          }}>
            Memuat Portal Trees4Trees Citanduy...
          </p>
          
          {/* Progress bar */}
          <div className="w-64 h-3 bg-green-100 rounded-full mx-auto overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-progress shadow-sm"></div>
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8">
          <TreePine className="h-10 w-10 text-green-300 animate-gentle-sway" />
        </div>
        <div className="absolute top-8 right-8">
          <Sprout className="h-8 w-8 text-emerald-300 animate-organic-pulse" />
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-4">
            <Leaf className="h-6 w-6 text-green-400 animate-leaf-dance" />
            <Sprout className="h-6 w-6 text-emerald-400 animate-gentle-sway" />
            <Leaf className="h-6 w-6 text-green-500 animate-leaf-dance" style={{
              animationDelay: '1s'
            }} />
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-50 to-transparent"></div>
    </div>
  );
};

export default LoadingScreen;