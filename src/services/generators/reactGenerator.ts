import type { ShapeConfig, PlanetConfig, ParticleConfig } from '../../store/StoreContext';

export function generateReactCode(activeGenerator: string, config: any): string {
    if (activeGenerator === 'shapes') {
        const shapeConfig = config as ShapeConfig;
        return `import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <${shapeConfig.geometryType}Geometry args={[${shapeConfig.size}, ${shapeConfig.geometryType === 'icosahedron' ? '0' : ''}]} />
        <meshStandardMaterial 
          color="${shapeConfig.color}" 
          wireframe={${shapeConfig.wireframe}} 
        />
      </mesh>
      
      <OrbitControls />
    </>
  );
};

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0e17' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
      </Canvas>
    </div>
  );
}`;
    }

    if (activeGenerator === 'planet') {
        const planetConfig = config as PlanetConfig;
        return `import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

const Planet = () => {
  return (
    <group>
      {/* Atmosphere */}
      {${planetConfig.showAtmosphere} && (
        <mesh scale={1.1}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial 
            color="${planetConfig.colorWater}" 
            transparent 
            opacity={0.2} 
          />
        </mesh>
      )}
      
      {/* Main Planet Body */}
      <mesh>
        <sphereGeometry args={[1, ${planetConfig.detail}, ${planetConfig.detail}]} />
        <meshStandardMaterial 
          color="${planetConfig.colorLand}"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020617' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Planet />
        <OrbitControls />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}`;
    }

    if (activeGenerator === 'particles') {
        const particleConfig = config as ParticleConfig;
        return `import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null!);
  
  // Create random positions
  const positions = React.useMemo(() => {
    const pos = new Float32Array(${particleConfig.count} * 3);
    for (let i = 0; i < ${particleConfig.count} * 3; i++) {
        pos[i] = (Math.random() - 0.5) * ${particleConfig.spread * 2};
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * ${particleConfig.speed * 0.1};
    ref.current.rotation.x += delta * ${particleConfig.speed * 0.05};
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="${particleConfig.color}"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}`;
    }

    return '// Generator not found';
}
