import React from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import { CheckCircle, Clock } from 'lucide-react';

const ProcessingStatus = ({ isComplete, isReady }) => {
  if (isComplete && isReady) {
    return (
      <Badge bg="success" className="d-flex align-items-center gap-2 px-3 py-2">
        <CheckCircle size={16} />
        <span>Processing Complete</span>
      </Badge>
    );
  }

  return (
    <Badge bg="warning" className="d-flex align-items-center gap-2 px-3 py-2">
      <Clock size={16} />
      <span>Processing...</span>
    </Badge>
  );
};

export default ProcessingStatus;
