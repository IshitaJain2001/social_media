import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from './CreatePost'
import PostCard from './PostCard'
import '../styles/Feed.css'

export default function Feed() {
  const user = useSelector(state => state.user)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      const res = await fetch(`http://localhost:5000/posts/feed/${user?.userId}`)
      const data = await res.json()
      if (res.ok) {
        setPosts(data.posts)
      }
    } catch (err) {
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const res = await fetch('http://localhost:5000/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user?.userId })
      })

      if (res.ok) {
        fetchFeed()
      }
    } catch (err) {
      console.log('Error liking post')
    }
  }

  const handleComment = async (postId, text) => {
    try {
      const res = await fetch('http://localhost:5000/posts/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: user?.userId,
          userName: user?.userName,
          text
        })
      })

      if (res.ok) {
        fetchFeed()
      }
    } catch (err) {
      console.log('Error adding comment')
    }
  }

  const handleDelete = async (postId) => {
    try {
      const res = await fetch('http://localhost:5000/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user?.userId })
      })

      if (res.ok) {
        setPosts(posts.filter(p => p._id !== postId))
      }
    } catch (err) {
      console.log('Error deleting post')
    }
  }

  return (
    <div className="feed">
      <CreatePost onPostCreate={fetchFeed} />

      {loading && <p className="loading">Loading feed...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && posts.length === 0 && (
        <div className="no-posts">
          <p>No posts yet. Start following friends!</p>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
