import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/StoreContext';

export const InteractiveShape = () => {
    const { shapeConfig } = useStore();
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current && shapeConfig.autoRotate) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    const getGeometry = () => {
        switch (shapeConfig.geometryType) {
            case 'icosahedron': return <icosahedronGeometry args={[shapeConfig.size, 0]} />;
            case 'sphere': return <sphereGeometry args={[shapeConfig.size, 32, 32]} />;
            case 'box': return <boxGeometry args={[shapeConfig.size, shapeConfig.size, shapeConfig.size]} />;
            case 'torus': return <torusGeometry args={[shapeConfig.size, shapeConfig.size * 0.3, 16, 100]} />;
            case 'octahedron': return <octahedronGeometry args={[shapeConfig.size, 0]} />;
            default: return <icosahedronGeometry args={[shapeConfig.size, 0]} />;
        }
    };

    return (
        <Float floatIntensity={2} rotationIntensity={1}>
            <mesh ref={meshRef}>
                {getGeometry()}
                <MeshDistortMaterial
                    color={shapeConfig.color}
                    wireframe={shapeConfig.wireframe}
                    distort={0.3}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};
