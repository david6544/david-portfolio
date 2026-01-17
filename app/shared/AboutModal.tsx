"use client"

import styles from '@/app/styles/about.module.scss'
import { Canvas } from '@react-three/fiber'
import ModelShowcase from './model-showcase'

type Props = {
  name: string
  description?: string
  modelPath?: string
  fields?: Record<string, string>
  links?: {
    linkedin?: string
    github?: string
    leetcode?: string
  }
}

export default function AboutModal({ 
  name,
   description,
     modelPath = '/Helmet/scene.gltf',
      fields = {},
      links = {} }: Props
  ) {
  const renderedDescription = description ? description.replace(/\\n/g, '\n') : undefined;

  return <div className={styles.container}>
      <div className={styles.overlay} />

      <div className={styles.card} role="dialog" aria-modal="true" aria-labelledby="idcard-title">
        <div className={styles.photoSlot}>
          <Canvas camera={
                {   position: [0, 0, 3],
                    fov: 20,
                    near: 0.1,
                    far: 100
                }}
                style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.6} />
            <directionalLight 
                position={[5, 5, 5]}
                intensity={0.8}
            />
            <ModelShowcase 
                modelPath={modelPath}
                opacity={1} 
                scale={0.0068}
            />
          </Canvas>
        </div>

        <div className={styles.info}>
          <div className={styles.headerRow}>
            <h2 id="idcard-title" className={styles.name}>{name}</h2>
            <button className={styles.closeButton} aria-label="Close">✕</button>
          </div>

          {renderedDescription && <p className={styles.desc}>{renderedDescription}</p>}

          <div className={styles.fields}>
            {Object.entries(fields).map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}>
                <div className={styles.field}>
                  <span className={styles.fieldKey}>{k}</span>
                  <span className={styles.fieldVal}>{v}</span>
                </div>
                <br></br>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', }}>
              {links.linkedin && (
                <a className={styles.iconLink} href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img">
                    <title>LinkedIn</title>
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.84v2.18h.05c.54-1.02 1.86-2.09 3.84-2.09C20.5 8.09 22 10.2 22 13.69V24h-4v-9.07c0-2.16-.04-4.94-3.01-4.94-3.01 0-3.47 2.35-3.47 4.78V24h-4V8z" />
                  </svg>
                </a>
              )}

              {links.github && (
                <a className={styles.iconLink} href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img">
                    <title>GitHub</title>
                    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.94 3.19 9.12 7.61 10.6.56.1.76-.24.76-.54 0-.27-.01-1-.02-1.96-3.09.67-3.74-1.49-3.74-1.49-.5-1.28-1.22-1.62-1.22-1.62-.99-.68.07-.67.07-.67 1.1.08 1.67 1.13 1.67 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.47-.28-5.07-1.24-5.07-5.52 0-1.22.44-2.21 1.16-2.99-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.12 1.15.9-.25 1.86-.37 2.82-.37.96 0 1.92.12 2.82.37 2.17-1.45 3.12-1.15 3.12-1.15.61 1.57.23 2.73.11 3.02.72.78 1.16 1.77 1.16 2.99 0 4.29-2.61 5.24-5.09 5.51.39.34.74 1.01.74 2.04 0 1.47-.01 2.65-.01 3.01 0 .3.2.65.77.54C19.06 20.86 22.25 16.68 22.25 11.75 22.25 5.48 17.27.5 11 .5h1z" />
                  </svg>
                </a>
              )}

              {links.leetcode && (
                <a className={styles.iconLink} href={links.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img">
                    <title>LeetCode</title>
                    <path d="M13.483 0a1.374 1.374 0 0 0 -0.961 0.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0 -1.209 2.104 5.35 5.35 0 0 0 -0.125 0.513 5.527 5.527 0 0 0 0.062 2.362 5.83 5.83 0 0 0 0.349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193 0.039 0.038c2.248 2.165 5.852 2.133 8.063 -0.074l2.396 -2.392c0.54 -0.54 0.54 -1.414 0.003 -1.955a1.378 1.378 0 0 0 -1.951 -0.003l-2.396 2.392a3.021 3.021 0 0 1 -4.205 0.038l-0.02 -0.019 -4.276 -4.193c-0.652 -0.64 -0.972 -1.469 -0.948 -2.263a2.68 2.68 0 0 1 0.066 -0.523 2.545 2.545 0 0 1 0.619 -1.164L9.13 8.114c1.058 -1.134 3.204 -1.27 4.43 -0.278l3.501 2.831c0.593 0.48 1.461 0.387 1.94 -0.207a1.384 1.384 0 0 0 -0.207 -1.943l-3.5 -2.831c-0.8 -0.647 -1.766 -1.045 -2.774 -1.202l2.015 -2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0 -1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38 -1.382 1.38 1.38 0 0 0 -1.38 -1.382z" fill="#FFFFFF" strokeWidth={1}></path>
                  </svg>
                </a>
                
                
              )}
        </div>
      </div>
    </div>
  </div>
  </div>
}
