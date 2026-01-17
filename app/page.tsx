"use client"
import { useSpring } from "@react-spring/three";
import { TrackballControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { create } from "zustand";
import AboutModal from "./shared/AboutModal";
import BlogSection from "./sections/BlogSection";
import ModelShowcase from "./shared/model-showcase";
import Navbar from "./shared/navbar";
import ProjectModal from './shared/ProjectModal';
import ProjectOrbit, { projects as PROJECTS } from "./shared/spiral-galaxy";
import StarField from "./shared/star-field";
import styles from "./styles/homepage.module.scss";

useGLTF.preload('/Duck.glb')
useGLTF.preload('/Helmet/scene.gltf')

export type section = "About" | "Projects" | "Blog" |"Home";

export interface StoreState {
  currentView : section,
  updateCurrentView : (newSection : section) => void;
  selectedProject: number | null,
  updateSelectedProject: (idx: number | null) => void;
}

export const useStoreHook = create<StoreState>((set) => ({
  currentView: "Home",
  updateCurrentView: (newSection : section) => set({ currentView: newSection}),
  selectedProject: null,
  updateSelectedProject: (idx: number | null) => set({ selectedProject: idx }),
} satisfies StoreState));

export default function Page() {

  const selectedProject = useStoreHook((state) => state.selectedProject)
  const setSelectedProject = useStoreHook((state) => state.updateSelectedProject)

  const setView = useStoreHook((state) => state.updateCurrentView);
  const currentView = useStoreHook().currentView;
  const disableControls = currentView === "Blog";

  const { duckOpacity, cubeOpacity } = useSpring({
    duckOpacity: currentView === "Home" ? 1 : 0,
    cubeOpacity: currentView === "Home" ? 0 : 1,
  });

return  <>
  {currentView != "Home" && <Navbar/>}
  <Canvas className={styles.homepage} 
            camera={{position:[5.65, 2.19, 3.15], fov: 50, near: 0.1, far: 100, zoom: 1.4}}
            >
            { currentView === "Home" &&
              <ModelShowcase modelPath='/Duck.glb' opacity={duckOpacity} />
            }
            {currentView === "Blog" && (
              <StarField opacity={cubeOpacity} speedX={0.01} speedY={0.02}/>
            )}
            { currentView === "Projects" &&
              <ProjectOrbit onSelect={(i) => setSelectedProject(i)} />
            }
            { currentView === "About" &&
              <StarField opacity={cubeOpacity} />
            }
              <TrackballControls
                target={[0, -0.8, 0]}
                staticMoving={false}
                dynamicDampingFactor={0.1}
                noZoom={disableControls}
                noPan={disableControls}
                noRotate={disableControls}
                maxDistance={40}
                panSpeed={0.1}
              />
        </Canvas>
    { /* Overlay containers should not block canvas interactions — let pointer events pass through by default */ }
    { currentView == "About" && 
        <div className={styles.overlayContainer}>
            <div className={styles.overlayContent}>
                <AboutModal
                    name="David Maslov"
                    description="I'm a software engineer with a passion for robotics, space, and anything low-level! Currently studying a Bachelor of Mechanical Engineering at Adelaide University and working as a software engineer @ Fivecast. \n\nWhen I'm not down a rabbit hole of code you can find me watching movies, out hiking or walking my dog. I also enjoy reading, writing and things literature! \n\nI'm currently looking for anything interesting to work on to develop my skills as a software engineer, feel free to to connect!"
                    modelPath="/Helmet/scene.gltf"
                    fields={{ 
                      Contact: 'maslov.david@outlook.com',
                      Experience: 'C++, Java, TypeScript, React, Python, Three.js',
                      Location: 'Adelaide, Australia' 
                    }}
                    links={{
                      leetcode: 'https://leetcode.com/u/david6544/',
                      github: 'https://github.com/david6544',
                      linkedin: 'https://www.linkedin.com/in/david-maslov/'
                    }}
                />
            </div>
        </div>
    }
    { currentView == "Blog" &&
         <div className={`${styles.overlayContainer} ${styles.overlayContainerBlog}`}>
            <div className={styles.overlayContent}>
                <BlogSection/>
            </div>
        </div>
    }
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
    {/* Minimal modal implementation for testing */}
    {selectedProject !== null && (
      <ProjectModal project={PROJECTS[selectedProject]} onClose={() => setSelectedProject(null)} />
    )}
  </>
}

