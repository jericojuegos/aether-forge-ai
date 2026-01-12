import type { ShapeConfig, PlanetConfig } from '../../store/StoreContext';

export function generateWordPressCode(activeGenerator: string, config: any): string {
    const containerId = `${activeGenerator}-aether-container`;

    let generatorLogic = '';

    if (activeGenerator === 'shapes') {
        const shapeConfig = config as ShapeConfig;
        generatorLogic = `
        const geometry = new THREE.${shapeConfig.geometryType.charAt(0).toUpperCase() + shapeConfig.geometryType.slice(1)}Geometry(${shapeConfig.size}, ${shapeConfig.geometryType === 'icosahedron' ? '0' : '32'});
        const material = new THREE.MeshStandardMaterial({ 
            color: '${shapeConfig.color}', 
            wireframe: ${shapeConfig.wireframe} 
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        function animate() {
            requestAnimationFrame(animate);
            if (${shapeConfig.autoRotate}) {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        }
        animate();`;
    } else if (activeGenerator === 'planet') {
        const planetConfig = config as PlanetConfig;
        generatorLogic = `
        const planetBody = new THREE.Mesh(
            new THREE.SphereGeometry(1, ${planetConfig.detail}, ${planetConfig.detail}),
            new THREE.MeshStandardMaterial({ color: '${planetConfig.colorLand}', roughness: 0.7 })
        );
        scene.add(planetBody);
        
        if (${planetConfig.showAtmosphere}) {
            const atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(1.1, 32, 32),
                new THREE.MeshPhongMaterial({ color: '${planetConfig.colorWater}', transparent: true, opacity: 0.2 })
            );
            scene.add(atmosphere);
        }
        
        function animate() {
            requestAnimationFrame(animate);
            planetBody.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();`;
    } else {
        // Fallback for particles or others
        generatorLogic = `// WordPress support for ${activeGenerator} is simplified for compatibility.
        const particles = new THREE.Group();
        scene.add(particles);
        function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }
        animate();`;
    }

    return `<!-- AetherForge WordPress Export -->
<div id="${containerId}" style="width: 100%; height: 500px; border-radius: 12px; overflow: hidden; background: #0a0e17;"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js"></script>

<script>
(function() {
    const container = document.getElementById('${containerId}');
    if (!container) return;

    // Wait for THREE to load if not already available
    const init = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x06b6d4, 2);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        ${generatorLogic}

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    if (typeof THREE !== 'undefined') {
        init();
    } else {
        const checkThree = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(checkThree);
                init();
            }
        }, 100);
    }
})();
</script>`;
}
