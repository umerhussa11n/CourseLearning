import * as React from "react";
import {Row} from "react-bootstrap";
import {get} from "lodash";
import ElentaNav from "../../shared/ElentaNav/ElentaNav";
import {ToastContextProvider} from "../../../contexts/ToastContext";
import ElentaToastContainer from "../../shared/ElentaToast/ElentaToastContainer";

export const PageContainer = (props) => {
  return (
    <>
      <ToastContextProvider>
        <ElentaNav/>
        <ElentaToastContainer/>
        <Row lg={12}>
          {props.children}
        </Row>
      </ToastContextProvider>
    </>
  );
};

export default PageContainer;
