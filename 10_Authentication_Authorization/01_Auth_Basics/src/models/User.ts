import { Schema, model } from 'mongoose';

const userSchmea = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'firstname is required'],
    },
    lastName: {
      type: String,
      required: [true, 'lastname is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: false,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model('User', userSchmea);
