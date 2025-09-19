import { useState } from "react";
import type { Ingredient } from "../../../../models/Ingredient";
import TextInput from "../../../generic/form/textInput/TextInput";
import TextAreaInput from "../../../generic/form/textArea/TextAreaInput";
import FileInput from "../../../generic/form/fileInput/FileInput";
import ActionButton from "../../../generic/actionButton/ActionButton";
import { Check, Close } from "@mui/icons-material";
import "./IngredientForm.css";

export interface IngredientFormData {
  id: string | null;
  name: string;
  description: string;
  imageUrl: string | File | null | undefined;
}

interface Props {
  ingredient?: Ingredient;
  closeModal: () => void;
  handleFormSubmit: (data: IngredientFormData) => void;
}

export default function IngredientForm({
  ingredient,
  closeModal,
  handleFormSubmit,
}: Props) {
  const [formData, setFormData] = useState<IngredientFormData>({
    id: ingredient ? ingredient.id : null,
    name: ingredient ? ingredient.name : "",
    description: ingredient ? ingredient.description : "",
    imageUrl: ingredient ? ingredient.imageUrl : null,
  });

  const handleInputChange = (
    key: string,
    value: string | File | null | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="ingredient-form-container">
      <div className="form-content">
        <TextInput
          isRequired={true}
          value={formData.name}
          label="Nom de l'ingrédient"
          placeholder="Entrer le nom de l'ingrédient..."
          onChange={(value: string) => handleInputChange("name", value)}
        />
        <TextAreaInput
          isRequired={false}
          value={formData.description}
          label="Description de l'ingrédient"
          placeholder="Entrer la description de l'ingrédient..."
          onChange={(value: string) => handleInputChange("description", value)}
        />
        <FileInput
          label="Image de l'ingrédient"
          subLabel="Une petite image pour illustrer l'ingrédient"
          isRequired={false}
          file={formData.imageUrl}
          setFile={(file: File | null) => handleInputChange("imageUrl", file)}
          placeholder="Clicker ici ou glisser-déposer une image (png, jpg, jpeg, gif)"
        />
      </div>

      <div className="form-actions">
        <ActionButton
          label={ingredient ? "Modifier l'ingrédient" : "Ajouter l'ingrédient"}
          onClick={() => handleFormSubmit(formData)}
          icon={Check}
        />
        <ActionButton
          label="Annuler"
          icon={Close}
          onClick={closeModal}
          outlined={true}
        />
      </div>
    </div>
  );
}
