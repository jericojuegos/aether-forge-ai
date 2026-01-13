import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass-card p-6 group cursor-pointer"
        >
            <div className="relative">
                {/* Icon container with glow */}
                <div className="w-14 h-14 rounded-xl bg-[hsl(185_100%_50%/0.1)] flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                    <Icon className="w-7 h-7 text-[hsl(185_100%_50%)]" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-semibold text-[hsl(210_40%_98%)] mb-2 group-hover:text-[hsl(185_100%_50%)] transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-[hsl(215_20%_65%)] text-sm leading-relaxed">
                    {description}
                </p>

                {/* Hover gradient accent */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[hsl(185_100%_50%/0.2)] via-transparent to-[hsl(320_100%_60%/0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
            </div>
        </motion.div>
    );
}
