import React, { useRef, useEffect } from 'react';
import { useStore } from '../../store/StoreContext';

export const FluidSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { fluidConfig } = useStore();

    // Use a ref for the config to avoid re-initializing WebGL on Every change
    const configRef = useRef(fluidConfig);

    useEffect(() => {
        configRef.current = fluidConfig;
    }, [fluidConfig]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- WebGL Context & Extensions ---
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
        const isWebGL2 = !!gl;
        if (!isWebGL2) {
            gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext;
        }
        if (!gl) return;

        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
        } else {
            gl.getExtension('OES_texture_half_float');
        }
        gl.getExtension('OES_texture_half_float_linear');

        // --- Shader Sources ---
        const baseVertexShaderSource = `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0);
                vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y);
                vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        const splatShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uTarget;
            uniform float aspectRatio;
            uniform vec3 color;
            uniform vec2 point;
            uniform float radius;
            void main () {
                vec2 p = vUv - point.xy;
                p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base = texture2D(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }
        `;

        const advectionShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            uniform sampler2D uVelocity;
            uniform sampler2D uSource;
            uniform vec2 texelSize;
            uniform float dt;
            uniform float dissipation;
            void main () {
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
                float decay = 1.0 + dissipation * dt;
                gl_FragColor = result / decay;
            }
        `;

        const divergenceShaderSource = `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).x;
                float R = texture2D(uVelocity, vR).x;
                float T = texture2D(uVelocity, vT).y;
                float B = texture2D(uVelocity, vB).y;
                vec2 C = texture2D(uVelocity, vUv).xy;
                if (vL.x < 0.0) { L = -C.x; }
                if (vR.x > 1.0) { R = -C.x; }
                if (vT.y > 1.0) { T = -C.y; }
                if (vB.y < 0.0) { B = -C.y; }
                float div = 0.5 * (R - L + T - B);
                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
            }
        `;

        const curlShaderSource = `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).y;
                float R = texture2D(uVelocity, vR).y;
                float T = texture2D(uVelocity, vT).x;
                float B = texture2D(uVelocity, vB).x;
                float vorticity = R - L - T + B;
                gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
            }
        `;

        const vorticityShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uVelocity;
            uniform sampler2D uCurl;
            uniform float curl;
            uniform float dt;
            void main () {
                float L = texture2D(uCurl, vL).x;
                float R = texture2D(uCurl, vR).x;
                float T = texture2D(uCurl, vT).x;
                float B = texture2D(uCurl, vB).x;
                float C = texture2D(uCurl, vUv).x;
                vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                force /= length(force) + 0.0001;
                force *= curl * C;
                force.y *= -1.0;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity += force * dt;
                velocity = min(max(velocity, -1000.0), 1000.0);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `;

        const pressureShaderSource = `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uDivergence;
            void main () {
                float L = texture2D(uPressure, vL).x;
                float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x;
                float B = texture2D(uPressure, vB).x;
                float divergence = texture2D(uDivergence, vUv).x;
                float pressure = (L + R + B + T - divergence) * 0.25;
                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
            }
        `;

        const gradientSubtractShaderSource = `
            precision mediump float;
            precision mediump sampler2D;
            varying highp vec2 vUv;
            varying highp vec2 vL;
            varying highp vec2 vR;
            varying highp vec2 vT;
            varying highp vec2 vB;
            uniform sampler2D uPressure;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uPressure, vL).x;
                float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x;
                float B = texture2D(uPressure, vB).x;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `;

        const displayShaderSource = `
            precision highp float;
            precision highp sampler2D;
            varying vec2 vUv;
            varying vec2 vL;
            varying vec2 vR;
            varying vec2 vT;
            varying vec2 vB;
            uniform sampler2D uTexture;
            uniform vec2 texelSize;
            void main () {
                vec3 c = texture2D(uTexture, vUv).rgb;
            #ifdef SHADING
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;
                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);
                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);
                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            #endif
                float a = max(c.r, max(c.g, c.b));
                gl_FragColor = vec4(c, a);
            }
        `;

        // --- Shader Helpers ---
        const compileShader = (type: number, source: string, keywords: string[] | null = null) => {
            if (keywords) {
                let keywordsString = '';
                keywords.forEach(keyword => {
                    keywordsString += '#define ' + keyword + '\n';
                });
                source = keywordsString + source;
            }
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const createProgram = (vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
            const program = gl.createProgram()!;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        };

        const getUniforms = (program: WebGLProgram) => {
            let uniforms: { [key: string]: WebGLUniformLocation } = {};
            let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) {
                let uniformName = gl.getActiveUniform(program, i)!.name;
                uniforms[uniformName] = gl.getUniformLocation(program, uniformName)!;
            }
            return uniforms;
        };

        // --- Build Programs ---
        const baseVertexShader = compileShader(gl.VERTEX_SHADER, baseVertexShaderSource);

        const programs = {
            splat: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, splatShaderSource)),
            advection: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, advectionShaderSource)),
            divergence: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource)),
            curl: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, curlShaderSource)),
            vorticity: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource)),
            pressure: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, pressureShaderSource)),
            gradientSubtract: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource)),
            display: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, displayShaderSource)),
            displayShading: createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, displayShaderSource, ["SHADING"]))
        };

        const uniforms = {
            splat: getUniforms(programs.splat),
            advection: getUniforms(programs.advection),
            divergence: getUniforms(programs.divergence),
            curl: getUniforms(programs.curl),
            vorticity: getUniforms(programs.vorticity),
            pressure: getUniforms(programs.pressure),
            gradientSubtract: getUniforms(programs.gradientSubtract),
            display: getUniforms(programs.display),
            displayShading: getUniforms(programs.displayShading)
        };

        // --- Framebuffer Creation ---
        function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
            gl.activeTexture(gl.TEXTURE0);
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
            let fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            return { texture, fbo, width: w, height: h, attach: (id: number) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture!); return id; } };
        }

        function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
            let fbo1 = createFBO(w, h, internalFormat, format, type, param);
            let fbo2 = createFBO(w, h, internalFormat, format, type, param);
            return {
                get read() { return fbo1; },
                set read(v) { fbo1 = v; },
                get write() { return fbo2; },
                set write(v) { fbo2 = v; },
                swap() { let temp = fbo1; fbo1 = fbo2; fbo2 = temp; }
            };
        }

        // --- Buffer Initialization ---
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        const blit = (target: any) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            } else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };

        // --- State ---
        let dye: any, velocity: any, divergence: any, curl: any, pressure: any;
        const texType = isWebGL2 ? gl.HALF_FLOAT : (gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES || gl.FLOAT);
        const rgbaInternal = isWebGL2 ? gl.RGBA16F : gl.RGBA;
        const rgInternal = isWebGL2 ? gl.RG16F : gl.RGBA;
        const rgFormat = isWebGL2 ? gl.RG : gl.RGBA;

        const initFBOs = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.clientWidth * dpr;
            const h = canvas.clientHeight * dpr;
            canvas.width = w;
            canvas.height = h;
            dye = createDoubleFBO(w, h, rgbaInternal, gl.RGBA, texType, gl.LINEAR);
            velocity = createDoubleFBO(w, h, rgInternal, rgFormat, texType, gl.LINEAR);
            divergence = createFBO(w, h, rgInternal, rgFormat, texType, gl.NEAREST);
            curl = createFBO(w, h, rgInternal, rgFormat, texType, gl.NEAREST);
            pressure = createDoubleFBO(w, h, rgInternal, rgFormat, texType, gl.NEAREST);
        };

        const onResize = () => {
            initFBOs();
        };

        initFBOs();
        window.addEventListener('resize', onResize);

        // --- Interaction ---
        const pointer = { x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: { r: 0.1, g: 0.1, b: 0.1 } };
        const updatePointer = (cX: number, cY: number) => {
            const r = canvas.getBoundingClientRect();
            const px = cX - r.left;
            const py = cY - r.top;
            pointer.dx = (px / r.width) - pointer.x;
            pointer.dy = (1.0 - py / r.height) - pointer.y;
            pointer.x = px / r.width;
            pointer.y = 1.0 - py / r.height;
            pointer.moved = true;
        };

        const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
        const onMouseDown = () => { pointer.down = true; pointer.color = { r: Math.random() * 0.15, g: Math.random() * 0.15, b: Math.random() * 0.15 }; };
        const onMouseUp = () => { pointer.down = false; };
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        // --- Animation Loop ---
        let lastTime = Date.now();
        let animationId: number;

        const frame = () => {
            const now = Date.now();
            const dt = Math.min((now - lastTime) / 1000, 0.016);
            lastTime = now;
            const currentConfig = configRef.current;

            if (!currentConfig.paused) {
                gl.disable(gl.BLEND);

                // Curl
                gl.useProgram(programs.curl);
                gl.uniform2f(uniforms.curl.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(uniforms.curl.uVelocity, velocity.read.attach(0));
                blit(curl);

                // Vorticity
                gl.useProgram(programs.vorticity);
                gl.uniform2f(uniforms.vorticity.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(uniforms.vorticity.uVelocity, velocity.read.attach(0));
                gl.uniform1i(uniforms.vorticity.uCurl, curl.attach(1));
                gl.uniform1f(uniforms.vorticity.curl, currentConfig.curl);
                gl.uniform1f(uniforms.vorticity.dt, dt);
                blit(velocity.write);
                velocity.swap();

                // Advection
                gl.useProgram(programs.advection);
                gl.uniform2f(uniforms.advection.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(uniforms.advection.uVelocity, velocity.read.attach(0));
                gl.uniform1i(uniforms.advection.uSource, velocity.read.attach(0));
                gl.uniform1f(uniforms.advection.dt, dt);
                gl.uniform1f(uniforms.advection.dissipation, currentConfig.velocityDissipation);
                blit(velocity.write);
                velocity.swap();

                gl.uniform1i(uniforms.advection.uVelocity, velocity.read.attach(0));
                gl.uniform1i(uniforms.advection.uSource, dye.read.attach(1));
                gl.uniform1f(uniforms.advection.dissipation, currentConfig.densityDissipation);
                blit(dye.write);
                dye.swap();

                // Splat
                if (pointer.moved || pointer.down) {
                    gl.useProgram(programs.splat);
                    gl.uniform1i(uniforms.splat.uTarget, velocity.read.attach(0));
                    gl.uniform1f(uniforms.splat.aspectRatio, canvas.width / canvas.height);
                    gl.uniform2f(uniforms.splat.point, pointer.x, pointer.y);
                    gl.uniform3f(uniforms.splat.color, pointer.dx * 6000, pointer.dy * 6000, 0);
                    gl.uniform1f(uniforms.splat.radius, currentConfig.splatRadius / 100.0);
                    blit(velocity.write);
                    velocity.swap();

                    gl.uniform1i(uniforms.splat.uTarget, dye.read.attach(0));

                    // Hex to RGB helper
                    const hexToRgb = (hex: string) => {
                        const r = parseInt(hex.slice(1, 3), 16) / 255;
                        const g = parseInt(hex.slice(3, 5), 16) / 255;
                        const b = parseInt(hex.slice(5, 7), 16) / 255;
                        return { r, g, b };
                    };

                    // Color cycling logic
                    const paletteIndex = Math.floor(Date.now() / 100) % currentConfig.colorPalette.length;
                    const color = hexToRgb(currentConfig.colorPalette[paletteIndex]);

                    gl.uniform3f(uniforms.splat.color, color.r, color.g, color.b);
                    blit(dye.write);
                    dye.swap();
                    pointer.moved = false;
                }

                // Projection
                gl.useProgram(programs.divergence);
                gl.uniform2f(uniforms.divergence.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(uniforms.divergence.uVelocity, velocity.read.attach(0));
                blit(divergence);

                gl.useProgram(programs.pressure);
                gl.uniform2f(uniforms.pressure.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(uniforms.pressure.uDivergence, divergence.attach(0));
                for (let i = 0; i < 20; i++) {
                    gl.uniform1i(uniforms.pressure.uPressure, pressure.read.attach(1));
                    blit(pressure.write);
                    pressure.swap();
                }

                gl.useProgram(programs.gradientSubtract);
                gl.uniform2f(uniforms.gradientSubtract.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(uniforms.gradientSubtract.uPressure, pressure.read.attach(0));
                gl.uniform1i(uniforms.gradientSubtract.uVelocity, velocity.read.attach(1));
                blit(velocity.write);
                velocity.swap();

                // Display
                const displayProg = currentConfig.shading ? programs.displayShading : programs.display;
                const displayU = currentConfig.shading ? uniforms.displayShading : uniforms.display;
                gl.useProgram(displayProg);
                gl.uniform2f(displayU.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
                gl.uniform1i(displayU.uTexture, dye.read.attach(0));
                blit(null);
            }
            animationId = requestAnimationFrame(frame);
        };

        frame();

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(animationId);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('resize', onResize);
        };
    }, []); // Run only once

    return (
        <canvas
            ref={canvasRef}
            id="fluid"
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                background: '#000'
            }}
        />
    );
};
