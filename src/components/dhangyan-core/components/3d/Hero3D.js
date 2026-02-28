import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, Text3D, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCoin = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={meshRef}>
                {/* Outer Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2, 0.2, 16, 100]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        metalness={0.8}
                        roughness={0.2}
                        emissive="#FFD700"
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* Inner Coin Face */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[1.8, 1.8, 0.2, 32]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>

                {/* Symbol (Simulated with basic shapes for now, could be Text3D if font loaded) */}
                <mesh position={[0, 0, 0.15]}>
                    <boxGeometry args={[1, 1, 0.1]} />
                    <meshStandardMaterial color="#FFA500" emissive="#FF4500" emissiveIntensity={0.5} />
                </mesh>
            </group>
        </Float>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 h-screen w-full pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#purple" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#blue" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#FFD700" />

                <FloatingCoin />

                <fog attach="fog" args={['#050505', 5, 20]} />
            </Canvas>
        </div>
    );
};

export default Hero3D;
