import { Router } from 'express';
import Medication from '../models/Medication.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const med = await Medication.create({ ...req.body, userId: req.user.id });
    res.json(med);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const { q, active } = req.query;
  const filter = { userId: req.user.id };
  if (q) {
    filter.name = { $regex: q, $options: 'i' };
  }
  if (active === 'true') {
    const now = new Date();
    filter.$and = [ { startDate: { $lte: now } }, { $or: [ { endDate: null }, { endDate: { $gte: now } } ] } ];
  }
  const meds = await Medication.find(filter).sort({ createdAt: -1 });
  res.json(meds);
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Medication.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

router.post('/:id/logs', async (req, res) => {
  const { status, notes, date } = req.body;
  const med = await Medication.findOne({ _id: req.params.id, userId: req.user.id });
  if (!med) return res.status(404).json({ error: 'Not found' });
  med.logs.unshift({ status, notes, date: date ? new Date(date) : new Date() });
  await med.save();
  res.json(med);
});

export default router;


