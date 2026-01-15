"use client"
import { TrackballControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import ModelShowcase from "./model-showcase";
import styles from "./styles/homepage.module.scss";

useGLTF.preload('/Duck.glb')

export default function Page() {
  const router = useRouter();
return  <>
  <Canvas className={styles.homepage} 
            camera={{position:[6.65, 2.19, 4.15], fov: 50, near: 0.1, far: 100, zoom: 1.4}}
            >
            <ModelShowcase modelPath='/Duck.glb' />
            <TrackballControls
            target={[0, 1, 0]}
            staticMoving={false}
            dynamicDampingFactor={0.1}
            maxDistance={10}
            panSpeed={0.1}
            />
        </Canvas>
    <div className={styles.homeWrapper}>
      <p>Hi, I&apos;m <strong>David</strong>!</p>
        <div className={styles.buttonRow}>
          <div className={styles.homeButton} onClick={() => router.push('/about')}><p>about_me</p></div>
          <div className={styles.homeButton} onClick={() => router.push('/projects')}><p>projects</p></div>
          <div className={styles.homeButton} onClick={() => router.push('/contact')}><p>contact</p></div>
        </div>
      </div>
  </>
}

