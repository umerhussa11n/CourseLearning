import * as React from "react";
import Toast from "react-bootstrap/Toast";
import {useContext, useState} from "react";
import {ToastContext} from "../../../contexts/ToastContext";

export const ElentaToast: React.FunctionComponent<Props> =
  ({
     keyId,
     header,
     body,
     delay,
     autohide
   }) => {
    const toastContext = useContext(ToastContext);

    const handleClose = () => {
      toastContext.setToasts(toastContext.toasts.filter(t => t.key != keyId.toString()));
    };
    return (
      <Toast
        onClose={handleClose.bind(this)}
        delay={delay}
        autohide={autohide}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt=""/>
          <strong className="mr-auto">{header}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{body}</Toast.Body>
      </Toast>
    );
  };

interface Props {
  keyId: number,
  header: string
  body: string
  delay?: number
  autohide?: boolean
}

ElentaToast.defaultProps = {
  delay: 5000,
  autohide: false
}
export default ElentaToast;
