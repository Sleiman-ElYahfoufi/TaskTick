import React from "react";
import "./DeleteModal.css";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName = "this item",
}) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete {itemName}?</p>
                <p className="delete-warning">This action cannot be undone.</p>

                <div className="delete-modal-buttons">
                    <button className="delete-modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="delete-modal-confirm"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
