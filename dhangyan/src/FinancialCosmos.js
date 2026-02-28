import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';
import * as TWEEN from '@tweenjs/tween.js';

const FinancialCosmos = () => {
    const mountRef = useRef(null);
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [isExploding, setIsExploding] = useState(false);
    const particleSystemRef = useRef(null);

  const symbolsData = useMemo(() => [
    { symbol: '$', name: 'Dollar', color: 0x85bb65 },
    { symbol: '€', name: 'Euro', color: 0x0a328c },
    { symbol: '£', name: 'Pound', color: 0xd21034 },
    { symbol: '¥', name: 'Yen', color: 0xbc002d },
    { symbol: '₹', name: 'Rupee', color: 0xff9933 },
    { symbol: '₿', name: 'Bitcoin', color: 0xf7931a }
  ], []);

  useEffect(() => {
    const currentRef = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    currentRef.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Enhanced components
    const starField = createEnhancedStarField();
    scene.add(starField);

    const nebula = createEnhancedNebula();
    scene.add(nebula);

    const dataStreams = createEnhancedDataStreams();
    scene.add(dataStreams);

    const centralSphere = createEnhancedCentralSphere();
    scene.add(centralSphere);

    const markets = createEnhancedMarkets();
    scene.add(markets);

    const symbols = createEnhancedFinancialSymbols();
    scene.add(symbols);

    // Dynamic background
    const skyBox = createDynamicSkyBox();
    scene.add(skyBox);

    // Lens flares
    const lensflares = createLensFlares();
    scene.add(lensflares);

    // Create particle system
    const particleSystem = createParticleSystem();
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;
  

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-100, 100, 100);
    scene.add(directionalLight);

    camera.position.z = 150;

    // Enhanced post-processing
    const composer = setupEnhancedPostProcessing(scene, camera, renderer);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

   // Animation
   const clock = new THREE.Clock();
   const animate = () => {
     requestAnimationFrame(animate);

     const delta = clock.getDelta();
     const elapsedTime = clock.getElapsedTime();

      TWEEN.update();

      starField.rotation.y += 0.0001;
      nebula.rotation.z += 0.0005;
      dataStreams.rotation.y += 0.001;
      centralSphere.rotation.y += 0.005;
      markets.rotation.y += 0.001;

      // Animate skybox
      skyBox.material.uniforms.time.value = elapsedTime;

      // Animate symbols
      symbols.children.forEach((symbol, index) => {
        symbol.position.y = Math.sin(elapsedTime * 0.5 + index) * 2;
        symbol.rotation.y += 0.01;
      });

       // Animate particle system
       if (isExploding && particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (Math.random() - 0.5) * 2;
          positions[i + 1] += (Math.random() - 0.5) * 2;
          positions[i + 2] += (Math.random() - 0.5) * 2;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update shader uniforms
      nebula.material.uniforms.time.value = elapsedTime;
      centralSphere.material.uniforms.time.value = elapsedTime;
      dataStreams.material.uniforms.time.value = elapsedTime;

      controls.update();
      composer.render();
    };

    animate();

    // Enhanced interaction
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(symbols.children);

      if (intersects.length > 0) {
        const symbol = intersects[0].object;
        setCurrentSymbol(symbol.name);
        document.body.style.cursor = 'pointer';
        symbol.scale.setScalar(1.2);
      } else {
        setCurrentSymbol('');
        document.body.style.cursor = 'default';
        symbols.children.forEach(symbol => symbol.scale.setScalar(1));
      }
    };

    const onClick = (event) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(symbols.children);

      if (intersects.length > 0) {
        const symbol = intersects[0].object;
        zoomToSymbol(symbol, camera, controls);
        triggerExplosion(symbol.position);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      currentRef.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, [symbolsData]);

  // Enhanced helper functions
  const createEnhancedStarField = () => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      map: new THREE.TextureLoader().load('/api/placeholder/16/16'),
      blending: THREE.AdditiveBlending
    });

    const starVertices = [];
    for (let i = 0; i < 100000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    return new THREE.Points(starGeometry, starMaterial);
  };

  const createEnhancedNebula = () => {
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
        }
        
        void main() {
          vec3 color1 = vec3(0.5, 0.2, 0.8);
          vec3 color2 = vec3(0.1, 0.4, 0.6);
          
          float n = noise(vPosition * 0.01 + time * 0.1);
          float pattern = abs(sin(vPosition.x * 0.1 + time) * sin(vPosition.y * 0.1 + time) * sin(vPosition.z * 0.1 + time));
          
          vec3 color = mix(color1, color2, pattern);
          color += vec3(n * 0.2);
          
          float alpha = smoothstep(0.3, 0.7, 1.0 - length(vPosition) / 200.0);
          
          gl_FragColor = vec4(color, alpha * 0.5);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const nebulaGeometryPoints = [];
    for (let i = 0; i < 50000; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      const r = THREE.MathUtils.randFloat(100, 200);
      nebulaGeometryPoints.push(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
      );
    }

    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaGeometryPoints, 3));
    return new THREE.Points(nebulaGeometry, nebulaMaterial);
  };

  const createEnhancedDataStreams = () => {
    const streamGeometry = new THREE.BufferGeometry();
    const streamMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        uniform float time;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(time * 2.0 + position.x * 0.05) * 5.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      vertexColors: true,
      uniforms: {
        time: { value: 0 }
      }
    });

    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < 10000; i++) {
      positions.push((Math.random() - 0.5) * 300);
      positions.push((Math.random() - 0.5) * 300);
      positions.push((Math.random() - 0.5) * 300);

      colors.push(Math.random());
      colors.push(Math.random());
      colors.push(Math.random());

      sizes.push(Math.random() * 2 + 0.5);
    }

    streamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    streamGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    streamGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    return new THREE.Points(streamGeometry, streamMaterial);
  };

  const createEnhancedCentralSphere = () => {
    const sphereGeometry = new THREE.SphereGeometry(20, 128, 128);
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
        }
        
        void main() {
          vec3 color1 = vec3(0.1, 0.4, 0.8);
          vec3 color2 = vec3(0.7, 0.0, 0.5);
          
          float n = noise(vNormal * 10.0 + time * 0.1);
          float pattern = abs(sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time));
          
          vec3 color = mix(color1, color2, pattern);
          color += vec3(n * 0.2);
          
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          color += fresnel * 0.5;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
  };

  const createEnhancedMarkets = () => {
    const markets = new THREE.Group();
    const marketColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

    for (let i = 0; i < 5; i++) {
      const orbitRadius = 50 + i * 15;
      const marketGeometry = new THREE.SphereGeometry(3, 32, 32);
      const marketMaterial = new THREE.MeshPhongMaterial({
        color: marketColors[i],
        emissive: marketColors[i],
        emissiveIntensity: 0.5,
        shininess: 100
      });
      const market = new THREE.Mesh(marketGeometry, marketMaterial);

      const angle = Math.random() * Math.PI * 2;
      market.position.set(
        Math.cos(angle) * orbitRadius,
        (Math.random() - 0.5) * 20,
        Math.sin(angle) * orbitRadius
      );

      // Add pulsating animation
      const pulseScale = new TWEEN.Tween(market.scale)
        .to({ x: 1.2, y: 1.2, z: 1.2 }, 1000)
        .repeat(Infinity)
        .yoyo(true)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .start();

      markets.add(market);
    }

    return markets;
  };

  const createEnhancedFinancialSymbols = () => {
    const symbols = new THREE.Group();
    const loader = new FontLoader();

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      symbolsData.forEach((data, index) => {
        const geometry = new TextGeometry(data.symbol, {
          font: font,
          size: 5,
          height: 1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.05,
          bevelOffset: 0,
          bevelSegments: 5
        });

        const material = new THREE.MeshPhongMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 0.5,
          specular: 0xffffff,
          shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);

        const angle = (index / symbolsData.length) * Math.PI * 2;
        const radius = 80;
        mesh.position.set(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );

        mesh.name = data.name;
        symbols.add(mesh);

        // Add hovering animation
        const hoverAnimation = new TWEEN.Tween(mesh.position)
          .to({ y: '+5' }, 2000)
          .repeat(Infinity)
          .yoyo(true)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .start();
      });
    });

    return symbols;
  };

  const createDynamicSkyBox = () => {
    const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
        }
        
        void main() {
          vec3 color1 = vec3(0.1, 0.2, 0.3);
          vec3 color2 = vec3(0.3, 0.1, 0.2);
          
          float n = noise(vPosition * 0.001 + time * 0.1);
          vec3 color = mix(color1, color2, n);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide
    });

    return new THREE.Mesh(geometry, material);
  };

  const createLensFlares = () => {
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load('/api/placeholder/64/64');
    const textureFlare1 = textureLoader.load('/api/placeholder/64/64');

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0));
    lensflare.addElement(new LensflareElement(textureFlare1, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare1, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 1));

    lensflare.position.set(0, 0, -1000);
    return lensflare;
  };

  const createParticleSystem = () => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    const colors = new Float32Array(1000 * 3);

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = 0;
      positions[i + 1] = 0;
      positions[i + 2] = 0;

      colors[i] = Math.random();
      colors[i + 1] = Math.random();
      colors[i + 2] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    return new THREE.Points(geometry, material);
  };

  const setupEnhancedPostProcessing = (scene, camera, renderer) => {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    const customShader = {
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 p = vUv;
          vec4 color = texture2D(tDiffuse, p);
          float n = noise(p * 100.0 + time * 0.1);
          color.rgb += vec3(n * 0.05);
          float scanline = sin(p.y * 400.0 + time * 5.0) * 0.05;
          color.rgb += vec3(scanline);
          gl_FragColor = color;
        }
      `
    };

    const customPass = new ShaderPass(customShader);
    composer.addPass(customPass);

    return composer;
  };

  const zoomToSymbol = (symbol, camera, controls) => {
    new TWEEN.Tween(camera.position)
      .to({
        x: symbol.position.x * 1.5,
        y: symbol.position.y * 1.5,
        z: symbol.position.z * 1.5
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    new TWEEN.Tween(controls.target)
      .to({
        x: symbol.position.x,
        y: symbol.position.y,
        z: symbol.position.z
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  };

  const triggerExplosion = (position) => {
    setIsExploding(true);
    if (particleSystemRef.current) {
      particleSystemRef.current.position.copy(position);
    }
    setTimeout(() => setIsExploding(false), 2000);
  };

  return (
    <>
      <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        {/* Overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1
        }} />
      </div>
      {currentSymbol && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '20px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          zIndex: 2
        }}>
          {currentSymbol}
        </div>
      )}
    </>
  );
};

export default FinancialCosmos;