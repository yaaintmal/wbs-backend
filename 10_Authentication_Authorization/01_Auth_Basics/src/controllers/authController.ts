import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '#models';

export const register: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExist = await User.exists({ email });

  if (userExist) {
    throw new Error('Registration failed', { cause: { status: 400 } });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  const token = jwt.sign({ jti: user._id }, process.env.ACCESS_JWT_SECRET!, {
    expiresIn: '1h',
    issuer: process.env.JWT_ISSUER,
  });

  //   res
  //     .status(201)
  //     .json({ message: 'registered successfully', user: user, token: token });

  // email verifizierung
  res
    .cookie('accessToken', token, {
      httpOnly: true,
      maxAge: Number(process.env.ACCESS_TOKEN_TTL) * 1000,
    })
    .status(201)
    .json({
      mesage: 'registered successfully',
      user,
      token,
    });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials', { cause: { status: 401 } });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new Error('Invalid credentials', { cause: { status: 401 } });

  const token = jwt.sign(
    { jti: user._id, roles: user.roles },
    process.env.ACCESS_JWT_SECRET!,
    { expiresIn: '1h', issuer: process.env.JWT_ISSUER }
  );

  res
    .cookie('accessToken', token, {
      httpOnly: true,
      maxAge: Number(process.env.ACCESS_TOKEN_TTL) * 1000,
    })
    .status(201)
    .json({
      mesage: 'logged in',
      user,
      token,
    });
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie('accessToken').json({ message: 'successfully logged out' });
};

export const me: RequestHandler = async (req, res) => {
  const user = await User.findById(req.user?.id);

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json({ user });
};
