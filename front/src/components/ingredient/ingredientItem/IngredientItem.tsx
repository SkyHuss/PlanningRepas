import { useState } from "react";
import type { Ingredient } from "../../../models/Ingredient";
import "./IngredientItem.css";
import Modal from "../../generic/modal/Modal";
import IngredientForm, {
  type IngredientFormData,
} from "../form/ingredientForm/IngredientForm";
import {
  deleteIngredient,
  putIngredient,
} from "../../../service/api/ingredientService";
import { Delete } from "@mui/icons-material";
import ConfirmDialog from "../../generic/confirmDialog/ConfirmDialog";
import { toast } from "react-toastify";

interface Props {
  ingredient: Ingredient;
  onUpdate?: (ingredient: Ingredient) => void;
  onDelete?: (id: string) => void;
}

const joinUrl = (base: string | undefined, p: string | undefined) => {
  if (!p) return "";
  const b = (base ?? "").replace(/\/$/, ""); // remove trailing slash
  const path = p.startsWith("/") ? p : `/${p}`;
  return b ? `${b}${path}` : path; // if no base, return path (relative)
};

export default function IngredientItem({
  ingredient,
  onUpdate,
  onDelete,
}: Props) {
  const imageSrc = joinUrl(import.meta.env.VITE_API_URL, ingredient.imageUrl);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState<boolean>(false);

  const handleIngredientModifyFormSubmit = async (data: IngredientFormData) => {
    const result = await putIngredient(data, ingredient.id);
    // propagate update to parent list
    onUpdate && onUpdate(result);
    setIsModalOpen(false);
  };

  const handleIngredientDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const result = await deleteIngredient(ingredient.id);
    if (result) {
      onDelete && onDelete(ingredient.id);
      setIsModalOpen(false);
    }

    setIsDeleteConfirmDialogOpen(false);
  };

  return (
    <div
      className="ingredient-item-container"
      onClick={() => setIsModalOpen(true)}
    >
      {ingredient.imageUrl ? (
        <img src={imageSrc} alt={ingredient.name} />
      ) : (
        <img
          src="/assets/no-pictures.png"
          alt="no-image"
          className="no-image"
        />
      )}

      <div className="details">
        <div className="name">{ingredient.name}</div>
        <div className="description">{ingredient.description}</div>
        <div className="stock-container">
          <div
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteConfirmDialogOpen(true);
            }}
          >
            <Delete />
          </div>
          <div className="amount">x5</div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          closeModal={() => setIsModalOpen(false)}
          title="Modifier un ingrédient"
        >
          <IngredientForm
            closeModal={() => setIsModalOpen(false)}
            handleFormSubmit={handleIngredientModifyFormSubmit}
            ingredient={ingredient}
          />
        </Modal>
      )}

      {isDeleteConfirmDialogOpen && (
        <ConfirmDialog
          message={`Vous etes sur le point de supprimer l'ingrédient "${ingredient.name}" `}
          messageTitle="Etes vous sur ?"
          onConfirm={handleIngredientDelete}
          onCancel={() => setIsDeleteConfirmDialogOpen(false)}
        />
      )}
    </div>
  );
}
