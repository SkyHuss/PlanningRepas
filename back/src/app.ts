import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error.middleware';
import ingredientsRoutes from './routes/ingredients.routes';
import path from 'path';
import { config } from './config/config';

const app = express();
app.use(cors({ origin: config.frontendUrl }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(express.json());

app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/ingredients', ingredientsRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Planning Repas is running',
  });
});

app.use(errorMiddleware);

export default app;
