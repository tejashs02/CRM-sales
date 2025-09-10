const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');

const router = express.Router();

const opportunityValidation = [
  body('title').isLength({ min: 2 }).trim().withMessage('Title must be at least 2 characters'),
  body('value').isNumeric().withMessage('Value must be a number'),
  body('stage').optional().isIn(['Discovery', 'Proposal', 'Won', 'Lost']).withMessage('Invalid stage'),
  body('leadId').optional().isLength({ min: 1 }).withMessage('Invalid lead ID')
];

router.use(authenticateToken);

router.get('/', getOpportunities);
router.post('/', opportunityValidation, createOpportunity);
router.put('/:id', opportunityValidation, updateOpportunity);
router.delete('/:id', deleteOpportunity);

module.exports = router;
