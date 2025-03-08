import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        body: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now()
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
},{timestamps:true})

const ChatModel = mongoose.models.chat || mongoose.model('chat',chatSchema)

export default ChatModel