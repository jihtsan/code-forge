import { CheckCircle2, X } from "lucide-react";

export interface ToastProps {
  readonly message: string;
  readonly onDismiss: () => void;
}

export const Toast = ({ message, onDismiss }: ToastProps) => (
  <div className="toast" role="status" aria-live="polite">
    <CheckCircle2 size={16} aria-hidden="true" />
    <span>{message}</span>
    <button type="button" onClick={onDismiss} aria-label="关闭提示" title="关闭提示"><X size={14} /></button>
  </div>
);
