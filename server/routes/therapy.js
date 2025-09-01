import { Router } from 'express';
import Therapy from '../models/Therapy.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { therapist, sessionDate, type, notes, progress } = req.body;
    
    // Validate input
    if (!therapist || !sessionDate || !type) {
      return res.status(400).json({ error: 'Therapist, session date, and type are required' });
    }
    
    const session = await Therapy.create({ 
      therapist: therapist.trim(), 
      sessionDate: new Date(sessionDate), 
      type: type.trim(),
      notes: notes?.trim() || '',
      progress: progress || 0,
      userId: 'public' 
    });
    
    res.status(201).json(session);
  } catch (e) {
    console.error('Create therapy session error:', e);
    res.status(400).json({ error: 'Failed to create therapy session', details: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { q, type, from, to } = req.query;
    const filter = {};
    
    if (q) filter.therapist = { $regex: q, $options: 'i' };
    if (type) filter.type = type;
    if (from || to) {
      filter.sessionDate = {};
      if (from) filter.sessionDate.$gte = new Date(from);
      if (to) filter.sessionDate.$lte = new Date(to);
    }
    
    const sessions = await Therapy.find(filter).sort({ sessionDate: 1 });
    res.json(sessions);
  } catch (e) {
    console.error('Get therapy sessions error:', e);
    res.status(500).json({ error: 'Failed to fetch therapy sessions', details: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { therapist, sessionDate, type, notes, progress } = req.body;
    
    // Validate input
    if (!therapist || !sessionDate || !type) {
      return res.status(400).json({ error: 'Therapist, session date, and type are required' });
    }
    
    const updated = await Therapy.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      { 
        therapist: therapist.trim(), 
        sessionDate: new Date(sessionDate), 
        type: type.trim(),
        notes: notes?.trim() || '',
        progress: progress || 0,
        updatedAt: new Date()
      }, 
      { 
        new: true, 
        runValidators: true,
        maxTimeMS: 15000
      }
    );
    
    if (!updated) return res.status(404).json({ error: 'Therapy session not found' });
    res.json(updated);
  } catch (e) {
    console.error('Update therapy session error:', e);
    res.status(400).json({ error: 'Failed to update therapy session', details: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Therapy.findOneAndDelete(
      { _id: req.params.id, userId: req.user.id },
      { maxTimeMS: 15000 }
    );
    
    if (!deleted) return res.status(404).json({ error: 'Therapy session not found' });
    res.json({ ok: true, message: 'Therapy session deleted successfully' });
  } catch (e) {
    console.error('Delete therapy session error:', e);
    res.status(500).json({ error: 'Failed to delete therapy session', details: e.message });
  }
});

export default router;


