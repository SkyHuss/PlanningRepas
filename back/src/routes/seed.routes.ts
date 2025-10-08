import { Router } from 'express';
import { runSeedRoute } from '../controllers/seed.controller';

const router = Router();

router.post('/', runSeedRoute);

export default router;
