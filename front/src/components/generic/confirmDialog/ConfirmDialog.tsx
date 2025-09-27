import ActionButton from "../actionButton/ActionButton";
import Modal from "../modal/Modal";
import "./ConfirmDialog.css";

interface Props {
  message?: string;
  messageTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  messageTitle = "Are you sure ?",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal noCloseButton={true} title={messageTitle}>
      {message && <div className="confirm-message">{message}</div>}
      <div className="confirm-actions">
        <ActionButton outlined={true} label="Annuler" onClick={onCancel} />
        <ActionButton label="Confirmer" onClick={onConfirm} />
      </div>
    </Modal>
  );
}
