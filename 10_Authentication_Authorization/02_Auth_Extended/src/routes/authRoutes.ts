import { login, logout, me, register } from '#controllers';
import { authenticate, validateBodyZod } from '#middlewares';
import { authLoginSchema, authRegisterSchema } from '#schemas';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', validateBodyZod(authRegisterSchema), register);
authRoutes.post('/login', validateBodyZod(authLoginSchema), login);

authRoutes.get('/me', authenticate, me);
authRoutes.delete('/logout', authenticate, logout);

export default authRoutes;
