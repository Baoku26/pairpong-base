import { useEffect } from "react";
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react";

const Modal = ({ isOpen, onClose, title, message, type = "info", children }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertTriangle className="modal-icon modal-icon-error" />;
      case "success":
        return <CheckCircle className="modal-icon modal-icon-success" />;
      case "warning":
        return <AlertTriangle className="modal-icon modal-icon-warning" />;
      default:
        return <Info className="modal-icon modal-icon-info" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            {getIcon()}
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <p className="modal-message">{message}</p>
          {children}
        </div>

        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
