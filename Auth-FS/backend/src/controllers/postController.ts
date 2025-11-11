import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '#models';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export const getAllPosts: RequestHandler = async (_req, res) => {
	const posts = await Post.find().populate('author', 'firstName _id').lean();
	res.json(posts);
};

export const createPost: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new Error('Unauthorized', { cause: { status: 401 } });
  }

  const { title, content } = req.body;
  let imageUrl = '';

  if (req.file) {
    console.log('Processing image file:', req.file.originalname, req.file.size);

    try {
      console.log('Starting sharp processing...');
      // Process image with sharp
      const processedImage = await sharp(req.file.path)
        .resize(800, 600, { fit: 'inside' })
        .webp({ quality: 87 })
        .toBuffer();
      console.log('Sharp processing done, buffer size:', processedImage.length);

      if (processedImage.length === 0) {
        throw new Error('Processed image is empty');
      }

      // Save processed image to uploads/processed/
      const processedDir = path.resolve('uploads', 'processed');
      await fs.mkdir(processedDir, { recursive: true });

      const processedFilename = `processed-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
      const processedPath = path.join(processedDir, processedFilename);

      await fs.writeFile(processedPath, processedImage);
      console.log('Processed image saved to:', processedPath);

      // Remove original uploaded file
      await fs.unlink(req.file.path);

      imageUrl = `${req.protocol}://${req.get('host')}/uploads/processed/${processedFilename}`;
      console.log('Image URL:', imageUrl);
      console.log('Full path:', processedPath);
    } catch (error) {
      console.error('Image processing/save error:', error);
      throw new Error(`Failed to process image: ${(error as Error).message}`, { cause: { status: 500 } });
    }
  }

  const newPost = await Post.create({ title, content, image: imageUrl, author: req.user.id });
  res.status(201).json(newPost);
};

export const getPostById: RequestHandler = async (req, res) => {
	const {
		params: { id }
	} = req;
	if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
	const post = await Post.findById(id).populate('author', 'firstName _id').lean();
	if (!post)
		throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });
	res.send(post);
};

export const updatePost: RequestHandler = async (req, res) => {
	const {
		params: { id }
	} = req;
	if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

	const { title, content } = req.body;
	let imageUrl = '';

	if (req.file) {
		console.log('Processing image file:', req.file.originalname, req.file.size);

		try {
			console.log('Starting sharp processing...');
			// Process image with sharp
			const processedImage = await sharp(req.file.path)
				.resize(800, 600, { fit: 'inside' })
				.webp({ quality: 87 })
				.toBuffer();
			console.log('Sharp processing done, buffer size:', processedImage.length);

			if (processedImage.length === 0) {
				throw new Error('Processed image is empty');
			}

			// Save processed image to uploads/processed/
			const processedDir = path.resolve('uploads', 'processed');
			await fs.mkdir(processedDir, { recursive: true });

			const processedFilename = `processed-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
			const processedPath = path.join(processedDir, processedFilename);

			await fs.writeFile(processedPath, processedImage);
			console.log('Processed image saved to:', processedPath);

			// Remove original uploaded file
			await fs.unlink(req.file.path);

			imageUrl = `${req.protocol}://${req.get('host')}/uploads/processed/${processedFilename}`;
			console.log('Image URL:', imageUrl);
		} catch (error) {
			console.error('Image processing/save error:', error);
			throw new Error(`Failed to process image: ${(error as Error).message}`, { cause: { status: 500 } });
		}
	}

	const updateData: any = { title, content };
	if (imageUrl) updateData.image = imageUrl;

	const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
		new: true
	});
	if (!updatedPost)
		throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });
	res.json(updatedPost);
};

export const deletePost: RequestHandler = async (req, res) => {
	const {
		params: { id }
	} = req;
	if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
	const deletedPost = await Post.findByIdAndDelete(id);
	if (!deletedPost)
		throw new Error(`Post with id of ${id} doesn't exist`, { cause: 404 });
	res.json({ success: `Post with id of ${id} was deleted` });
};
