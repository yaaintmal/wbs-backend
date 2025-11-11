import { model, Schema } from 'mongoose';

const postSchema = new Schema(
	{
		title: { type: String, required: [true, 'Title is required'] },
		author: {
			type: Schema.Types.ObjectId,
			required: [true, 'Author is required'],
			ref: 'User'
		},
		image: { type: String, required: [true, 'Cover image is required'] },
		content: { type: String, required: [true, 'Body is required'] }
	},
	{
		timestamps: true
	}
);

export default model('Post', postSchema);

// import { Schema, model } from 'mongoose';

// const postSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     author: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     image_url: {
//       type: [String],
//     },
//   },
//   { timestamps: true }
// );

// export default model('Post', postSchema);
