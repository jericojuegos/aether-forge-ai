import type { NeuralConfig } from '../../store/StoreContext';

export function generateNeuralCode(_activeGenerator: string, config: NeuralConfig, platform: 'react' | 'threejs' | 'wordpress'): string {
    if (platform === 'react') {
        return `import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, Vector3, BufferAttribute, BufferGeometry, AdditiveBlending, DynamicDrawUsage } from 'three';

const NeuralNexusOutput = () => {
    const meshRef = useRef();
    const linesRef = useRef(); 
    const tempObject = useMemo(() => new Object3D(), []);
    
    // Config
    const nodeCount = ${config.nodeCount};
    const connectionRadius = ${config.connectionRadius};
    const pulseSpeed = ${config.pulseSpeed};
    const baseColor = "${config.baseColor}";
    const glowColor = "${config.glowColor}";

    const [nodeData] = useState(() => {
        const data = [];
        for (let i = 0; i < nodeCount; i++) {
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
                offset: Math.random() * 100
            });
        }
        return data;
    });

    const geometry = useMemo(() => new BufferGeometry(), []);

    useFrame((state) => {
        if (!meshRef.current || !linesRef.current) return;

        const time = state.clock.getElapsedTime();
        const baseC = new Color(baseColor);
        const glowC = new Color(glowColor);
        const activeNodes = [];

        for (let i = 0; i < nodeCount; i++) {
            const node = nodeData[i];
            node.position.add(node.velocity);
            
            if (Math.abs(node.position.x) > 10) node.velocity.x *= -1;
            if (Math.abs(node.position.y) > 10) node.velocity.y *= -1;
            if (Math.abs(node.position.z) > 10) node.velocity.z *= -1;

            const pulse = Math.sin(time * pulseSpeed + node.offset) * 0.2 + 1;
            tempObject.position.copy(node.position);
            tempObject.scale.setScalar(pulse * 0.2);
            tempObject.updateMatrix();
            
            meshRef.current.setMatrixAt(i, tempObject.matrix);
            
            const colorBlend = (Math.sin(time * pulseSpeed * 1.5 + node.offset) + 1) * 0.5;
            meshRef.current.setColorAt(i, baseC.clone().lerp(glowC, colorBlend));
            
            activeNodes.push(node.position);
        }
        
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

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
        linesRef.current.geometry = geometry;
    });

    return (
        <group>
            <instancedMesh ref={meshRef} args={[undefined, undefined, nodeCount]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial toneMapped={false} />
            </instancedMesh>
            <lineSegments ref={linesRef}>
                <primitive object={geometry} attach="geometry" />
                <lineBasicMaterial color={glowColor} transparent opacity={0.4} blending={AdditiveBlending} depthWrite={false} />
            </lineSegments>
        </group>
    );
};

export default function App() {
    return (
        <Canvas camera={{ position: [0, 0, 15] }}>
            <ambientLight intensity={0.5} />
            <NeuralNexusOutput />
        </Canvas>
    );
}`;
    }

    return `<!-- Neural Nexus Export -->
<div id="canvas-container" style="width: 100%; height: 500px; background: #000;"></div>
<script type="module">
    import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    
    // Config
    const config = {
        nodeCount: ${config.nodeCount},
        connectionRadius: ${config.connectionRadius},
        pulseSpeed: ${config.pulseSpeed},
        baseColor: new THREE.Color("${config.baseColor}"),
        glowColor: new THREE.Color("${config.glowColor}")
    };

    // Nodes
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshStandardMaterial({ toneMapped: false });
    const mesh = new THREE.InstancedMesh(geometry, material, config.nodeCount);
    scene.add(mesh);

    // Data
    const nodeData = [];
    const tempObject = new THREE.Object3D();
    for(let i=0; i<config.nodeCount; i++) {
        nodeData.push({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            offset: Math.random() * 100
        });
    }

    // Lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: config.glowColor,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Animation
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        const activeNodes = [];
        
        for (let i = 0; i < config.nodeCount; i++) {
            const node = nodeData[i];
            node.position.add(node.velocity);
            
            if (Math.abs(node.position.x) > 10) node.velocity.x *= -1;
            if (Math.abs(node.position.y) > 10) node.velocity.y *= -1;
            if (Math.abs(node.position.z) > 10) node.velocity.z *= -1;

            const pulse = Math.sin(time * config.pulseSpeed + node.offset) * 0.2 + 1;
            tempObject.position.copy(node.position);
            tempObject.scale.setScalar(pulse * 0.2);
            tempObject.updateMatrix();
            mesh.setMatrixAt(i, tempObject.matrix);
            
            const colorBlend = (Math.sin(time * config.pulseSpeed * 1.5 + node.offset) + 1) * 0.5;
            mesh.setColorAt(i, config.baseColor.clone().lerp(config.glowColor, colorBlend));
            activeNodes.push(node.position);
        }
        
        mesh.instanceMatrix.needsUpdate = true;
        if(mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

        // Lines
        const positions = [];
        for (let i = 0; i < config.nodeCount; i++) {
            for (let j = i + 1; j < config.nodeCount; j++) {
                const dist = activeNodes[i].distanceTo(activeNodes[j]);
                if (dist < config.connectionRadius) {
                    positions.push(activeNodes[i].x, activeNodes[i].y, activeNodes[i].z);
                    positions.push(activeNodes[j].x, activeNodes[j].y, activeNodes[j].z);
                }
            }
        }
        
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        renderer.render(scene, camera);
    }
    animate();
</script>`;
}
