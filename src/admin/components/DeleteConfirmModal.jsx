import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ show, onHide, onConfirm, userName }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title>
          <div className="d-flex align-items-center gap-2 text-danger">
            <AlertTriangle size={24} />
            <span>Confirm Delete</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        <p className="mb-3">
          Are you sure you want to delete user <strong>{userName}</strong>?
        </p>
        <div className="alert alert-warning mb-0">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          This action cannot be undone. All user data will be permanently removed.
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;