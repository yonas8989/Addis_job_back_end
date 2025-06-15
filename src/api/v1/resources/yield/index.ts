import { Router } from 'express';
import { validator, protect, auth } from '../middleware';
import { 
  createYieldPrediction, 
  getYieldHistory,
  getYieldPrediction,
  uploadYieldData
} from './controller';
import { 
  yieldPredictionValidation,
  yieldHistoryValidation
} from './validation';
import { Role } from '../../../../shared';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.use(protect); // All routes protected

// Yield prediction routes
router.post(
  '/predict',
  auth(Role.User),
  validator(yieldPredictionValidation),
  createYieldPrediction
);

router.post(
  '/upload',
  auth(Role.User),
  upload.single('file'), // Handle single file upload
  uploadYieldData
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