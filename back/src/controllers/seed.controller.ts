import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { runSeed } from '../seed/seed';

export const runSeedRoute = asyncHandler(async (_req: Request, res: Response) => {
  await runSeed();
  res.status(200).json({ message: 'Seed executed' });
});
