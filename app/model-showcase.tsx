"use client";

import { useMemo, useRef } from "react";
import styles from "./styles/homepage.module.scss";
import { Canvas, ThreeElement, useFrame } from "@react-three/fiber";
import {PointMaterial, Points, useGLTF} from '@react-three/drei'
import * as THREE from 'three'
import { vertexIndex } from "three/tsl";

const COUNT = 40000;
const SCALE = 0.02; // Define scale as constant


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
            geometry?.computeBoundingBox();
            const bbox = geometry.boundingBox!;
            const minY = bbox.min.y * scale;
            const maxY = bbox.max.y * scale;
            const heightRange = maxY - minY;
            const positionAttribute = geometry.attributes.position;
            for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const vertexIndex = Math.floor(Math.random() * positionAttribute.count); 
            const x = positionAttribute.getX(vertexIndex);
            const y = positionAttribute.getY(vertexIndex);
            const z = positionAttribute.getZ(vertexIndex);


            positions[i3 + 0] = x
            positions[i3 + 1] = y
            positions[i3 + 2] = z

            const scaledY = y * scale;
            const normalizedHeight = (scaledY - minY) / heightRange;

            colors [i3 + 0] = 0//normalizedHeight;
            colors[i3 + 1] = 0//0.01;
            colors[i3 + 2] = 0//1 - normalizedHeight;
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
    modelPath, ...props
}: {modelPath : string }) {
    const ref = useRef<THREE.Points>(null!);

    const { scene } = useGLTF(modelPath);
    

    const {positions, colors} = useMemo(() => {
        let geometry: THREE.BufferGeometry | null = null;

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                geometry = child.geometry as THREE.BufferGeometry;
            }
        })

        
        /* if (geometry) {
            geometry.computeBoundingBox();
            console.log('Model bounding box',geometry.boundingBox);
        } */
        
        return samplePoints(COUNT, SCALE, geometry);
    },[scene]);


    useFrame((state, delta) => {
        //ref.current.rotation.x += delta * Math.PI / 80;
        ref.current.rotation.y += delta * Math.PI / 8;
        //ref.current.rotation.z += delta * Math.PI / 80;
    })

    return <group scale={SCALE}>
                <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                    <PointMaterial 
                        transparent
                        vertexColors
                        size={0.028}
                        sizeAttenuation={true}
                        depthWrite={false}
                    />
                    <bufferAttribute
                        attach="geometry-attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                        args={[colors, 3]}
                     />
                </Points>
            </group>
           
           
}

