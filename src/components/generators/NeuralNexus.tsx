import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, Vector3, BufferAttribute, BufferGeometry, AdditiveBlending, DynamicDrawUsage } from 'three';
import { useStore } from '../../store/StoreContext';

export const NeuralNexus = () => {
    const { neuralConfig } = useStore();
    const meshRef = useRef<InstancedMesh>(null);
    const linesRef = useRef<any>(null); // Type 'Line' is generic, using any for ease with BufferGeometry updates
    const tempObject = useMemo(() => new Object3D(), []);

    // Generate static positions and random speeds for nodes
    const [nodeData] = useState(() => {
        const data = [];
        for (let i = 0; i < 500; i++) { // Max pool size
            data.push({
                position: new Vector3(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                ),
                velocity: new Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                offset: Math.random() * 100 // For pulsing phase
            });
        }
        return data;
    });

    const geometry = useMemo(() => new BufferGeometry(), []);

    useFrame((state) => {
        if (!meshRef.current || !linesRef.current) return;

        const { nodeCount, connectionRadius, pulseSpeed, baseColor, glowColor } = neuralConfig;
        const time = state.clock.getElapsedTime();
        const baseC = new Color(baseColor);
        const glowC = new Color(glowColor);

        // Update Nodes
        let activeNodes = [];
        for (let i = 0; i < nodeCount; i++) {
            const node = nodeData[i];

            // Move nodes
            node.position.add(node.velocity);

            // Bounce bounds
            if (Math.abs(node.position.x) > 10) node.velocity.x *= -1;
            if (Math.abs(node.position.y) > 10) node.velocity.y *= -1;
            if (Math.abs(node.position.z) > 10) node.velocity.z *= -1;

            // Pulse scale
            const pulse = Math.sin(time * pulseSpeed + node.offset) * 0.2 + 1;
            tempObject.position.copy(node.position);
            tempObject.scale.setScalar(pulse * 0.2); // Base size
            tempObject.updateMatrix();

            meshRef.current.setMatrixAt(i, tempObject.matrix);

            // Pulse color
            const colorBlend = (Math.sin(time * pulseSpeed * 1.5 + node.offset) + 1) * 0.5;
            meshRef.current.setColorAt(i, baseC.clone().lerp(glowC, colorBlend));

            activeNodes.push(node.position);
        }

        meshRef.current.count = nodeCount;
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

        // Update Connections
        const positions = [];
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                const dist = activeNodes[i].distanceTo(activeNodes[j]);
                if (dist < connectionRadius) {
                    positions.push(activeNodes[i].x, activeNodes[i].y, activeNodes[i].z);
                    positions.push(activeNodes[j].x, activeNodes[j].y, activeNodes[j].z);
                }
            }
        }

        const positionAttribute = new BufferAttribute(new Float32Array(positions), 3);
        positionAttribute.setUsage(DynamicDrawUsage);
        geometry.setAttribute('position', positionAttribute);
        geometry.computeBoundingSphere();
        linesRef.current.geometry = geometry; // Force update geometry
    });

    return (
        <group>
            {/* Nodes */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, 500]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial toneMapped={false} />
            </instancedMesh>

            {/* Connections */}
            <lineSegments ref={linesRef}>
                <primitive object={geometry} attach="geometry" />
                <lineBasicMaterial
                    color={neuralConfig.glowColor}
                    transparent
                    opacity={0.4}
                    blending={AdditiveBlending}
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    );
};
