import { ReactNode } from 'react'
import styles from '../../styles/blog.module.scss'

export type BlogPost = {
  id?: string
  title: string
  date?: string // ISO date or friendly string
  tags?: string[]
  excerpt?: string
  content?: ReactNode | string
  contentHtml?: string
}

export default function BlogEntry({ post }: { post: BlogPost }) {

  if (!post) {
    return <div className={styles.blogPost}>Select a post from the sidebar.</div>
  }

  return (
    <article className={styles.blogPost}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        {post.date && <time className={styles.date}>{post.date}</time>}
      </header>
      <div className={styles.meta}>
        {post.tags?.map((t) => (
          <span key={t} className={styles.tag}>#{t}</span>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml ?? String(post.content ?? '') }} />
    </article>
  )
}
