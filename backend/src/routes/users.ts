import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../context';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticate);

// Phase 2: Enforce Plan limits when Company Admin creates an employee
router.post('/', requireRole(['COMPANY_ADMIN']), async (req, res) => {
    const { email, password, name, role } = req.body;
    const { companyId } = req.user!;

    if (!companyId || !email || !password || !name) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: { _count: { select: { users: true } } }
        });

        if (!company) return res.status(404).json({ error: 'Company not found' });

        // Usage Plan Limits
        const limit = company.plan === 'BASIC' ? 5 : company.plan === 'PRO' ? 25 : Infinity;

        if (company._count.users >= limit) {
            return res.status(403).json({ error: 'Upgrade required to add more employees.' });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash: hash,
                role: role || 'EMPLOYEE',
                companyId
            }
        });

        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

export default router;
