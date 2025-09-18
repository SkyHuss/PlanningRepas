import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error.middleware';
import ingredientsRoutes from './routes/ingredients.routes';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/ingredients', ingredientsRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Planning Repas is running',
  });
});

app.use(errorMiddleware);

export default app;
