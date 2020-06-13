import * as React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import {ToastContext} from "../../../contexts/ToastContext";
import {useContext, useEffect} from "react";
import ElentaToast from "../ElentaToast/ElentaToast";

export const ElentaFormButton: React.FunctionComponent<Props> =
  ({
     mutationLoading,
     mutationData,
     mutationError,
     onClick,
     disabled,
     title,
     className
   }) => {
    const toastContext = useContext(ToastContext);

    const handleClick = (e) => {
      e.preventDefault();
      onClick(e);
    }

    useEffect(() => {
      if (mutationData) {
        toastContext.setToasts([...toastContext.toasts,
          <ElentaToast
            keyId={toastContext.toasts.length}
            header="Success!"
            body="Saved"
            key={toastContext.toasts.length}
          />]);
      }
    }, [mutationData]);

    useEffect(() => {
      if (mutationError) {
        toastContext.setToasts([...toastContext.toasts,
          <ElentaToast header="Error!"
                       key={toastContext.toasts.length}
                       keyId={toastContext.toasts.length}
                       body={
                         mutationError.graphQLErrors.map(e => {
                           return <p key={e}>{e.message}</p>
                         })
                       }
          />
        ]);
      }
    }, [mutationError]);

    return (
      <div className={className}>
        <Button type="submit" onClick={handleClick} disabled={disabled} className="w-100">
          {
            mutationLoading ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> : title
          }
        </Button>
      </div>
    )
  };

interface Props {
  mutationLoading: any,
  mutationError: any,
  mutationData: any,
  onClick?: any,
  disabled?: boolean
  title?: string,
  className?: string
}

ElentaFormButton.defaultProps = {
  onClick: () => {
  },
  disabled: false,
  title: "Submit"
};

export default ElentaFormButton;
