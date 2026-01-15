"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import ModelShowcase from "./model-showcase";
import styles from "./styles/homepage.module.scss"
import { CameraControls, Gltf, OrbitControls, PerspectiveCamera, TrackballControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from 'three';
import { routeModule } from "next/dist/build/templates/pages";
import { RouteKind } from "next/dist/server/route-kind";
import { useRouter } from "next/navigation";
import { preload } from "react-dom";

useGLTF.preload('/Duck.glb')

function CameraLogger() {
  const { camera } = useThree();
  const lastPosition = useRef({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    const pos = camera.position;
    // Only log if position has changed
    if (
      Math.abs(pos.x - lastPosition.current.x) > 0.01 ||
      Math.abs(pos.y - lastPosition.current.y) > 0.01 ||
      Math.abs(pos.z - lastPosition.current.z) > 0.01
    ) {
      console.log(`Camera position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`);
      lastPosition.current = { x: pos.x, y: pos.y, z: pos.z };
    }
  });

  return null;
}

export default function Page() {
  const router = useRouter();
return  <>
  <Canvas className={styles.homepage} 
            camera={{position:[6.65, 2.19, 4.15], fov: 50, near: 0.1, far: 100, zoom: 1.4}}
            >
            <ModelShowcase modelPath='/Duck.glb' />
            <CameraLogger />
            <TrackballControls
            target={[0, 1, 0]}
            staticMoving={false}
            dynamicDampingFactor={0.1}
            maxDistance={10}
            panSpeed={0.1}
            />
        </Canvas>
    <div className={styles.homeWrapper}>
      <p>Hi, I&apos;m David!</p>
        <div className={styles.buttonRow}>
          <div className={styles.homeButton} onClick={() => router.push('/about')}><p>about_me</p></div>
          <div className={styles.homeButton} onClick={() => router.push('/projects')}><p>projects</p></div>
          <div className={styles.homeButton} onClick={() => router.push('/contact')}><p>contact</p></div>
        </div>
      </div>
  </>
}

