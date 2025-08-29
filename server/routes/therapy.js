import { Router } from 'express';
import Therapy from '../models/Therapy.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const session = await Therapy.create({ ...req.body, userId: req.user.id });
    res.json(session);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const { q, type, from, to } = req.query;
  const filter = { userId: req.user.id };
  if (q) filter.therapist = { $regex: q, $options: 'i' };
  if (type) filter.type = type;
  if (from || to) {
    filter.sessionDate = {};
    if (from) filter.sessionDate.$gte = new Date(from);
    if (to) filter.sessionDate.$lte = new Date(to);
  }
  const sessions = await Therapy.find(filter).sort({ sessionDate: 1 });
  res.json(sessions);
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Therapy.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await Therapy.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;


