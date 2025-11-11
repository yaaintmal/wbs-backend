import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	updatePost
} from '#controllers';
import {
	authenticate,
	authorize,
	// upload,
	validateBodyZod
} from '#middlewares';
import { Post } from '#models';
import { postInputSchema } from '#schemas';
import { Router } from 'express';

const postRoutes = Router();

postRoutes.get('/', getAllPosts);
postRoutes.get('/:id', getPostById);

postRoutes.post(
	'/',
	authenticate,
	// upload.array('image', 5),
	validateBodyZod(postInputSchema),
	createPost
);

postRoutes.put(
	'/:id',
	authenticate,
	authorize(Post),
	// upload.array('image', 5),
	validateBodyZod(postInputSchema),
	updatePost
);

postRoutes.delete('/:id', authenticate, authorize(Post), deletePost);

export default postRoutes;
