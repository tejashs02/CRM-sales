const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  convertLead
} = require('../controllers/leadController');

const router = express.Router();

const leadValidation = [
  body('name').isLength({ min: 2 }).trim().withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().isLength({ min: 7 }).withMessage('Phone must be at least 7 characters'),
  body('company').optional().isLength({ min: 2 }).trim().withMessage('Company name must be at least 2 characters'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified']).withMessage('Invalid status')
];

const convertValidation = [
  body('title').optional().isLength({ min: 2 }).trim().withMessage('Title must be at least 2 characters'),
  body('value').optional().isNumeric().withMessage('Value must be a number')
];

router.use(authenticateToken);

router.get('/', getLeads);
router.post('/', leadValidation, createLead);
router.put('/:id', leadValidation, updateLead);
router.delete('/:id', deleteLead);
router.post('/:id/convert', convertValidation, convertLead);

module.exports = router;
