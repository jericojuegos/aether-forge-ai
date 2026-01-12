import { Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { AICommander } from './components/layout/AICommander';
import { Controls } from './components/controls/Controls';
import { StoreProvider, useStore } from './store/StoreContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { InteractiveShape } from './components/generators/InteractiveShape';
import { ProceduralPlanet } from './components/generators/ProceduralPlanet';
import { ParticleField } from './components/generators/ParticleField';

function SceneContent() {
  const { activeGenerator } = useStore();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <group>
        {activeGenerator === 'shapes' && <InteractiveShape />}
        {activeGenerator === 'planet' && <ProceduralPlanet />}
        {activeGenerator === 'particles' && <ParticleField />}
      </group>

      <OrbitControls makeDefault autoRotate={false} />
      <Environment preset="city" />
    </>
  );
}

function App() {
  return (
    <StoreProvider>
      <Layout>
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </Canvas>
        </div>

        <AICommander />
        <Controls />

      </Layout>
    </StoreProvider>
  );
}

export default App;
