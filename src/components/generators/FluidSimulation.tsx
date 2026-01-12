import React, { useRef, useEffect } from 'react';
import { useStore } from '../../store/StoreContext';

export const FluidSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { fluidConfig } = useStore();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- Configuration ---
        const config = {
            SIM_RESOLUTION: fluidConfig.simResolution,
            DYE_RESOLUTION: fluidConfig.dyeResolution,
            PRESSURE: fluidConfig.pressure,
            PRESSURE_ITERATIONS: 20,
            CURL: fluidConfig.curl,
            SPLAT_RADIUS: fluidConfig.splatRadius,
            SPLAT_FORCE: 6000,
            SHADING: fluidConfig.shading,
            DENSITY_DISSIPATION: fluidConfig.densityDissipation,
            VELOCITY_DISSIPATION: fluidConfig.velocityDissipation,
            PAUSED: fluidConfig.paused,
        };

        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
        const isWebGL2 = !!gl;
        if (!isWebGL2) {
            gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext;
        }

        if (!gl) return;

        // --- Extensions ---
        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
        } else {
            gl.getExtension('OES_texture_half_float');
        }
        gl.getExtension('OES_texture_half_float_linear');

        // --- WebGL Helpers ---
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

        // --- Shaders ---
        const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
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
        `);

        // Shaders Sources
        const splatShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

        const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

        const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

        const curlShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

        const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

        const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

        const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
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
        `);

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

        // Programs
        const splatProgram = createProgram(baseVertexShader, splatShader);
        const advectionProgram = createProgram(baseVertexShader, advectionShader);
        const divergenceProgram = createProgram(baseVertexShader, divergenceShader);
        const curlProgram = createProgram(baseVertexShader, curlShader);
        const vorticityProgram = createProgram(baseVertexShader, vorticityShader);
        const pressureProgram = createProgram(baseVertexShader, pressureShader);
        const gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader);
        const displayProgram = createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, displayShaderSource, config.SHADING ? ["SHADING"] : null));

        const splatUniforms = getUniforms(splatProgram);
        const advectionUniforms = getUniforms(advectionProgram);
        const divergenceUniforms = getUniforms(divergenceProgram);
        const curlUniforms = getUniforms(curlProgram);
        const vorticityUniforms = getUniforms(vorticityProgram);
        const pressureUniforms = getUniforms(pressureProgram);
        const gradientSubtractUniforms = getUniforms(gradientSubtractProgram);
        const displayUniforms = getUniforms(displayProgram);

        // --- Framebuffer Logic ---
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

        const blit = (target: any, clear = false) => {
            if (target == null) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            } else {
                gl.viewport(0, 0, target.width, target.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
            }
            if (clear) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };

        // Initialize Buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // --- Interaction ---
        const HSVtoRGB = (h: number, s: number, v: number) => {
            let r, g, b, i, f, p, q, t;
            i = Math.floor(h * 6); f = h * 6 - i;
            p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            return { r: r! * 0.15, g: g! * 0.15, b: b! * 0.15 };
        };

        const pointer = { x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: HSVtoRGB(Math.random(), 1, 1) };

        const updatePointer = (clientX: number, clientY: number) => {
            const rect = canvas.getBoundingClientRect();
            const posX = clientX - rect.left;
            const posY = clientY - rect.top;
            pointer.dx = (posX / rect.width) - pointer.x;
            pointer.dy = (1.0 - posY / rect.height) - pointer.y;
            pointer.x = posX / rect.width;
            pointer.y = 1.0 - posY / rect.height;
            pointer.moved = true;
        };

        const onMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
        const onMouseDown = () => { pointer.down = true; pointer.color = HSVtoRGB(Math.random(), 1, 1); };
        const onMouseUp = () => { pointer.down = false; };

        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        // --- Resize Logic ---
        const texType = isWebGL2 ? gl.HALF_FLOAT : (gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES || gl.FLOAT);
        const rgbaInternal = isWebGL2 ? gl.RGBA16F : gl.RGBA;
        const rgInternal = isWebGL2 ? gl.RG16F : gl.RGBA;
        const rgFormat = isWebGL2 ? gl.RG : gl.RGBA;

        let dye: any, velocity: any, divergence: any, curl: any, pressure: any;

        const initFBOs = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;

            dye = createDoubleFBO(canvas.width, canvas.height, rgbaInternal, gl.RGBA, texType, gl.LINEAR);
            velocity = createDoubleFBO(canvas.width, canvas.height, rgInternal, rgFormat, texType, gl.LINEAR);
            divergence = createFBO(canvas.width, canvas.height, rgInternal, rgFormat, texType, gl.NEAREST);
            curl = createFBO(canvas.width, canvas.height, rgInternal, rgFormat, texType, gl.NEAREST);
            pressure = createDoubleFBO(canvas.width, canvas.height, rgInternal, rgFormat, texType, gl.NEAREST);
        };

        initFBOs();

        // --- Animation Loop ---
        let lastTime = Date.now();
        const frame = () => {
            const now = Date.now();
            const dt = Math.min((now - lastTime) / 1000, 0.016);
            lastTime = now;

            gl.disable(gl.BLEND);

            // Step 1: Curl & Vorticity
            gl.useProgram(curlProgram);
            gl.uniform2f(curlUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(curlUniforms.uVelocity, velocity.read.attach(0));
            blit(curl);

            gl.useProgram(vorticityProgram);
            gl.uniform2f(vorticityUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(vorticityUniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(vorticityUniforms.uCurl, curl.attach(1));
            gl.uniform1f(vorticityUniforms.curl, config.CURL);
            gl.uniform1f(vorticityUniforms.dt, dt);
            blit(velocity.write);
            velocity.swap();

            // Step 2: Advection
            gl.useProgram(advectionProgram);
            gl.uniform2f(advectionUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(advectionUniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(advectionUniforms.uSource, velocity.read.attach(0));
            gl.uniform1f(advectionUniforms.dt, dt);
            gl.uniform1f(advectionUniforms.dissipation, config.VELOCITY_DISSIPATION);
            blit(velocity.write);
            velocity.swap();

            gl.uniform1i(advectionUniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(advectionUniforms.uSource, dye.read.attach(1));
            gl.uniform1f(advectionUniforms.dissipation, config.DENSITY_DISSIPATION);
            blit(dye.write);
            dye.swap();

            // Step 3: Interaction (Splat)
            if (pointer.moved || pointer.down) {
                gl.useProgram(splatProgram);
                gl.uniform1i(splatUniforms.uTarget, velocity.read.attach(0));
                gl.uniform1f(splatUniforms.aspectRatio, canvas.width / canvas.height);
                gl.uniform2f(splatUniforms.point, pointer.x, pointer.y);
                gl.uniform3f(splatUniforms.color, pointer.dx * config.SPLAT_FORCE, pointer.dy * config.SPLAT_FORCE, 0);
                gl.uniform1f(splatUniforms.radius, config.SPLAT_RADIUS / 100.0);
                blit(velocity.write);
                velocity.swap();

                gl.uniform1i(splatUniforms.uTarget, dye.read.attach(0));
                gl.uniform3f(splatUniforms.color, pointer.color.r * 10, pointer.color.g * 10, pointer.color.b * 10);
                blit(dye.write);
                dye.swap();
                pointer.moved = false;
            }

            // Step 4: Projection
            gl.useProgram(divergenceProgram);
            gl.uniform2f(divergenceUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(divergenceUniforms.uVelocity, velocity.read.attach(0));
            blit(divergence);

            gl.useProgram(pressureProgram);
            gl.uniform2f(pressureUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(pressureUniforms.uDivergence, divergence.attach(0));
            for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
                gl.uniform1i(pressureUniforms.uPressure, pressure.read.attach(1));
                blit(pressure.write);
                pressure.swap();
            }

            gl.useProgram(gradientSubtractProgram);
            gl.uniform2f(gradientSubtractUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(gradientSubtractUniforms.uPressure, pressure.read.attach(0));
            gl.uniform1i(gradientSubtractUniforms.uVelocity, velocity.read.attach(1));
            blit(velocity.write);
            velocity.swap();

            // Step 5: Render
            gl.useProgram(displayProgram);
            gl.uniform2f(displayUniforms.texelSize, 1.0 / canvas.width, 1.0 / canvas.height);
            gl.uniform1i(displayUniforms.uTexture, dye.read.attach(0));
            blit(null);

            requestAnimationFrame(frame);
        };

        frame();

        return () => {
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [fluidConfig]);

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
