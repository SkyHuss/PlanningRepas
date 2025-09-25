import { Add } from "@mui/icons-material";
import ActionButton from "../../components/generic/actionButton/ActionButton";
import "./Ingredients.css";
import { useEffect, useState } from "react";
import type { Ingredient } from "../../models/Ingredient";
import IngredientItem from "../../components/ingredient/ingredientItem/IngredientItem";
import {
  getIngredientsList,
  postIngredient,
} from "../../service/api/ingredientService";
import Modal from "../../components/generic/modal/Modal";
import IngredientForm, {
  type IngredientFormData,
} from "../../components/ingredient/form/ingredientForm/IngredientForm";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIngredientsList = async () => {
    const response: Ingredient[] = await getIngredientsList();
    setIngredients(response);
  };

  const handleAddIngredient = () => {
    setIsModalOpen(true);
  };

  const handleIngredientFormSubmit = async (data: IngredientFormData) => {
    const newIngredient = await postIngredient(data);
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchIngredientsList();
  }, []);

  return (
    <div className="ingredients-container">
      <div className="header">
        <span className="page-title">Liste des ingrédients</span>
        <ActionButton
          icon={Add}
          label="Ajouter un ingrédient"
          type="primary"
          onClick={handleAddIngredient}
        />
      </div>
      <div className="ingredient-list">
        {ingredients.map((ingredient) => (
          <IngredientItem key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
          title="Ajouter un ingrédient"
        >
          <IngredientForm
            closeModal={() => setIsModalOpen(false)}
            handleFormSubmit={handleIngredientFormSubmit}
          />
        </Modal>
      )}
    </div>
  );
}
