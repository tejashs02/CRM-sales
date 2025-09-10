const { validationResult } = require('express-validator');
const { readDatabase, writeDatabase, generateId } = require('../utils/database');

const getLeads = (req, res) => {
  try {
    const db = readDatabase();
    let leads = db.leads;

    if (req.user.role === 'rep') {
      leads = leads.filter(lead => lead.ownerId === req.user.id);
    }

    leads = leads.map(lead => {
      const owner = db.users.find(u => u.id === lead.ownerId);
      return { ...lead, ownerName: owner ? owner.name : 'Unknown' };
    });

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

const createLead = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, phone, company, status = 'New' } = req.body;
    const db = readDatabase();

    const newLead = {
      id: generateId('leads'),
      name,
      email,
      phone,
      company,
      status,
      ownerId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.leads.push(newLead);
    writeDatabase(db);

    const owner = db.users.find(u => u.id === newLead.ownerId);
    res.status(201).json({ ...newLead, ownerName: owner ? owner.name : 'Unknown' });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

const updateLead = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { name, email, phone, company, status } = req.body;
    const db = readDatabase();

    const idx = db.leads.findIndex(l => l.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const lead = db.leads[idx];
    if (req.user.role === 'rep' && lead.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.leads[idx] = {
      ...lead,
      name: name || lead.name,
      email: email || lead.email,
      phone: phone || lead.phone,
      company: company || lead.company,
      status: status || lead.status,
      updatedAt: new Date().toISOString()
    };

    writeDatabase(db);

    const owner = db.users.find(u => u.id === db.leads[idx].ownerId);
    res.json({ ...db.leads[idx], ownerName: owner ? owner.name : 'Unknown' });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

const deleteLead = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();

    const idx = db.leads.findIndex(l => l.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const lead = db.leads[idx];
    if (req.user.role === 'rep' && lead.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    db.leads.splice(idx, 1);
    writeDatabase(db);

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

const convertLead = (req, res) => {
  try {
    const { id } = req.params;
    const { title, value } = req.body;
    const db = readDatabase();

    const idx = db.leads.findIndex(l => l.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Lead not found' });

    const lead = db.leads[idx];
    if (req.user.role === 'rep' && lead.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

  
    db.leads[idx] = { ...lead, status: 'Qualified', updatedAt: new Date().toISOString() };

    const newOp = {
      id: generateId('opportunities'),
      title: title || `${lead.name} - Opportunity`,
      value: value || 0,
      stage: 'Discovery',
      ownerId: lead.ownerId,
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.opportunities.push(newOp);
    writeDatabase(db);

    const owner = db.users.find(u => u.id === newOp.ownerId);
    res.status(201).json({
      message: 'Lead converted successfully',
      lead: db.leads[idx],
      opportunity: { ...newOp, ownerName: owner ? owner.name : 'Unknown', leadName: lead.name }
    });
  } catch (error) {
    console.error('Error converting lead:', error);
    res.status(500).json({ error: 'Failed to convert lead' });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  convertLead
};
