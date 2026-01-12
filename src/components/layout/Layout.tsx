import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden">
                {children}
            </div>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top left purple glow */}
                <div
                    className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
                {/* Bottom right cyan glow */}
                <div
                    className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
                {/* Center subtle glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                        filter: 'blur(100px)'
                    }}
                />
            </div>
        </div>
    );
};
