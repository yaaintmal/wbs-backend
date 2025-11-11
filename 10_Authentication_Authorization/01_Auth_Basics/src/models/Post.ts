import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
  },
  image: {
    type: String,
    required: [true, 'image is required'],
  },
  content: {
    type: String,
    required: [true, 'content is required'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
});

export default model('Post', postSchema);
