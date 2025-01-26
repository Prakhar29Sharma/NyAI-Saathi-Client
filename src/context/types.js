export const ChatTypes = {
  Message: {
    id: String,
    text: String,
    isUser: Boolean,
    timestamp: String
  },
  Chat: {
    id: String,
    title: String,
    messages: Array,
    timestamp: String
  }
};