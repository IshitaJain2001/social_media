import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import '../styles/Messages.css'

let socket

export default function Messages() {
  const user = useSelector(state => state.user)
  const [conversations, setConversations] = useState([])
  const [friends, setFriends] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState('')
  const [activeTab, setActiveTab] = useState('conversations')
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    socket = io('http://localhost:5000')

    socket.emit('user_connected', user?.userId)

    socket.on('online_users', (users) => {
      setOnlineUsers(users)
    })

    socket.on('receive_message', (data) => {
      if (selectedUser && data.senderId === selectedUser.userId) {
        setMessages(prev => [...prev, {
          senderId: data.senderId,
          message: data.message,
          createdAt: data.timestamp
        }])
      }
      fetchConversations()
    })

    socket.on('user_typing', (data) => {
      setTypingUser(data.senderName)
      setIsTyping(true)
    })

    socket.on('user_stop_typing', () => {
      setIsTyping(false)
      setTypingUser('')
    })

    fetchConversations()
    fetchFriends()
    setLoading(false)

    return () => {
      socket.disconnect()
    }
  }, [user?.userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`http://localhost:5000/messages/conversations/${user?.userId}`)
      const data = await res.json()
      if (res.ok) {
        setConversations(data.conversations)
      }
    } catch (err) {
      console.log('Error fetching conversations')
    }
  }

  const fetchFriends = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/friends/${user?.userId}`)
      const data = await res.json()
      console.log('Fetched friends data:', data)
      if (res.ok) {
        const friendsArray = Array.isArray(data.friends) ? data.friends : []
        console.log('Friends array:', friendsArray)
        setFriends(friendsArray)
      }
    } catch (err) {
      console.log('Error fetching friends:', err)
    }
  }

  const fetchMessages = async (friendId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/messages/chat/${user?.userId}/${friendId}`
      )
      const data = await res.json()
      if (res.ok) {
        setMessages(data.messages)
      }
    } catch (err) {
      console.log('Error fetching messages')
    }
  }

  const handleSelectUser = (userObj) => {
    setSelectedUser(userObj)
    fetchMessages(userObj._id || userObj.userId)
    setIsTyping(false)
    setTypingUser('')
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    if (!selectedUser) {
      alert('Please select a friend first')
      return
    }

    const friendId = selectedUser._id || selectedUser.userId
    const friendName = selectedUser.userName || selectedUser.name

    console.log('User:', user)
    console.log('SelectedUser:', selectedUser)
    console.log('FriendId:', friendId)
    console.log('FriendName:', friendName)

    if (!friendId || !friendName) {
      alert('Error: Friend data incomplete')
      return
    }

    const msgData = {
      senderId: user?.userId,
      receiverId: friendId,
      message: messageText
    }

    socket.emit('send_message', msgData)
    socket.emit('stop_typing', { receiverId: friendId })

    try {
      const sendData = {
        senderId: user?.userId,
        senderName: user?.userName,
        receiverId: friendId,
        receiverName: friendName,
        message: messageText
      }

      console.log('Sending message:', sendData)

      const res = await fetch('http://localhost:5000/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData)
      })

      const data = await res.json()
      console.log('Response:', data)

      if (res.ok) {
        setMessages(prev => [...prev, {
          senderId: user?.userId,
          message: messageText,
          createdAt: new Date()
        }])
        setMessageText('')
        fetchConversations()
      } else {
        alert('Error: ' + (data.message || 'Failed to send message'))
      }
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Network error: ' + err.message)
    }
  }

  const handleTyping = () => {
    socket.emit('typing', { 
      receiverId: selectedUser._id || selectedUser.userId,
      senderName: user?.userName
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { receiverId: selectedUser._id || selectedUser.userId })
    }, 1000)
  }

  const isUserOnline = onlineUsers.includes(selectedUser?._id || selectedUser?.userId)

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h3>💬 Messages</h3>
        
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'conversations' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversations')}
          >
            📧 Conversations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            👥 Friends
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : activeTab === 'conversations' ? (
          conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            conversations.map(conv => {
              const convObj = {
                _id: conv.userId,
                userId: conv.userId,
                firstName: conv.userName?.split(' ')[0] || conv.userName,
                lastName: conv.userName?.split(' ')[1] || '',
                userName: conv.userName
              }
              const isOnline = onlineUsers.includes(conv.userId)
              return (
                <div
                  key={conv.userId}
                  className={`conversation-item ${selectedUser?.userId === conv.userId || selectedUser?._id === conv.userId ? 'active' : ''}`}
                  onClick={() => handleSelectUser(convObj)}
                >
                  <div className="conv-header">
                    <p className="conv-name">{conv.userName}</p>
                    <div className={`online-indicator ${isOnline ? 'online' : 'offline'}`} />
                  </div>
                  <p className="conv-last-msg">{conv.lastMessage?.substring(0, 30)}...</p>
                  <p className="conv-time">
                    {new Date(conv.lastMessageTime).toLocaleTimeString()}
                  </p>
                </div>
              )
            })
          )
        ) : (
          friends.length === 0 ? (
            <p className="no-friends">No friends yet</p>
          ) : (
            friends.map(friend => {
              const friendId = friend._id || friend.id
              const isOnline = onlineUsers.includes(friendId)
              const friendObj = {
                _id: friendId,
                userId: friendId,
                firstName: friend.firstName || '',
                lastName: friend.lastName || '',
                userName: friend.userName || friend.userName,
                profilePicture: friend.profilePicture
              }
              return (
                <div
                  key={friendId}
                  className={`conversation-item ${selectedUser?._id === friendId || selectedUser?.userId === friendId ? 'active' : ''}`}
                  onClick={() => handleSelectUser(friendObj)}
                >
                  <div className="friend-avatar-small">
                    {friend.profilePicture ? (
                      <img src={friend.profilePicture} alt={friend.userName} />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {friend.firstName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="friend-info">
                    <p className="conv-name">{friend.firstName} {friend.lastName}</p>
                    <p className="conv-username">@{friend.userName}</p>
                  </div>
                  <div className={`online-indicator ${isOnline ? 'online' : 'offline'}`} />
                </div>
              )
            })
          )
        )}
      </div>

      <div className="chat-area">
        {!selectedUser ? (
          <div className="no-chat-selected">
            <p>👋 Select a friend to start chatting</p>
            <p className="sub-text">Choose from your conversations or friends list</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className={`status ${isUserOnline ? 'online' : 'offline'}`}>
                  {isUserOnline ? '🟢 Online' : '⚫ Offline'}
                </p>
              </div>
            </div>

            <div className="messages-display">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation! 💬</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.senderId === user?.userId ? 'sent' : 'received'}`}
                  >
                    <p className="message-text">{msg.message}</p>
                    <small className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </small>
                  </div>
                ))
              )}

              {isTyping && (
                <div className="message received typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value)
                  if (e.target.value) handleTyping()
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="send-btn">
                📤 Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
