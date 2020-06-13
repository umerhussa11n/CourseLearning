import React, {useState} from 'react';
import ElentaToast from "../components/shared/ElentaToast/ElentaToast";

const ToastContext = React.createContext({
  toasts: [],
  setToasts: (toasts) => {
  },
  addToast: (toast) => {
  }
});

const ToastContextProvider = ({children}) => {
  const [toasts, setToasts] = useState([]);
  return (
    <ToastContext.Provider value={{
      toasts: toasts,
      setToasts: setToasts,
      addToast: ({header, body}) => {
        setToasts([...toasts,
          <ElentaToast
            keyId={toasts.length}
            header={header}
            body={body}
            key={toasts.length}
          />]);
      }
    }}>
      {children}
    </ToastContext.Provider>
  );
}

export {ToastContext, ToastContextProvider};
