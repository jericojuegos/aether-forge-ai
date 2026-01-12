import type { ShapeConfig } from '../../store/StoreContext';

export function generateThreeJsCode(activeGenerator: string, config: any): string {
    if (activeGenerator === 'shapes') {
        const shapeConfig = config as ShapeConfig;
        return `import * as THREE from 'three';

// --- Initialization ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x06b6d4, 1.5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// --- Geometry ---
let geometry;
const type = "${shapeConfig.geometryType}";
if (type === 'icosahedron') geometry = new THREE.IcosahedronGeometry(${shapeConfig.size}, 0);
else if (type === 'sphere') geometry = new THREE.SphereGeometry(${shapeConfig.size}, 32, 32);
else if (type === 'box') geometry = new THREE.BoxGeometry(${shapeConfig.size}, ${shapeConfig.size}, ${shapeConfig.size});
else if (type === 'torus') geometry = new THREE.TorusGeometry(${shapeConfig.size}, 0.4, 16, 100);
else geometry = new THREE.OctahedronGeometry(${shapeConfig.size}, 0);

const material = new THREE.MeshStandardMaterial({ 
    color: "${shapeConfig.color}", 
    wireframe: ${shapeConfig.wireframe} 
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 5;

// --- Animation ---
function animate() {
    requestAnimationFrame(animate);
    if (${shapeConfig.autoRotate}) {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

animate();

// --- Resize Handling ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});`;
    }

    return `// Vanilla Three.js generator for ${activeGenerator} coming soon...`;
}
