"use client"

import { useState } from 'react'
import Image from 'next/image'
import styles from '../styles/project-modal.module.scss'
import { ProjectDetails } from './spiral-galaxy'

export default function ProjectModal({ project, onClose }: { project: ProjectDetails, onClose: () => void }) {
  const photos = (project.photos || []).filter(Boolean)
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className={styles.container}>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={`project-${project.name}-title`}>
        <div className={styles.header}>
          <h3 id={`project-${project.name}-title`} className={styles.title}>{project.name}</h3>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">✕</button>
        </div>

        <p className={styles.description}>{project.description}</p>

        {project.techStack && project.techStack.length > 0 && (
          <div className={styles.tags} aria-label="Tech stack">
            {project.techStack.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className={styles.gallery}>
            {/* Main image is hidden until a thumbnail is clicked */}
            {active !== null && (
              <div className={styles.mainImageWrapper}>
                <Image
                  src={`/photos/${photos[active]}`}
                  alt={`${project.name} photo ${active + 1}`}
                  fill
                  className={styles.mainImage}
                />
              </div>
            )}

            <div className={styles.thumbnailRow}>
              {photos.map((p, i) => (
                <button key={p} className={`${styles.thumbnail} ${i === active ? styles.activeThumbnail : ''}`} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`}>
                  <Image src={`/photos/${p}`} alt={`thumb ${i + 1}`} width={64} height={42} className={styles.thumbnailImage} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {/* Ensure link includes a scheme; open in a new tab safely */}
          {project.link ? (
            (() => {
              const href = /^(https?:)?\/\//i.test(project.link) ? project.link : `https://${project.link}`;
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.secondary}`}>
                  Github Link
                </a>
              )
            })()
          ) : (
            <span className={`${styles.button} ${styles.secondary}`}>No demo available</span>
          )}
        </div>
      </div>
    </div>
  )
}