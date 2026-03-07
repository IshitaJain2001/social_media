import { useState } from 'react'
import { useSelector } from 'react-redux'
import '../styles/PostCard.css'

export default function PostCard({ post, onLike, onComment, onDelete }) {
  const user = useSelector(state => state.user)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleLike = () => {
    onLike(post._id)
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    await onComment(post._id, commentText)
    setCommentText('')
  }

  const isLiked = post.likes?.includes(user?.userId)

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar">
            {post.userProfilePicture ? (
              <img src={post.userProfilePicture} alt={post.userName} />
            ) : (
              <div className="avatar-placeholder">
                {post.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="post-meta">
            <p className="post-user-name">{post.userName}</p>
            <p className="post-time">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {post.userId === user?.userId && (
          <button onClick={() => onDelete(post._id)} className="delete-btn">
            ✕
          </button>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="post" className="post-image" />
        )}
        {post.hashtags?.length > 0 && (
          <div className="hashtags">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="hashtag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="post-stats">
        <span>{post.likes?.length || 0} Likes</span>
        <span>{post.comments?.length || 0} Comments</span>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ❤️ {isLiked ? 'Liked' : 'Like'}
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comment
        </button>
        <button className="action-btn">
          🔗 Share
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {post.comments?.map((comment, idx) => (
              <div key={idx} className="comment">
                <p className="comment-user"><strong>{comment.userName}</strong></p>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="add-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  )
}
