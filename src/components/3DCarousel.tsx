
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Movie } from "@/lib/mockData";

// 3D Movie Card component
export const MovieItem = ({ movie, index, active, totalItems, onClick }) => {
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
  
  // Try to load texture with fallback
  const [texture, error] = useTexture(
    [movie.posterUrl || movie.backdropUrl], 
    // Onload
    undefined, 
    // Onerror
    () => {
      console.warn(`Failed to load texture for ${movie.title}, using fallback`);
      return [fallbackTexture];
    }
  );
  
  // Use fallback if there was an error
  const finalTexture = error ? fallbackTexture : texture;
  
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
        <meshStandardMaterial map={Array.isArray(finalTexture) ? finalTexture[0] : finalTexture} />
      </mesh>
    </Float>
  );
};

// 3D Carousel component
export const Carousel3D = ({ movies, activeIndex, setActiveIndex }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Rotate the entire carousel slowly
      groupRef.current.rotation.y += 0.002;
    }
  });

  const handleClick = (index) => {
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
