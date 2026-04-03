import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../context';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Only Super Admins can list and create companies
router.use(authenticate);

// Phase 5: Super Admin Analytics Configuration
router.get('/analytics', requireRole(['SUPER_ADMIN']), async (req, res) => {
    try {
        const [totalUsers, totalTasks, activeCompanies] = await Promise.all([
            prisma.user.count(),
            prisma.task.count({ where: { status: 'COMPLETED' } }),
            prisma.company.count({ where: { active: true } })
        ]);

        // Dynamic Scoring Element Placeholder (Compute based on tasks vs late penalty)
        const globalPerformanceScore = 92.5;

        res.json({
            metrics: {
                totalUsers,
                totalTasksCompleted: totalTasks,
                activeCompanies,
                globalPerformanceScore
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

router.get('/', requireRole(['SUPER_ADMIN']), async (req, res) => {
    try {
        const companies = await prisma.company.findMany({
            include: {
                _count: {
                    select: { users: true, tasks: true }
                }
            }
        });
        res.json({ companies });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
});

router.post('/', requireRole(['SUPER_ADMIN']), async (req, res) => {
    const { name, domain, plan, adminEmail, adminName, adminPassword } = req.body;
    if (!name || !adminEmail || !adminPassword) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin email already exists' });
        }

        const hash = await bcrypt.hash(adminPassword, 10);

        // Stripe onboarding phase happens in parallel / downstream asynchronously usually.
        const company = await prisma.company.create({
            data: {
                name,
                domain,
                plan: plan || 'BASIC',
                users: {
                    create: {
                        email: adminEmail,
                        name: adminName || 'Company Admin',
                        passwordHash: hash,
                        role: 'COMPANY_ADMIN',
                    }
                }
            },
            include: {
                users: true
            }
        });

        res.status(201).json({ company });
    } catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({ error: 'Failed to create company' });
    }
});

export default router;
