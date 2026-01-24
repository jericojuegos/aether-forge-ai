import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/StoreContext';

// Vertex Shader
const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader for Event Horizon & Accretion Disk
const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3 uColor;
uniform float uDistortion;
uniform float uCoreSize;
uniform float uIntensity;

// Noise function
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                   mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
               mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                   mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
}

void main() {
    // Distance from center
    float dist = length(vPosition);
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    
    // Core black hole (Event Horizon)
    float horizon = smoothstep(uCoreSize + 0.1, uCoreSize, dist);
    
    // Accretion Disk effects
    float noiseVal = noise(vPosition * uDistortion + uTime * 0.5);
    float disk = smoothstep(uCoreSize, uCoreSize + 2.0, dist) * 
                 (1.0 - smoothstep(uCoreSize + 3.5, uCoreSize + 4.5, dist));
                 
    // Spiral effect using atan
    float angle = atan(vPosition.z, vPosition.x);
    float spiral = sin(angle * 5.0 + dist * 2.0 - uTime * 2.0);
    
    // Combine noise and spiral for disk texture
    float intensity = disk * (noiseVal * 0.5 + 0.5) * (spiral * 0.5 + 0.5) * uIntensity;
    
    // Gravitational lensing / Fresnel rim
    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
    
    // Final color mixing
    vec3 finalColor = uColor * intensity;
    finalColor += uColor * fresnel * 0.5; // Add glow
    
    // Mix core black void with accretion disk
    vec3 col = mix(finalColor, vec3(0.0), horizon);
    
    gl_FragColor = vec4(col, min(intensity + horizon + fresnel, 1.0));
}
`;

export default function CosmicVoid() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { voidConfig } = useStore();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(voidConfig.diskColor) },
            uDistortion: { value: voidConfig.distortion },
            uCoreSize: { value: voidConfig.coreSize },
            uIntensity: { value: voidConfig.intensity }
        }),
        [] // Initial creation
    );

    // Update uniforms when config changes
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * voidConfig.rotationSpeed * 0.2;

            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            material.uniforms.uColor.value.set(voidConfig.diskColor);
            material.uniforms.uDistortion.value = voidConfig.distortion;
            material.uniforms.uCoreSize.value = voidConfig.coreSize;
            material.uniforms.uIntensity.value = voidConfig.intensity;
        }
    });

    return (
        <group>
            {/* Main Black Hole and Accretion Disk */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[6, 64, 64]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Particle Debris Field */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={500}
                        array={new Float32Array(1500).map(() => (Math.random() - 0.5) * 15)}
                        itemSize={3}
                        args={[new Float32Array(1500).map(() => (Math.random() - 0.5) * 15), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color={voidConfig.diskColor}
                    transparent
                    opacity={0.3}
                />
            </points>
        </group>
    );
}
