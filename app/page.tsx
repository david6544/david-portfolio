"use client"
import { useSpring } from "@react-spring/three";
import { TrackballControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { create } from "zustand";
import AboutSection from "./sections/AboutSection";
import BlogSection from "./sections/BlogSection";
import ProjectsSection from "./sections/ProjectSection";
import ModelShowcase from "./shared/model-showcase";
import StarField from "./shared/star-field";
import Navbar from "./shared/navbar";
import styles from "./styles/homepage.module.scss";

useGLTF.preload('/Duck.glb')
useGLTF.preload('/SciFiHelmet/SciFiHelmet.gltf')

export type section = "About" | "Projects" | "Blog" |"Home";

export interface StoreState {
  currentView : section,
  updateCurrentView : (newSection : section) => void;
}

export const useStoreHook = create<StoreState>((set) => ({
  currentView: "Home",
  updateCurrentView: (newSection : section) => set({ currentView: newSection}),
} satisfies StoreState));

export default function Page() {
  const disableControls = false;

  const setView = useStoreHook((state) => state.updateCurrentView);
  const currentView = useStoreHook().currentView;

  const { duckOpacity, cubeOpacity } = useSpring({
    duckOpacity: currentView === "Home" ? 1 : 0,
    cubeOpacity: currentView === "Home" ? 0 : 1,
  });

return  <>
  {currentView != "Home" && <Navbar/>}
  <Canvas className={styles.homepage} 
            camera={{position:[5.65, 2.19, 3.15], fov: 50, near: 0.1, far: 100, zoom: 1.4}}
            >
            <ModelShowcase modelPath='/Duck.glb' opacity={duckOpacity} />
            {currentView === "Blog" ? (
              <StarField opacity={cubeOpacity} />
            ) : (
              <ModelShowcase modelPath='/SciFiHelmet/SciFiHelmet.gltf' opacity={cubeOpacity} />
            )}
              <TrackballControls
                target={[0, -0.8, 0]}
                staticMoving={false}
                dynamicDampingFactor={0.1}
                noZoom={disableControls}
                noPan={disableControls}
                noRotate={disableControls}
                maxDistance={10}
                panSpeed={0.1}
              />
        </Canvas>
    { /* Overlay containers should not block canvas interactions — let pointer events pass through by default */ }
    { currentView == "About" && <div className={styles.overlayContainer}><div className={styles.overlayContent}><AboutSection/></div></div>}
    { currentView == "Projects" && <div className={styles.overlayContainer}><div className={styles.overlayContent}><ProjectsSection/></div></div>}
    { currentView == "Blog" && <div className={`${styles.overlayContainer} ${styles.overlayContainerBlog}`}><div className={styles.overlayContent}><BlogSection/></div></div>}
    { currentView == "Home" && 
      <div className={styles.homeWrapper}>
        <p>Hi, I&apos;m <strong>David</strong>!</p>
          <div className={styles.buttonRow}>
            <div  className={styles.homeButton}
                  onClick={() => setView("About")}
                  >
                    <p>about_me</p>
            </div>
            <div className={styles.homeButton} 
                onClick={() => setView("Projects")}
                >
                  <p>projects</p>
            </div>
            <div className={styles.homeButton} onClick={() => setView("Blog")}> 
              <p>blog</p>
            </div>
          </div>
        </div>
    }
  </>
}

