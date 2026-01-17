"use client"

import { useState } from 'react'
import BlogEntry, { BlogPost } from './shared/BlogEntry'
import { useEffect } from 'react'
import styles from '../styles/blog.module.scss'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const POST_FILES = [
    'on-leadership.md',
    'project-notes.md',
]


export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [currentPost, setCurrentPost] = useState<BlogPost | undefined>();

  // List of markdown files inside public/posts. If you add more .md files,
  // add them here (they live in `/public/posts`). We intentionally fetch
  // from the `public` folder so no API or extra routes are required.

  useEffect(() => {
    let mounted = true

    async function loadPosts() {
      const loaded: BlogPost[] = []

      await Promise.all(
        POST_FILES.map(async (file) => {
          try {
            const res = await fetch(`/posts/${file}`)
            if (!res.ok) return
            const text = await res.text()

            const parsed = matter(text)
            const processed = await remark().use(html).process(parsed.content)
            const contentHtml = processed.toString()

            const slug = file.replace(/\.md$/i, '')

            // Ensure `date` is a string (gray-matter may parse dates into Date objects)
            let dateStr: string | undefined = undefined
            if (parsed.data && parsed.data.date) {
              const d = parsed.data.date
              dateStr = d instanceof Date ? d.toISOString().split('T')[0] : String(d)
            }

            loaded.push({
              id: slug,
              title: parsed.data.title || slug,
              date: dateStr,
              tags: parsed.data.tags || [],
              excerpt: parsed.data.excerpt || undefined,
              content: parsed.content,
              contentHtml,
            })
          } catch (e) {
            // ignore missing/invalid files
          }
        }),
      )

      // sort by date if available (newest first)
      loaded.sort((a, b) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      if (!mounted) return
      setPosts(loaded)
      setCurrentPost(loaded[0])
    }

    loadPosts()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className={styles.container}>
      <section className={styles.layout}>
        <div className={styles.sidebar}>

          <div className={styles.postList}>
            {posts.map((p) => (
              <button
                key={p.id}
                onClick={() => setCurrentPost(p)}
                className={
                  currentPost?.id === p.id
                    ? `${styles.postButton} ${styles.postButtonActive}`
                    : styles.postButton
                }
              >
                <div className={styles.postTitle}>{p.title}</div>
                {p.date && <div className={styles.postDate}>{p.date}</div>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.contentArea}>
          <BlogEntry post={currentPost as BlogPost} />
        </div>
      </section>
    </div>
  )
}