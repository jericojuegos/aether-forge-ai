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
        
        onAnimate(() => {
            if (${shapeConfig.autoRotate}) {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
            }
        });`;
    } else if (activeGenerator === 'planet') {
        const planetConfig = config as PlanetConfig;
        generatorLogic = `
        // Noise functions for procedural texture
        const noiseFunctions = \`
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

          float cnoise(vec3 P) {
            vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
            Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
            vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
            vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
            vec4 gx0 = ixy0 * (1.0 / 7.0);
            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);
            vec4 gx1 = ixy1 * (1.0 / 7.0);
            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);
            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.y, Pf0.z));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.x, Pf1.y, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.x, Pf0.y, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.y, Pf1.z));
            float n111 = dot(g111, Pf1);
            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            return 2.2 * mix(n_yz.x, n_yz.y, fade_xyz.x);
          }
        \`;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorWater: { value: new THREE.Color('${planetConfig.colorWater}') },
                uColorLand: { value: new THREE.Color('${planetConfig.colorLand}') },
                uWaterLevel: { value: ${planetConfig.waterLevel} },
            },
            vertexShader: \`
                varying float vElevation;
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform float uTime;
                \${noiseFunctions}
                void main() {
                    vNormal = normal; vPosition = position;
                    float noiseVal = cnoise(position * 2.0 + uTime * 0.1);
                    vElevation = noiseVal;
                    vec3 newPosition = position + normal * (noiseVal * 0.2);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            \`,
            fragmentShader: \`
                uniform vec3 uColorWater;
                uniform vec3 uColorLand;
                uniform float uWaterLevel;
                varying float vElevation;
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                    vec3 lightPos = vec3(10.0, 10.0, 10.0);
                    vec3 lightDir = normalize(lightPos - vPosition);
                    float diff = max(dot(vNormal, lightDir), 0.0);
                    vec3 color = mix(uColorWater, uColorLand, step(uWaterLevel, vElevation + 0.5));
                    float shore = 1.0 - smoothstep(0.0, 0.05, abs(vElevation + 0.5 - uWaterLevel));
                    color += vec3(1.0) * shore * 0.5;
                    gl_FragColor = vec4(color * (0.5 + diff * 0.5), 1.0);
                }
            \`,
            transparent: true
        });

        const planetBody = new THREE.Mesh(new THREE.IcosahedronGeometry(2, ${planetConfig.detail}), material);
        scene.add(planetBody);
        
        if (${planetConfig.showAtmosphere}) {
            const atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(2, 32, 32),
                new THREE.MeshBasicMaterial({ 
                    color: '${planetConfig.colorWater}', 
                    transparent: true, 
                    opacity: 0.1,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending 
                })
            );
            atmosphere.scale.set(1.2, 1.2, 1.2);
            scene.add(atmosphere);
        }
        
        const clock = new THREE.Clock();
        onAnimate(() => {
            material.uniforms.uTime.value = clock.getElapsedTime();
            planetBody.rotation.y += 0.001;
        });`;
    } else if (activeGenerator === 'particles') {
        const particleConfig = config as any;
        generatorLogic = `
        const count = ${particleConfig.count};
        const spread = ${particleConfig.spread};
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * spread * 2;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: '${particleConfig.color}',
            size: 0.05,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        
        onAnimate(() => {
            points.rotation.y += ${particleConfig.speed * 0.001};
            points.rotation.x += ${particleConfig.speed * 0.0005};
        });`;
    } else {
        generatorLogic = `
        const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#06b6d4' }));
        scene.add(mesh);
        onAnimate(() => { mesh.rotation.y += 0.01; });`;
    }

    return `<!-- AetherForge WordPress Export -->
<div id="${containerId}" style="width: 100%; height: 500px; border-radius: 12px; overflow: hidden; background: #0a0e17;"></div>

<!-- Import Map for correct module resolution -->
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
</script>

<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    (function() {
        const container = document.getElementById('${containerId}');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1.5);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        let animateCallbacks = [];
        const onAnimate = (cb) => animateCallbacks.push(cb);

        ${generatorLogic}

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            animateCallbacks.forEach(cb => cb());
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    })();
</script>`;
}
