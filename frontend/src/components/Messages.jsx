import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../styles/Messages.css'

export default function Messages() {
  const user = useSelector(state => state.user)
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages()
    }
  }, [selectedUser])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`http://localhost:5000/messages/conversations/${user?.userId}`)
      const data = await res.json()
      if (res.ok) {
        setConversations(data.conversations)
      }
    } catch (err) {
      console.log('Error fetching conversations')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/messages/chat/${user?.userId}/${selectedUser.userId}`
      )
      const data = await res.json()
      if (res.ok) {
        setMessages(data.messages)
      }
    } catch (err) {
      console.log('Error fetching messages')
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return

    try {
      const res = await fetch('http://localhost:5000/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?.userId,
          senderName: user?.userName,
          receiverId: selectedUser.userId,
          receiverName: selectedUser.userName,
          message: messageText
        })
      })

      if (res.ok) {
        setMessageText('')
        fetchMessages()
        fetchConversations()
      }
    } catch (err) {
      console.log('Error sending message')
    }
  }

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h3>Messages</h3>
        {loading ? (
          <p>Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="no-conversations">No conversations yet</p>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.userId}
              className={`conversation-item ${selectedUser?.userId === conv.userId ? 'active' : ''}`}
              onClick={() => setSelectedUser(conv)}
            >
              <p className="conv-name">{conv.userName}</p>
              <p className="conv-last-msg">{conv.lastMessage?.substring(0, 30)}...</p>
            </div>
          ))
        )}
      </div>

      <div className="chat-area">
        {!selectedUser ? (
          <div className="no-chat-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3>{selectedUser.userName}</h3>
            </div>

            <div className="messages-display">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.senderId === user?.userId ? 'sent' : 'received'}`}
                >
                  <p>{msg.message}</p>
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>

            <div className="message-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
