import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export default function HeroButton({ onClick, children }: HeroButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className="group relative px-8 py-4 rounded-xl font-display font-semibold text-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(185_100%_50%)] via-[hsl(270_60%_50%)] to-[hsl(320_100%_60%)] opacity-100 group-hover:opacity-90 transition-opacity" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl glow-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <span className="relative flex items-center gap-2 text-[hsl(222_47%_4%)]">
                {children}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
        </motion.button>
    );
}

export function SecondaryButton({ onClick, children }: HeroButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className="group relative px-8 py-4 rounded-xl font-display font-semibold text-lg border border-[hsl(222_30%_18%)] hover:border-[hsl(185_100%_50%/0.5)] transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-[hsl(222_47%_7%/0.5)] backdrop-blur-sm rounded-xl" />

            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(185_100%_50%/0.05)] to-[hsl(320_100%_60%/0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

            {/* Content */}
            <span className="relative text-[hsl(210_40%_98%)] group-hover:text-[hsl(185_100%_50%)] transition-colors duration-300">
                {children}
            </span>
        </motion.button>
    );
}
