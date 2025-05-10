import { Router } from 'express';
import { validator, protect, auth } from '../middleware';
import { 
  createYieldPrediction, 
  getYieldHistory,
  getYieldPrediction 
} from './controller';
import { 
  yieldPredictionValidation,
  yieldHistoryValidation
} from './validation';
import { Role } from '../../../../shared';

const router = Router();

router.use(protect); // All routes protected

// Yield prediction routes
router.post(
  '/predict',
  auth(Role.User),
  validator(yieldPredictionValidation),
  createYieldPrediction
);

router.get(
  '/history',
  auth(Role.User),
  validator(yieldHistoryValidation),
  getYieldHistory
);

router.get(
  '/:id',
  auth(Role.User),
  getYieldPrediction
);

export default router;