import { DatabaseService } from '../services/database.service';
import { IngredientsService } from '../services/ingredients.service';
import { CreateIngredientDTO } from '../dto/ingredients/create-ingredient.dto';
import { config } from '../config/config';

const defaultIngredients: CreateIngredientDTO[] = [
  { name: 'Tomate', description: 'Tomate fraîche' },
  { name: 'Oignon', description: 'Oignon jaune ou rouge' },
  { name: 'Ail', description: "Gousses d'ail" },
  { name: 'Poivron', description: 'Poivron rouge ou vert' },
  { name: 'Carotte', description: 'Carotte fraîche' },
  { name: 'Pomme de terre', description: 'Tubercule' },
  { name: 'Sel', description: 'Sel de cuisine' },
  { name: 'Poivre', description: 'Poivre noir moulu' },
  { name: "Huile d'olive", description: "Huile d'olive extra vierge" },
  { name: 'Beurre', description: 'Beurre doux' },
];

async function runSeed() {
  const db = DatabaseService.getInstance();
  try {
    console.log('Connecting to database...');
    await db.connect();

    const existing = await IngredientsService.findAll();
    const existingNames = new Set(existing.map((i) => (i.name || '').toLowerCase()));

    for (const item of defaultIngredients) {
      if (existingNames.has(item.name.toLowerCase())) {
        console.log(`Skipped existing ingredient: ${item.name}`);
        continue;
      }

      try {
        const created = await IngredientsService.create(item);
        console.log(`Created ingredient: ${created.name} (${created.id})`);
      } catch (err) {
        console.error(`Failed to create ingredient ${item.name}:`, err);
      }
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error while seeding:', error);
    process.exitCode = 1;
  } finally {
    if (config.env !== 'production') {
      try {
        await db.disconnect();
      } catch (e) {
        // ignore
      }
    }
  }
}

if (require.main === module) {
  runSeed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { runSeed };
