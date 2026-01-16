"use client";

import { PointMaterial, Points, useGLTF } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { SpringValue } from '@react-spring/core';
import { a as animated } from '@react-spring/three';
import { useMemo, useRef } from "react";
import * as THREE from 'three';

const COUNT = 50000; // Reduced from 5000 for better performance
const SCALE = 0.02; // Define scale as constant

// Create animated wrappers for Drei components
const AnimatedPoints = animated(Points);
const AnimatedPointMaterial = animated(PointMaterial);


function samplePoints(
    count: number,
    scale : number,
    geometry: THREE.BufferGeometry | null,
) : 
{   positions: Float32Array
    colors: Float32Array
}
 {
     const positions = new Float32Array(count * 3);
     const colors = new Float32Array(count * 3);
     
     if (geometry != null) {
            const positionAttribute = geometry.attributes.position;
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const vertexIndex = Math.floor(Math.random() * positionAttribute.count);
                positions[i3 + 0] = positionAttribute.getX(vertexIndex);
                positions[i3 + 1] = positionAttribute.getY(vertexIndex);
                positions[i3 + 2] = positionAttribute.getZ(vertexIndex);

                colors[i3 + 0] = 0;
                colors[i3 + 1] = 0;
                colors[i3 + 2] = 0;
            }

    } else {
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            positions[i3 + 0] = (Math.random() - 0.5) * 4
            positions[i3 + 1] = (Math.random() - 0.5) * 4
            positions[i3 + 2] = (Math.random() - 0.5) * 4

            colors[i3 + 0] = Math.random()
            colors[i3 + 1] = Math.random()
            colors[i3 + 2] = Math.random()
        }   
    }

    return {positions, colors};
}

export default function ModelShowcase({
    modelPath, opacity = 1, ...props
}: {modelPath : string, opacity?: number | SpringValue<number> }) {
    const ref = useRef<THREE.Points>(null!);
    const materialRef = useRef<THREE.PointsMaterial>(null!);

    const { scene } = useGLTF(modelPath);
    

    const {positions, colors} = useMemo(() => {
        let geometry: THREE.BufferGeometry | null = null;

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                geometry = child.geometry as THREE.BufferGeometry;
            }
        });

        // Sample raw points (we'll normalize per-model below)
        const sampled = samplePoints(COUNT, 1, geometry);

        // Normalize: center models and scale to a consistent size
        if (geometry) {
            (geometry as THREE.BufferGeometry).computeBoundingBox();
            const bbox = (geometry as THREE.BufferGeometry).boundingBox!;
            const center = bbox.getCenter(new THREE.Vector3());
            const size = bbox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const desiredSize = 130; // tune this value to change on-screen model size
            const modelScale = desiredSize / maxDim;

            const minY = (bbox.min.y - center.y) * modelScale;
            const maxY = (bbox.max.y - center.y) * modelScale;
            const heightRange = maxY - minY || 1;

            for (let i = 0; i < sampled.positions.length; i += 3) {
                sampled.positions[i + 0] = (sampled.positions[i + 0] - center.x) * modelScale;
                sampled.positions[i + 1] = (sampled.positions[i + 1] - center.y) * modelScale;
                sampled.positions[i + 2] = (sampled.positions[i + 2] - center.z) * modelScale;

                const normalizedHeight = (sampled.positions[i + 1] - minY) / heightRange;
                sampled.colors[i + 0] = 0//normalizedHeight;
                sampled.colors[i + 1] = 0//normalizedHeight * 0.2;
                sampled.colors[i + 2] = 0//1 - normalizedHeight;
            }
        }

        return sampled;
    },[scene]);


    useFrame((state, delta) => {
        //ref.current.rotation.x += delta * Math.PI / 80;
        ref.current.rotation.y += delta * Math.PI / 8;
        //ref.current.rotation.z += delta * Math.PI / 80;
    })

    return <group scale={SCALE}>
                <AnimatedPoints ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                    <AnimatedPointMaterial 
                        ref={materialRef}
                        transparent
                        vertexColors
                        size={0.020}
                        sizeAttenuation={true}
                        depthWrite={false}
                        opacity={opacity}
                    />
                    <bufferAttribute
                        attach="geometry-attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                        args={[colors, 3]}
                     />
                </AnimatedPoints>
            </group>
           
           
}

