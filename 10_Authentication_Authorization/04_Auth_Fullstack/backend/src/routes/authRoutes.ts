import { login, logout, logoutAll, me, refresh, register } from '#controllers';
import { authenticate, validateBodyZod } from '#middlewares';
import { authLoginSchema, authRegisterSchema } from '#schemas';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', validateBodyZod(authRegisterSchema), register);
authRoutes.post('/login', validateBodyZod(authLoginSchema), login);
authRoutes.post('/refresh', refresh);

authRoutes.get('/me', authenticate, me);

authRoutes.delete('/logout-all', authenticate, logoutAll);
authRoutes.delete('/logout', authenticate, logout);

export default authRoutes;
