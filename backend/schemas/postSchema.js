import { model, Schema } from "mongoose"

const postSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userProfilePicture: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  image: {
    type: String,
    default: null
  },
  likes: [{
    type: String,
    default: null
  }],
  comments: [{
    userId: String,
    userName: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  hashtags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const postModel = model("Posts", postSchema)
export default postModel
