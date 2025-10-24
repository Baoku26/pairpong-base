import { AlertCircle, CheckCircle, Info } from "lucide-react";

const NotificationBanner = ({ message, type = "info" }) => {
  const icons = {
    error: <AlertCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  const styles = {
    error: "notification-error",
    success: "notification-success",
    info: "notification-info",
  };

  return (
    <div className={`notification-banner ${styles[type]}`}>
      <div className="notification-icon">{icons[type]}</div>
      <p className="notification-message">{message}</p>
    </div>
  );
};

export default NotificationBanner;
