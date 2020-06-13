import * as React from "react";
import {useContext} from "react";
import {ToastContext} from "../../../contexts/ToastContext";

export const ElentaToastContainer = () => {
  const toastContext = useContext(ToastContext);
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        marginRight: "20px",
        width: "250px",
        right: 0,
        zIndex: 999,
      }}
    >
      {
        toastContext.toasts
      }
    </div>
  );
};

export default ElentaToastContainer;
