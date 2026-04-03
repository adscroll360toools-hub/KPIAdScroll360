import { Router } from 'express';
import { prisma } from '../context';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res) => {
    const { companyId, role, userId } = req.user!;

    if (!companyId) return res.status(403).json({ error: 'Tenant context required' });

    try {
        let tasks;
        if (role === 'COMPANY_ADMIN') {
            tasks = await prisma.task.findMany({ where: { companyId } });
        } else if (role === 'CONTROLLER') {
            // Controllers can see tasks they created or are assigned to
            tasks = await prisma.task.findMany({
                where: {
                    companyId,
                    OR: [{ assignedById: userId }, { assignedToId: userId }]
                }
            });
        } else {
            // Employees only see their own assigned tasks
            tasks = await prisma.task.findMany({
                where: { companyId, assignedToId: userId }
            });
        }

        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/', async (req, res) => {
    const { companyId, userId, role } = req.user!;
    if (!companyId) return res.status(403).json({ error: 'Tenant context required' });
    if (role === 'EMPLOYEE') return res.status(403).json({ error: 'Employees cannot create tasks' });

    const { title, description, assignedToId, priority, deadline } = req.body;
    if (!title || !assignedToId) return res.status(400).json({ error: 'Missing title or assignedToId' });

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description: description || '',
                companyId,
                assignedById: userId,
                assignedToId,
                priority: priority || 'MEDIUM',
                deadline: deadline ? new Date(deadline) : null,
            }
        });
        res.status(201).json({ task });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

router.patch('/:id/status', async (req, res) => {
    const { companyId, userId } = req.user!;
    const { status } = req.body;
    const { id } = req.params;

    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        if (task.companyId !== companyId) return res.status(403).json({ error: 'Forbidden' });

        // Check assignment
        if (task.assignedToId !== userId && task.assignedById !== userId && req.user!.role !== 'COMPANY_ADMIN') {
            return res.status(403).json({ error: 'Not authorized to edit this task' });
        }

        const updated = await prisma.task.update({
            where: { id },
            data: { status }
        });

        res.json({ task: updated });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

export default router;
