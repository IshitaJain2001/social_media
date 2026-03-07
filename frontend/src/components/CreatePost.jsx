import { useState } from 'react'
import { useSelector } from 'react-redux'
import '../styles/CreatePost.css'

export default function CreatePost({ onPostCreate }) {
  const user = useSelector(state => state.user)
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreatePost = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const tagsArray = hashtags.split(',').map(tag => tag.trim().replace('#', '')).filter(tag => tag)

      const res = await fetch('http://localhost:5000/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId,
          userName: user?.userName,
          content,
          image,
          hashtags: tagsArray
        })
      })

      if (res.ok) {
        setContent('')
        setImage('')
        setHashtags('')
        onPostCreate()
      } else {
        setError('Failed to create post')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="create-post-avatar">
          {user?.userName?.charAt(0).toUpperCase()}
        </div>
        <p className="create-post-greeting">What's on your mind, {user?.userName}?</p>
      </div>

      <textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="create-post-input"
        rows="4"
      />

      {image && (
        <div className="image-preview">
          <img src={image} alt="preview" />
          <button onClick={() => setImage('')} className="remove-image">✕</button>
        </div>
      )}

      <input
        type="text"
        placeholder="Add hashtags (comma separated)"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        className="hashtags-input"
      />

      <div className="create-post-footer">
        <div className="post-tools">
          <label className="tool-btn">
            🖼️ Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
          <button className="tool-btn">😊 Emoji</button>
          <button className="tool-btn">📍 Location</button>
        </div>

        {error && <p className="error">{error}</p>}

        <button 
          onClick={handleCreatePost} 
          disabled={loading}
          className="post-btn"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
