import type { RequestHandler } from 'express';
import { Post } from '#models';

export const getAllPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find()
    .lean()
    .populate('author', 'firstName lastName roles');

  if (!posts.length) {
    throw new Error('No post found', { cause: { status: 404 } });
  }

  res.json(posts);
};

export const createPost: RequestHandler = async (req, res) => {
  const { title, image, content } = req.body;

  const post = await Post.create({
    title,
    image,
    content,
    author: req.user?.id,
  });
  res.status(201).json({ message: 'Post Created', post });
};

export const getSinglePost: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id)
    .lean()
    .populate('author', 'firstName lastName roles');

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json(post);
};

export const updatePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, image, content } = req.body;

  const post = await Post.findByIdAndUpdate(
    id,
    { title, image, content },
    { new: true, runValidators: true }
  );

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json({ message: 'post uptaded', post });
};

export const deletePost: RequestHandler = async (req, res) => {
  const { id } = req.params;

  await Post.findByIdAndDelete(id);

  res.json({ message: `Post with id:${id} was deleted` });
};
