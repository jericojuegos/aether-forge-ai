import { motion } from 'framer-motion';
import {
    Sparkles,
    Layers,
    Palette,
    Download,
    Zap,
    Globe
} from 'lucide-react';
import NeuralBackground from './NeuralBackground';
import FeatureCard from './FeatureCard';
import HeroButton, { SecondaryButton } from './HeroButton';
import { useStore } from '../../store/StoreContext';

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Generation',
        description: 'Harness Google Gemini to transform text prompts into stunning 3D scenes with intelligent scene composition.',
    },
    {
        icon: Palette,
        title: 'Custom GLSL Shaders',
        description: 'Create mesmerizing visuals with high-fidelity shader effects, from neural networks to cosmic particle fields.',
    },
    {
        icon: Layers,
        title: 'Multi-Generator Library',
        description: 'Choose from curated generators including Neural Nexus, Particle Fields, and Cosmic Void effects.',
    },
    {
        icon: Download,
        title: 'Universal Export',
        description: 'Export your creations to React Three Fiber, vanilla Three.js, or embed-ready WordPress snippets.',
    },
    {
        icon: Zap,
        title: 'Real-Time Preview',
        description: 'See changes instantly with our optimized WebGL renderer. No lag, no waiting—pure creative flow.',
    },
    {
        icon: Globe,
        title: 'Web-Ready Output',
        description: 'Generate production-ready code that works seamlessly across modern browsers and devices.',
    },
];

export default function LandingPage() {
    const { setView } = useStore();

    return (
        <div className="relative min-h-screen overflow-hidden" style={{ background: 'hsl(222 47% 4%)' }}>
            {/* 3D Background */}
            <NeuralBackground />

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between px-8 py-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(185_100%_50%)] to-[hsl(320_100%_60%)] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[hsl(222_47%_4%)]" />
                        </div>
                        <span className="font-display text-xl font-bold gradient-text">
                            AetherForge
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-[hsl(215_20%_65%)] hover:text-[hsl(210_40%_98%)] transition-colors">
                            Features
                        </a>
                        <a href="#" className="text-[hsl(215_20%_65%)] hover:text-[hsl(210_40%_98%)] transition-colors">
                            Docs
                        </a>
                        <a href="#" className="text-[hsl(215_20%_65%)] hover:text-[hsl(210_40%_98%)] transition-colors">
                            Showcase
                        </a>
                    </div>
                </motion.nav>

                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-[hsl(185_100%_50%)] font-medium">
                            ✨ Powered by Google Gemini AI
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-display text-5xl md:text-7xl lg:text-8xl font-bold max-w-5xl leading-tight mb-6"
                    >
                        <span className="text-[hsl(210_40%_98%)]">Forge </span>
                        <span className="gradient-text text-glow-primary">Stunning 3D</span>
                        <br />
                        <span className="text-[hsl(210_40%_98%)]">With </span>
                        <span className="gradient-text-accent">AI Power</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg md:text-xl text-[hsl(215_20%_65%)] max-w-2xl mb-10 leading-relaxed"
                    >
                        Transform your ideas into breathtaking 3D visualizations.
                        From neural networks to cosmic particle fields—create,
                        customize, and export production-ready code in seconds.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <HeroButton onClick={() => setView('studio')}>
                            Enter Studio
                        </HeroButton>
                        <SecondaryButton onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                            Explore Features
                        </SecondaryButton>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-6 h-10 rounded-full border-2 border-[hsl(215_20%_65%/0.3)] flex items-start justify-center p-2"
                        >
                            <div className="w-1 h-2 bg-[hsl(185_100%_50%)] rounded-full" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                                <span className="gradient-text">Powerful Features</span>
                            </h2>
                            <p className="text-[hsl(215_20%_65%)] text-lg max-w-2xl mx-auto">
                                Everything you need to create stunning 3D experiences,
                                powered by cutting-edge AI and WebGL technology.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={feature.title}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden"
                    >
                        {/* Background gradient orbs */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[hsl(185_100%_50%/0.2)] rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[hsl(320_100%_60%/0.2)] rounded-full blur-3xl" />

                        <div className="relative">
                            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                                Ready to Create Something
                                <span className="gradient-text"> Extraordinary?</span>
                            </h2>
                            <p className="text-[hsl(215_20%_65%)] text-lg mb-8 max-w-xl mx-auto">
                                Jump into the studio and start forging your vision.
                                No signup required—just pure creative power.
                            </p>
                            <HeroButton onClick={() => setView('studio')}>
                                Start Creating Now
                            </HeroButton>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 border-t border-[hsl(222_30%_18%/0.5)]">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[hsl(185_100%_50%)]" />
                            <span className="font-display font-semibold gradient-text">AetherForge AI</span>
                        </div>
                        <p className="text-sm text-[hsl(215_20%_65%)]">
                            Built with ❤️ for creators everywhere
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
