import { Router } from 'express';
import Medication from '../models/Medication.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate, notes } = req.body;
    
    // Validate input
    if (!name || !dosage) {
      return res.status(400).json({ error: 'Name and dosage are required' });
    }
    
    const med = await Medication.create({ 
      name: name.trim(), 
      dosage: dosage.trim(), 
      frequency: frequency?.trim() || 'Daily',
      startDate: startDate || new Date(),
      endDate: endDate || null,
      notes: notes?.trim() || '',
      userId: req.user.id 
    });
    
    res.status(201).json(med);
  } catch (e) {
    console.error('Create medication error:', e);
    res.status(400).json({ error: 'Failed to create medication', details: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { q, active } = req.query;
    const filter = { userId: req.user.id };
    
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    if (active === 'true') {
      const now = new Date();
      filter.$and = [ 
        { startDate: { $lte: now } }, 
        { $or: [ { endDate: null }, { endDate: { $gte: now } } ] } 
      ];
    }
    
    const meds = await Medication.find(filter).sort({ createdAt: -1 });
    res.json(meds);
  } catch (e) {
    console.error('Get medications error:', e);
    res.status(500).json({ error: 'Failed to fetch medications', details: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate, notes } = req.body;
    
    // Validate input
    if (!name || !dosage) {
      return res.status(400).json({ error: 'Name and dosage are required' });
    }
    
    const updated = await Medication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      { 
        name: name.trim(), 
        dosage: dosage.trim(), 
        frequency: frequency?.trim() || 'Daily',
        startDate: startDate || new Date(),
        endDate: endDate || null,
        notes: notes?.trim() || '',
        updatedAt: new Date()
      }, 
      { 
        new: true, 
        runValidators: true,
        maxTimeMS: 15000
      }
    );
    
    if (!updated) return res.status(404).json({ error: 'Medication not found' });
    res.json(updated);
  } catch (e) {
    console.error('Update medication error:', e);
    res.status(400).json({ error: 'Failed to update medication', details: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Medication.findOneAndDelete(
      { _id: req.params.id, userId: req.user.id },
      { maxTimeMS: 15000 }
    );
    
    if (!deleted) return res.status(404).json({ error: 'Medication not found' });
    res.json({ ok: true, message: 'Medication deleted successfully' });
  } catch (e) {
    console.error('Delete medication error:', e);
    res.status(500).json({ error: 'Failed to delete medication', details: e.message });
  }
});

router.post('/:id/logs', async (req, res) => {
  try {
    const { status, notes, date } = req.body;
    
    // Validate input
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    // Retry mechanism for concurrency issues
    let retries = 3;
    while (retries > 0) {
      try {
        // Use atomic operation to avoid version conflicts
        const result = await Medication.updateOne(
          { _id: req.params.id, userId: req.user.id },
          { 
            $push: { 
              logs: { 
                $each: [{ 
                  status, 
                  notes, 
                  date: date ? new Date(date) : new Date() 
                }], 
                $position: 0 
              } 
            },
            $set: { updatedAt: new Date() }
          },
          { 
            runValidators: true,
            maxTimeMS: 15000
          }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Medication not found' });
        }
        
        if (result.modifiedCount === 0) {
          return res.status(400).json({ error: 'Failed to add log entry' });
        }
        
        // Fetch the updated medication to return
        const updatedMed = await Medication.findOne({ _id: req.params.id, userId: req.user.id });
        res.json(updatedMed);
        return;
        
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100 * (3 - retries)));
      }
    }
    
  } catch (e) {
    console.error('Add medication log error:', e);
    res.status(500).json({ error: 'Failed to add log entry', details: e.message });
  }
});

export default router;


