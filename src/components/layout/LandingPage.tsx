import { useStore } from '../../store/StoreContext';
import { Canvas } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { ArrowRight, Play, Sparkles, Zap, Globe, Code2, Layers, Box, Cpu, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple particle background for landing (avoids store dependency issues)
function ParticleBackground() {
    const meshRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particles, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#00eaff" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

// Navbar
function Navbar({ onEnter }: { onEnter: () => void }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00eaff] to-[#8033cc] flex items-center justify-center">
                        <Sparkles size={20} className="text-white" fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        AetherForge AI
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-slate-300 hover:text-[#00eaff] transition-colors font-medium">Features</a>
                    <a href="#" className="text-slate-300 hover:text-[#00eaff] transition-colors font-medium">Showcase</a>
                    <a href="#" className="text-slate-300 hover:text-[#00eaff] transition-colors font-medium">Docs</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onEnter}
                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                    >
                        Launch App
                    </button>
                </div>
            </div>
        </nav>
    );
}

// Feature Card
function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="p-6 rounded-[20px] border border-white/10 hover:border-[#00eaff]/30 transition-all duration-300"
            style={{
                background: 'rgba(11, 17, 30, 0.6)',
                backdropFilter: 'blur(20px)'
            }}
        >
            <div className="w-12 h-12 rounded-xl bg-[#00eaff]/10 flex items-center justify-center text-[#00eaff] mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    );
}

export function LandingPage() {
    const { setView } = useStore();

    return (
        <div
            className="relative w-full min-h-screen overflow-x-hidden text-white"
            style={{
                background: '#05080f',
                fontFamily: "'Inter', sans-serif"
            }}
        >
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] rounded-full opacity-30 blur-[100px]" style={{ background: 'radial-gradient(circle, #00eaff 0%, transparent 70%)' }} />
                <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[60%] rounded-full opacity-30 blur-[100px]" style={{ background: 'radial-gradient(circle, #8033cc 0%, transparent 70%)' }} />
            </div>

            {/* 3D Background */}
            <div className="fixed inset-0 z-0 opacity-50">
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00eaff" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8033cc" />
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                        <ParticleBackground />
                    </Float>
                </Canvas>
            </div>

            <Navbar onEnter={() => setView('studio')} />

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-32 px-8">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{
                            background: 'rgba(11, 17, 30, 0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(248, 250, 252, 0.1)'
                        }}
                    >
                        <Sparkles size={14} className="text-[#00eaff]" />
                        <span className="text-sm font-medium text-[#00eaff]">New: AI Scene Generation is here</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-[96px] font-bold leading-tight mb-8"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Why Settle for Ordinary<br />
                        When You Can Create{' '}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #00eaff 0%, #8033cc 100%)' }}
                        >
                            Extraordinary?
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Transform your ideas into breathtaking 3D visualizations. From neural networks to cosmic particle fields—create, customize, and export production-ready code in seconds.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => setView('studio')}
                            className="group px-8 py-4 rounded-2xl font-semibold text-lg text-white flex items-center gap-2 transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(to right, #00eaff, #8033cc, #ff33bb)',
                                boxShadow: '0 0 30px rgba(0, 234, 255, 0.3)'
                            }}
                        >
                            Start Creating Now
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            className="px-8 py-4 rounded-2xl font-semibold text-lg text-white flex items-center gap-2 border border-[#20283c] hover:bg-white/5 transition-all duration-300"
                        >
                            <Play size={18} fill="currentColor" />
                            Watch Demo
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Everything you need to create
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Powerful AI tools to bring your 3D visions to life, directly in the browser.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Zap size={24} />}
                            title="Gemini 2.0 Flash"
                            description="Lightning-fast AI generation powered by Google's latest model. Get instant results."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Globe size={24} />}
                            title="Procedural Worlds"
                            description="Generate complex planets, terrains, and fluid simulations with math-based noise."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Code2 size={24} />}
                            title="Production Ready"
                            description="Export clean, TypeScript-typed React Three Fiber code suitable for any project."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<Layers size={24} />}
                            title="Multi-Platform"
                            description="One-click export for React, Vanilla Three.js, and WordPress integration."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Box size={24} />}
                            title="Smart Controls"
                            description="AI auto-generates UI controls for your scene parameters for manual tweaking."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<Cpu size={24} />}
                            title="Agentic Core"
                            description="Built with Google DeepMind's agentic coding principles for self-improving workflows."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="relative z-10 py-32 px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-12 md:p-16 rounded-[20px] text-center"
                        style={{
                            background: 'rgba(11, 17, 30, 0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(248, 250, 252, 0.1)'
                        }}
                    >
                        <Eye size={40} className="mx-auto mb-6 text-[#00eaff]" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Ready to Create Something Amazing?
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto mb-8">
                            Join creators worldwide who are using AetherForge to build stunning 3D experiences.
                        </p>
                        <button
                            onClick={() => setView('studio')}
                            className="px-8 py-4 rounded-2xl font-semibold text-lg text-white hover:scale-105 transition-all duration-300"
                            style={{
                                background: 'linear-gradient(to right, #00eaff, #8033cc, #ff33bb)',
                                boxShadow: '0 0 30px rgba(0, 234, 255, 0.3)'
                            }}
                        >
                            Get Started Free
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-8 px-8 text-center text-slate-500 text-sm">
                © 2026 AetherForge AI. Built with Google Gemini.
            </footer>
        </div>
    );
}
