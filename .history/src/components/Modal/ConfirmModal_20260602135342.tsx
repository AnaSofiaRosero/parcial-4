import "./ConfirmModal.css";

interface Props {
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  mensaje,
  onConfirm,
  onCancel
}: Props) {
  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Confirmar</h2>

        <p>{mensaje}</p>

        <div className="buttons">

          <button
            className="cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="delete"
            onClick={onConfirm}
          >
            Eliminar
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;