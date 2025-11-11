import { z } from 'zod';

export const userInputSchema = z
	.object({
		firstName: z
			.string({ error: 'firstName must be a string' })
			.min(2, { message: 'firstName must be at least 2 chars long' }),

		lastName: z
			.string({ error: 'lastName must be a string' })
			.min(2, { message: 'lastName must be at least 2 chars long' }),

		email: z
			.string({ error: 'email must me a string' })
			.email({ message: 'email must be a valid email address' })
	})
	.strict();

// export const postInputSchema = z.object({
//   title: z
//     .string({ error: 'title must be a string' })
//     .min(4, { message: 'title must be at least 4 characters long' }),

//   content: z
//     .string({ error: 'Content must be a string' })
//     .min(4, { message: 'content must be at least 4 characters long' }),
// });

export const postInputSchema = z.object({
	title: z.string('Title must be a string').min(1, 'Title is required'),
	image: z.string('Image must be a string').min(1, 'Image is required'),
	content: z.string('Content must be a string').min(1, 'Content is required'),
	author: z.string('Author must be a string').min(1, 'Author is required')
});

export const authLoginSchema = z
	.object({
		email: z
			.string({ error: 'email must me a string' })
			.email({ message: 'email must be a valid email address' }),
		password: z
			.string({ error: 'password must be a string' })
			.min(1, { message: 'password is required' })
	})
	.strict();

export const authRegisterSchema = z
	.object({
		firstName: z
			.string({ error: 'firstName must be a string' })
			.min(2, { message: 'firstName must be at least 2 chars long' }),

		lastName: z
			.string({ error: 'lastName must be a string' })
			.min(2, { message: 'lastName must be at least 2 chars long' }),

		email: z
			.string({ error: 'email must me a string' })
			.email({ message: 'email must be a valid email address' }),

		password: z
			.string({ error: 'password must be a string' })
			.min(8, { message: 'password must be at least 8 characters long' })
			.max(16, { message: 'password must be at most 64 characters long' })
			.regex(/[a-z]/, { message: 'password must include a lowercase letter' })
			.regex(/[A-Z]/, { message: 'password must include an uppercase letter' })
			.regex(/\d/, { message: 'password must include a number' })
			.regex(/[^A-Za-z0-9\s]/, {
				message: 'password must include a special character'
			})
	})
	.strict();

export const changePasswordSchema = z
	.object({
		currentPassword: z
			.string({ error: 'password must be a string' })
			.min(1, { message: 'current password is required' }),
		newPassword: z
			.string({ error: 'password must be a string' })
			.min(8, { message: 'password must be at least 8 characters long' })
			.max(64, { message: 'password must be at most 64 characters long' })
			.regex(/[a-z]/, { message: 'password must include a lowercase letter' })
			.regex(/[A-Z]/, { message: 'password must include an uppercase letter' })
			.regex(/\d/, { message: 'password must include a number' })
			.regex(/[^A-Za-z0-9\s]/, {
				message: 'password must include a special character'
			}),
		confirmNewPassword: z
			.string({ error: 'password must be a string' })
			.min(1, { message: 'confirm new password is required' })
	})
	.refine((d) => d.newPassword === d.confirmNewPassword, {
		path: ['confirmNewPassword'],
		message: 'passwords must match'
	})
	.strict();
