import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/StoreContext';

const dummy = new THREE.Object3D();

export const ParticleField = () => {
    const { particleConfig } = useStore();
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = particleConfig.count;

    // Initialize particles with random positions and velocities
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 5000; i++) { // Max buffer size
            const x = (Math.random() - 0.5) * particleConfig.spread * 2;
            const y = (Math.random() - 0.5) * particleConfig.spread * 2;
            const z = (Math.random() - 0.5) * particleConfig.spread * 2;
            temp.push({
                x, y, z,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                vz: (Math.random() - 0.5) * 0.1,
                life: Math.random()
            });
        }
        return temp;
    }, []); // Run once on mount

    useFrame(() => {
        if (!meshRef.current) return;

        // Update only the active count based on config
        const activeCount = Math.min(count, 5000);

        // We adjust the physics speed by config
        const speedFactor = particleConfig.speed;

        for (let i = 0; i < activeCount; i++) {
            const p = particles[i];

            // Update position
            p.x += p.vx * speedFactor;
            p.y += p.vy * speedFactor;
            p.z += p.vz * speedFactor;

            // Wrap around logic (toroidal space)
            const range = particleConfig.spread;
            if (p.x > range) p.x = -range;
            if (p.x < -range) p.x = range;
            if (p.y > range) p.y = -range;
            if (p.y < -range) p.y = range;
            if (p.z > range) p.z = -range;
            if (p.z < -range) p.z = range;

            // Update instance matrix
            dummy.position.set(p.x, p.y, p.z);

            // Make them face camera or rotate slightly
            dummy.rotation.x += 0.01;
            dummy.rotation.y += 0.01;

            const scale = 0.05 + 0.1 * p.life; // varying size
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 5000]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
                color={particleConfig.color}
                emissive={particleConfig.color}
                emissiveIntensity={0.5}
                toneMapped={false}
            />
        </instancedMesh>
    );
};
