const { validationResult } = require('express-validator');
const { readDatabase, writeDatabase, generateId } = require('../utils/database');

const getOpportunities = (req, res) => {
  try {
    const db = readDatabase();
    
   
    console.log('=== OPPORTUNITIES DEBUG START ===');
    console.log('User Role:', req.user.role);
    console.log('User ID:', req.user.id);
    console.log('All opportunities in DB:', db.opportunities);
    console.log('Total opportunities in DB:', db.opportunities.length);
    
    let opps = db.opportunities;
    if (req.user.role === 'rep') {
      opps = opps.filter(o => o.ownerId === req.user.id);
      console.log('After rep filtering:', opps.length);
    }

    opps = opps.map(o => {
      const owner = db.users.find(u => u.id === o.ownerId);
      const lead = o.leadId ? db.leads.find(l => l.id === o.leadId) : null;
      
    
      console.log(`Opp ${o.id}: ownerId=${o.ownerId}, leadId=${o.leadId}, leadFound=${!!lead}`);
      
      return { 
        ...o, 
        ownerName: owner ? owner.name : 'Unknown', 
        leadName: lead ? lead.name : 'Deleted Lead'
      };
    });

    console.log('Final opportunities to return:', opps.length);
    console.log('=== OPPORTUNITIES DEBUG END ===');
    
    res.json(opps);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
};

const createOpportunity = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, value, stage = 'Discovery', leadId } = req.body;
    const db = readDatabase();

    
    if (leadId) {
      const leadExists = db.leads.find(l => l.id === leadId);
      if (!leadExists) {
        return res.status(404).json({ error: 'Lead not found with the provided leadId' });
      }
    }

    const newOpp = {
      id: generateId('opportunities'),
      title,
      value,
      stage,
      ownerId: req.user.id,
      leadId: leadId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.opportunities.push(newOpp);
    writeDatabase(db);

    const owner = db.users.find(u => u.id === newOpp.ownerId);
    const lead = newOpp.leadId ? db.leads.find(l => l.id === newOpp.leadId) : null;

    res.status(201).json({ 
      ...newOpp, 
      ownerName: owner ? owner.name : 'Unknown', 
      leadName: lead ? lead.name : null 
    });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
};

const updateOpportunity = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { title, value, stage } = req.body;
    const db = readDatabase();

    const idx = db.opportunities.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Opportunity not found' });

    const opp = db.opportunities[idx];
    if (req.user.role === 'rep' && opp.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.opportunities[idx] = {
      ...opp,
      title: title || opp.title,
      value: value !== undefined ? value : opp.value,
      stage: stage || opp.stage,
      updatedAt: new Date().toISOString()
    };

    writeDatabase(db);

    const owner = db.users.find(u => u.id === db.opportunities[idx].ownerId);
    const lead = db.opportunities[idx].leadId ? db.leads.find(l => l.id === db.opportunities[idx].leadId) : null;
    res.json({ 
      ...db.opportunities[idx], 
      ownerName: owner ? owner.name : 'Unknown', 
      leadName: lead ? lead.name : 'Deleted Lead'  // Changed from null
    });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ error: 'Failed to update opportunity' });
  }
};

const deleteOpportunity = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();

    const idx = db.opportunities.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Opportunity not found' });

    const opp = db.opportunities[idx];
    if (req.user.role === 'rep' && opp.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.opportunities.splice(idx, 1);
    writeDatabase(db);

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
};

module.exports = {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};