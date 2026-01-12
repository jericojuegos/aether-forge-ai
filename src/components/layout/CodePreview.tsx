import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/StoreContext';
import { generateReactCode } from '../../services/generators/reactGenerator';
import { generateThreeJsCode } from '../../services/generators/threeJsGenerator';
import { generateWordPressCode } from '../../services/generators/wordpressGenerator';
import { generateFluidCode } from '../../services/generators/fluidGenerator';
import { Clipboard, Check, X, Code2, Layers, Cpu, Globe, HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';

export const CodePreview: React.FC = () => {
    const {
        viewMode, toggleViewMode,
        activeGenerator, shapeConfig, planetConfig, particleConfig, fluidConfig,
        codePlatform, setCodePlatform
    } = useStore();

    const [copied, setCopied] = useState(false);
    const [code, setCode] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        if (activeGenerator === 'fluid') {
            setCode(generateFluidCode(activeGenerator, fluidConfig, codePlatform));
            return;
        }

        const config = activeGenerator === 'shapes' ? shapeConfig :
            activeGenerator === 'planet' ? planetConfig : particleConfig;

        if (codePlatform === 'react') {
            setCode(generateReactCode(activeGenerator, config));
        } else if (codePlatform === 'threejs') {
            setCode(generateThreeJsCode(activeGenerator, config));
        } else {
            setCode(generateWordPressCode(activeGenerator, config));
        }
    }, [activeGenerator, shapeConfig, planetConfig, particleConfig, fluidConfig, codePlatform]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (viewMode !== 'code') return null;

    return (
        <div className="code-preview-overlay">
            <div className="code-preview-container">
                <div className="code-preview-header">
                    <div className="header-left">
                        <div className="header-icon">
                            <Code2 size={18} />
                        </div>
                        <div>
                            <h3>Source Code</h3>
                            <p>Export your component</p>
                        </div>
                    </div>

                    <div className="header-center">
                        <div className="platform-switcher">
                            <button
                                className={codePlatform === 'react' ? 'active' : ''}
                                onClick={() => setCodePlatform('react')}
                            >
                                <Layers size={14} /> React
                            </button>
                            <button
                                className={codePlatform === 'threejs' ? 'active' : ''}
                                onClick={() => setCodePlatform('threejs')}
                            >
                                <Cpu size={14} /> Three.js
                            </button>
                            <button
                                className={codePlatform === 'wordpress' ? 'active' : ''}
                                onClick={() => setCodePlatform('wordpress')}
                            >
                                <Globe size={14} /> WordPress
                            </button>
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="copy-button" onClick={handleCopy}>
                            {copied ? <Check size={16} /> : <Clipboard size={16} />}
                            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                        <button className="close-button" onClick={toggleViewMode}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="code-layout">
                    <div className="code-content">
                        <pre>
                            <code>
                                {code.split('\n').map((line, i) => (
                                    <div key={i} className="code-line">
                                        <span className="line-number">{i + 1}</span>
                                        <span className="line-text">{highlightCode(line)}</span>
                                    </div>
                                ))}
                            </code>
                        </pre>
                    </div>

                    {codePlatform === 'wordpress' && (
                        <div className="instructions-panel">
                            <button
                                className="instructions-toggle"
                                onClick={() => setShowInstructions(!showInstructions)}
                            >
                                <div className="toggle-left">
                                    <HelpCircle size={16} />
                                    <span>Usage Instructions</span>
                                </div>
                                {showInstructions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {showInstructions && (
                                <div className="instructions-body">
                                    <div className="instruction-item">
                                        <h4>Gutenberg (Block Editor)</h4>
                                        <p>Add a <strong>"Custom HTML"</strong> block and paste the code inside.</p>
                                    </div>
                                    <div className="instruction-item">
                                        <h4>Elementor</h4>
                                        <p>Drag the <strong>"HTML"</strong> widget to your page and paste the code.</p>
                                    </div>
                                    <div className="instruction-item">
                                        <h4>Classic Editor</h4>
                                        <p>Switch to the <strong>"Text"</strong> tab (HTML mode) and paste the code.</p>
                                    </div>
                                    <div className="instruction-item">
                                        <h4>Divi / WP Bakery</h4>
                                        <p>Use the <strong>"Code"</strong> or <strong>"Raw HTML"</strong> module/element.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Very basic syntax highlighting for preview purposes
function highlightCode(line: string) {
    const keywords = ['import', 'from', 'export', 'default', 'function', 'const', 'let', 'return', 'if', 'else', 'new'];
    const types = ['React', 'THREE', 'Canvas', 'OrbitControls', 'Stars', 'Scene', 'App', 'Mesh', 'Geometry', 'Material'];

    let parts = line.split(/(\s+|[.,;(){}[\]<>!/])/);

    return parts.map((part, i) => {
        if (keywords.includes(part)) return <span key={i} className="syntax-keyword">{part}</span>;
        if (types.includes(part)) return <span key={i} className="syntax-type">{part}</span>;
        if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="syntax-string">{part}</span>;
        if (!isNaN(Number(part)) && part !== '') return <span key={i} className="syntax-number">{part}</span>;
        if (part.startsWith('//')) return <span key={i} className="syntax-comment">{part}</span>;
        return part;
    });
}
