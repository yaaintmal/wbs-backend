import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '#models';
import type { z } from 'zod';
import type { authLoginSchema, authRegisterSchema } from '#schemas';
import {
  signAccessToken,
  signRefreshToken,
  accessCookieOpts,
  refreshCookieOpts,
} from '#utils';

/* ---------- DTOs inferred from Zod ---------- */
type RegisterDTO = z.infer<typeof authRegisterSchema>;
type LoginDTO = z.infer<typeof authLoginSchema>;

/* ---------------- REGISTER ---------------- */
export const register: RequestHandler<
  unknown,
  { message: string; user: any; token: string },
  RegisterDTO
> = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    throw new Error('registration failed', { cause: { status: 400 } });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  const accessToken = signAccessToken({
    jti: user._id.toString(),
    roles: user.roles,
  });

  res.cookie('accessToken', accessToken, accessCookieOpts).status(201).json({
    message: 'registereed successfully',
    user,
    token: accessToken,
  });
};

/* ---------------- LOGIN ---------------- */
export const login: RequestHandler<
  unknown,
  { message: string; user: any; accessToken: string; refreshToken: string },
  LoginDTO
> = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials', { cause: { status: 400 } });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials', { cause: { status: 400 } });
  }

  const accessToken = signAccessToken({
    jti: user._id.toString(),
    roles: user.roles,
    ver: user.tokenVersion,
  });

  const refreshToken = signRefreshToken({
    jti: user._id.toString(),
    roles: user.roles,
    ver: user.tokenVersion,
  });

  const { password: _, ...userWithoutPassword } = user.toObject();

  res
    .cookie('accessToken', accessToken, accessCookieOpts)
    .cookie('refreshToken', refreshToken, refreshCookieOpts)
    .status(200)
    .json({
      message: 'logged in',
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    });
};

/* ---------------- REFRESH ---------------- */
export const refresh: RequestHandler<
  unknown,
  { message: string; accessToken: string; refreshToken: string },
  unknown
> = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw (new Error('No refresh token'), { cause: { status: 401 } });
  }

  let payload: jwt.JwtPayload & { jti: string; ver?: number };

  try {
    payload = jwt.verify(token, process.env.REFRESH_JWT_SECRET!) as any;
  } catch {
    throw new Error('Invalid refresh token', { cause: { status: 401 } });
  }

  const user = await User.findById(payload.jti).select('+tokenVersion');
  if (!user) {
    throw new Error('something went wrong during /refresh', {
      cause: { status: 401 },
    });
  }

  if (payload.ver !== undefined && payload.ver !== user.tokenVersion) {
    throw new Error('refresh token revoked', { cause: { status: 401 } });
  }

  const newAccess = signAccessToken({
    jti: user._id.toString(),
    roles: user.roles,
    ver: user.tokenVersion,
  });

  const newRefresh = signRefreshToken({
    jti: user._id.toString(),
    roles: user.roles,
  });

  res
    .cookie('accessToken', newAccess, accessCookieOpts)
    .cookie('refreshToken', newRefresh, refreshCookieOpts)
    .json({
      message: 'refreshed',
      accessToken: newAccess,
      refreshToken: newRefresh,
    });
};

/* ---------------- LOGOUT ---------------- */
export const logout: RequestHandler = async (req, res) => {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message: 'looged out' });
};

/* ---------------- LOGOUT-ALL ---------------- */

export const logoutAll: RequestHandler = async (req, res) => {
  const id = req.user?.id;

  if (!id) {
    throw new Error('unauthorized', { cause: { status: 401 } });
  }

  await User.findByIdAndUpdate(id, { $inc: { tokenVersion: 1 } });

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message: 'logged out from all devices' });
};

/* ---------------- ME ---------------- */
// prettier-ignore
export const me: RequestHandler<
unknown,
{ user: any }
> = async (req, res) => {
  const id = req.user?.id;

  const user = await User.findById(id)

  if(!user) {
    throw new Error('User not found', {cause: {status: 404}})
  }
 
  res.json({user})
};
