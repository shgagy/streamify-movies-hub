
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Movie } from "@/lib/mockData";

// Local placeholder image path 
const LOCAL_PLACEHOLDER = "/movie-placeholder.jpg";

// 3D Movie Card component
export const MovieItem = ({ 
  movie, 
  index, 
  active, 
  totalItems, 
  onClick 
}: { 
  movie: Movie; 
  index: number; 
  active: boolean; 
  totalItems: number; 
  onClick: () => void;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const radius = 4;
  const theta = (index / totalItems) * Math.PI * 2;
  const x = radius * Math.sin(theta);
  const z = radius * Math.cos(theta);
  
  // Create a fallback texture
  const fallbackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const context = canvas.getContext('2d');
    if (context) {
      // Draw a gradient background
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add movie title
      context.fillStyle = 'white';
      context.font = 'bold 24px Arial';
      const title = movie.title;
      
      // Word wrap for long titles
      const words = title.split(' ');
      let line = '';
      let y = 180;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > canvas.width - 40 && i > 0) {
          context.fillText(line, canvas.width / 2 - context.measureText(line).width / 2, y);
          line = words[i] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, canvas.width / 2 - context.measureText(line).width / 2, y);
      
      // Add year
      context.font = '16px Arial';
      context.fillText(movie.releaseYear.toString(), canvas.width / 2 - context.measureText(movie.releaseYear.toString()).width / 2, y + 40);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [movie.title, movie.releaseYear]);
  
  // Use fallback URL if remote image fails
  const textureRef = useRef<THREE.Texture | null>(null);
  
  // First try the movie poster, if that fails try backdrop, if that fails use local placeholder
  const imageUrl = movie.posterUrl || movie.backdropUrl || LOCAL_PLACEHOLDER;
  
  try {
    // Load texture manually to handle errors properly
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';
    
    // Only load if we don't already have it
    if (!textureRef.current) {
      textureLoader.load(
        imageUrl,
        // On load success
        (loadedTexture) => {
          textureRef.current = loadedTexture;
        },
        // On progress
        undefined,
        // On error
        (error) => {
          console.warn(`Failed to load texture for ${movie.title}, using fallback`, error);
          textureRef.current = fallbackTexture;
        }
      );
    }
  } catch (error) {
    console.error('Error in texture loading:', error);
    textureRef.current = fallbackTexture;
  }
  
  // Use fallback until texture is loaded
  const finalTexture = textureRef.current || fallbackTexture;
  
  // Rotation for active item
  useFrame(() => {
    if (mesh.current) {
      // Slightly rotate active item
      if (active) {
        mesh.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={active ? 0.4 : 0.1} floatIntensity={active ? 0.6 : 0.3}>
      <mesh 
        ref={mesh} 
        position={[x, 0, z]} 
        onClick={onClick}
        scale={active ? 1.2 : 0.8}
      >
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial map={finalTexture} />
      </mesh>
    </Float>
  );
};

// 3D Carousel component
export const Carousel3D = ({ 
  movies, 
  activeIndex, 
  setActiveIndex 
}: { 
  movies: Movie[]; 
  activeIndex: number; 
  setActiveIndex: (index: number) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Rotate the entire carousel slowly
      groupRef.current.rotation.y += 0.002;
    }
  });

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <group ref={groupRef}>
      {movies.map((movie, index) => (
        <MovieItem 
          key={movie.id}
          movie={movie} 
          index={index} 
          totalItems={movies.length}
          active={index === activeIndex}
          onClick={() => handleClick(index)}
        />
      ))}
    </group>
  );
};
