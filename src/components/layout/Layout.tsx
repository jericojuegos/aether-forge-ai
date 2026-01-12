import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-aether-bg text-aether-text selection:bg-aether-accent/30">
            <Sidebar />
            <main className="flex-1 relative z-10 w-full h-full">
                {children}
            </main>

            {/* Background ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-900/20 blur-[120px] rounded-full" />
                <div className="absolute top-[40%] left-[60%] w-[40%] h-[40%] bg-cyan-900/10 blur-[100px] rounded-full" />
            </div>
        </div>
    );
};
