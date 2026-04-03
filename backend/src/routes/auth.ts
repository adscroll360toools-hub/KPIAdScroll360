import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../context';

const router = Router();

// Used to bootstrap the environment if no Super Admin exists
const SUPER_ADMIN_EMAIL = 'admin@adscroll360.com';
const SUPER_ADMIN_PASS = 'mg6VMj54a5cfDn6p';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        let user = await prisma.user.findUnique({ where: { email } });

        // Seed Super Admin if logging in with Super Admin credentials and it doesn't exist
        if (!user && email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASS) {
            const hash = await bcrypt.hash(SUPER_ADMIN_PASS, 10);
            user = await prisma.user.create({
                data: {
                    email: SUPER_ADMIN_EMAIL,
                    name: 'Super Admin',
                    passwordHash: hash,
                    role: 'SUPER_ADMIN',
                },
            });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, companyId: user.companyId || undefined },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                companyId: user.companyId,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
