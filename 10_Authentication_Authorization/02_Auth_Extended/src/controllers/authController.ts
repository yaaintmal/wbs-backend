import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '#models';
import type { z } from 'zod';
import type { authLoginSchema, authRegisterSchema } from '#schemas';

/* ---------- DTOs inferred from Zod ---------- */
type RegisterDTO = z.infer<typeof authRegisterSchema>;
type LoginDTO = z.infer<typeof authLoginSchema>;

/* ENV HELPERS */
const ACCESS_TTL_SEC = Number(process.env.ACCESS_TOKEN_TTL ?? 900);
const JWT_SECRET = process.env.ACCESS_JWT_SECRET!;
const JWT_ISSUER = process.env.JWT_ISSUER ?? 'WDG024';

// SignAccessToken
const signAccessToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${ACCESS_TTL_SEC}s`,
    issuer: JWT_ISSUER,
  });

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

  const token = signAccessToken({
    jti: user._id.toString(),
    roles: user.roles,
  });

  res
    .cookie('accessToken', token, {
      httpOnly: true,
      // sameSite,
      // secure: true
      maxAge: ACCESS_TTL_SEC * 1000,
    })
    .status(201)
    .json({
      message: 'registered successfully',
      user: user,
      token,
    });
};

/* ---------------- LOGIN ---------------- */
export const login: RequestHandler<
  unknown,
  { message: string; user: any; token: string },
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

  const token = signAccessToken({
    jti: user._id.toString(),
    roles: user.roles,
  });

  const { password: _, ...userWithoutPassword } = user.toObject();

  res
    .cookie('accessToken', token, {
      httpOnly: true,
      maxAge: ACCESS_TTL_SEC * 1000,
    })
    .status(200)
    .json({
      message: 'logged in',
      // user,
      user: userWithoutPassword,
      token,
    });
};

/* ---------------- LOGOUT ---------------- */
export const logout: RequestHandler = async (req, res) => {
  res.clearCookie('accessToken').json({ message: 'successfully logged out' });
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
