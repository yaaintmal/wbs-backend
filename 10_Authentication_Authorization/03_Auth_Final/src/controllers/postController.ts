import type { RequestHandler } from 'express';
import { Post } from '#models';
import { z } from 'zod';
import type { postInputSchema } from '#schemas';

type PostInputDTO = z.infer<typeof postInputSchema>;

/* ---------- CREATE ---------- */
// prettier-ignore
export const createPost: RequestHandler<
unknown,
any,
PostInputDTO> = async (
  req,
  res
) => {
  const userId = req.user?.id;
  
  const { title, content } = req.body; // !
  const files = (req.files as Express.Multer.File[]) || [];
  const imageUrl = files.map((f) => f.path);

  const newPost = await Post.create({
    title,
    content,
    author: userId,
    image_url: imageUrl,
  });

  // console.log('cloudinary upload results', files);
  res.status(201).json(newPost);
};

/* ---------- READ ALL ---------- */
export const getAllPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find().populate(
    'author',
    'firstName lastName email'
  );

  if (!posts.length) {
    throw new Error('Post not found', { cause: { status: 404 } });
  }
  res.status(200).json(posts);
};

/* ---------- READ ONE ---------- */
export const getPostById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('author', 'firstName lastName');

  if (!post) {
    throw new Error('Post not found', { cause: { status: 404 } });
  }
  res.status(200).json(post);
};

/* ---------- UPDATE  ---------- */
// prettier-ignore
export const updatePost: RequestHandler<
  { id: string },
  any,
  PostInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const files = (req.files as Express.Multer.File[]) || [];

  const imageUrl = files.map((f) => f.path);

  const updateData: any = { title, content };

  if (imageUrl.length > 0) {
    updateData.image_url = imageUrl;
  }

  const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('author', 'firstName lastName');

  if (!updatedPost) {
    throw new Error('Post not found', { cause: { status: 404 } });
  }

  res.status(200).json({
    message: 'post updated successfully',
    post: updatedPost,
  });
};

/* ---------- DELETE ---------- */
export const deletePost: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) {
    throw new Error('Post not found', { cause: { status: 404 } });
  }

  res.status(200).json({
    message: `Post with id:${id} was deleted`,
  });
};
