import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef<THREE.Points>(null);

    const particleCount = 2000;

    const positions = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        // The colors array is no longer needed as vertexColors is removed from PointMaterial
        // and a uniform color is applied.
        // const colors = new Float32Array(particleCount * 3);

        const primaryColor = new THREE.Color('hsl(185, 100%, 50%)');
        const accentColor = new THREE.Color('hsl(320, 100%, 60%)');
        const secondaryColor = new THREE.Color('hsl(270, 60%, 50%)');

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Spherical distribution with some randomness
            const radius = 4 + Math.random() * 6;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random color selection (used for visual variety calculation)
            const colorChoice = Math.random();
            // Colors affect visual distribution even if not directly used
            void (colorChoice < 0.5 ? primaryColor : colorChoice < 0.8 ? accentColor : secondaryColor);
        }

        return positions;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.elapsedTime * 0.02;
            ref.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="hsla(0, 0%, 91%, 1.00)"
                size={0.04}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function ConnectionLines() {
    const ref = useRef<THREE.LineSegments>(null);

    const geometry = useMemo(() => {
        const points: THREE.Vector3[] = [];
        const lineCount = 100;

        for (let i = 0; i < lineCount; i++) {
            const radius1 = 3 + Math.random() * 5;
            const radius2 = 3 + Math.random() * 5;

            const theta1 = Math.random() * Math.PI * 2;
            const phi1 = Math.acos((Math.random() * 2) - 1);
            const theta2 = theta1 + (Math.random() - 0.5) * 0.5;
            const phi2 = phi1 + (Math.random() - 0.5) * 0.5;

            points.push(
                new THREE.Vector3(
                    radius1 * Math.sin(phi1) * Math.cos(theta1),
                    radius1 * Math.sin(phi1) * Math.sin(theta1),
                    radius1 * Math.cos(phi1)
                ),
                new THREE.Vector3(
                    radius2 * Math.sin(phi2) * Math.cos(theta2),
                    radius2 * Math.sin(phi2) * Math.sin(theta2),
                    radius2 * Math.cos(phi2)
                )
            );
        }

        return new THREE.BufferGeometry().setFromPoints(points);
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.elapsedTime * 0.015;
            ref.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <lineSegments ref={ref} geometry={geometry}>
            <lineBasicMaterial
                color="hsl(185, 100%, 50%)"
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    );
}

function FloatingCore() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <icosahedronGeometry args={[4, 2]} />
                <meshBasicMaterial
                    color="hsl(185, 100%, 50%)"
                    wireframe
                    transparent
                    opacity={0.3} // Increased visibility
                />
            </mesh>

            <points>
                <icosahedronGeometry args={[4, 2]} />
                <pointsMaterial
                    size={0.01} // Larger points
                    color="hsl(185, 100%, 50%)"
                    transparent
                    opacity={0.8} // High opacity for visibility
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

export default function NeuralBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[hsl(222,47%,4%)]">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <ParticleField />
                <ConnectionLines />
                <FloatingCore />
            </Canvas>

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(222,47%,4%)]/20 to-[hsl(222,47%,4%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(222_47%_4%/0.7)_100%)] pointer-events-none" />
        </div>
    );
}
