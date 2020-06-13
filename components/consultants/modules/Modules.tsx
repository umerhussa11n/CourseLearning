import * as React from "react";
import {useMutation} from '@apollo/react-hooks';
import ModuleList from "./ModuleList";
import {useContext, useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {UPSERT_MODULE} from "../../../graphql/queries";
import _ from "lodash";
import {Button} from "react-bootstrap";
import {ToastContext} from "../../../contexts/ToastContext";
import LoadingContainer from "../../hoc/LoadingContainer/LoadingContainer";
import {immutableMerge} from "../../../utils/utils";
import {Link} from "react-router-dom";
import ModuleEditor from "./ModuleEditor";
import ModuleViewer from "./ModuleViewer";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import ModalList from "./popups/ModalList";
import UserAction from "./popups/actions";
import {TemplateContext} from "../../../pages/consultants/TemplateEditorPage";
import {ProgramContext} from "../../../pages/consultants/ProgramContentPage";

const defaultContent = {
  schema: {
    type: "object",
    properties: {}
  },
  uiSchema: {
    "ui:order": []
  }
};

// TODO: Refactor to be PivotModuleEditor that lists Program/TemplateModules
export const Modules =
  ({
     addModule,
     addFolder,
     saveModulesOrder,
     deleteModules,
     duplicateModules,
     updateRecipientList,
     updateModule,
     sendModule,
   }) => {
    const [formContent, setFormContent] = useState(defaultContent);
    const [formReminder, setFormReminder] = useState(null);
    const [formTrigger, setFormTrigger] = useState(null);
    const [recipientList, setRecipientList] = useState(null);
    const [tagList, setTagList] = useState(null);
    const [userAction, setUserAction] = useState(null);
    const [userActionData, setUserActionData] = useState(null);
    const [isModuleReadOnly, setModuleReadOnly] = useState(false);

    const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(UPSERT_MODULE);

    const toastContext = useContext(ToastContext);
    const programContext = useContext(ProgramContext);
    const templateContext = useContext(TemplateContext);
    const {
      modules: templateModules,
      programModules: pivotModules,
      recipientLists,
      activeModule,
      setActiveModule,
    } = programContext || templateContext;

    useEffect(() => {
      if (activeModule) {
        if (activeModule.reminder) setFormReminder(_.omit(activeModule.reminder, "__typename"));
        if (activeModule.trigger) setFormTrigger(_.omit(activeModule.trigger, "__typename"));
        if (activeModule.content) {
          setFormContent(JSON.parse(activeModule.content));
        } else {
          setFormContent(defaultContent);
        }
        if (activeModule.pivot) setRecipientList(recipientLists.filter(rl => rl.id == activeModule.pivot.recipient_list_id)[0]);
        if (pivotModules.length > 0) {
          const pivotModule = pivotModules.filter((pmItem) => {
            return (pmItem.id == activeModule.pivot.id)
          });
          if (pivotModule.length > 0) {
            const parsedTagList = JSON.parse(pivotModule[0].module_variables);
            setTagList(parsedTagList);
          }
        }
        if (pivotModules[0].module) {
          setModuleReadOnly(pivotModules.some(pivotModule => {
            if (pivotModule.module.id === activeModule.id) {
              return pivotModule.sends !== null && pivotModule.sends.length > 0
            }
          }));
        }
      }
      introJs().start();
    }, [activeModule]);

    const updateModuleList = (d) => {
      setActiveModule(immutableMerge(activeModule, d));
    };

    const onSave = () => {
      let input = immutableMerge(activeModule, {
        reminder: formReminder,
        trigger: formTrigger,
        content: JSON.stringify(formContent)
      });
      delete input.reminder['__typename'];
      delete input.trigger['__typename'];
      delete input['__typename'];
      updateModule(input);
      if (activeModule && recipientList && recipientList.id !== activeModule.pivot.recipient_list_id) {
        updateRecipientList(recipientList, activeModule)
      }
    };

    const setUserActionHandler = (action, actionData) => {
      const actionChanged = action !== userAction ||
        (actionData != null && !_.isEqual(actionData, userActionData));

      if (actionChanged) {
        setUserAction(action);
        setUserActionData(actionData || null);
      }
    };

    const checkIsReadOnlyModuleItem = (module) => {
      if (pivotModules[0].module) {
        for (let i = 0; i < pivotModules.length; i++) {
          if (module.id === pivotModules[i].module.id) {
            return pivotModules[i].sends !== null && pivotModules[i].sends.length > 0;
          }
        }
      }
      return false;
    }

    return (
      <LoadingContainer loading={mutationLoading} error={mutationError} className="pl-0 pr-0 pt-4">
        <Row>
          <Col md={3} className="p-0 pr-3 border-right">
            <Row className="pb-2 ml-2 mr-2">
              <Link to={window.location.pathname.replace('content', 'settings')}>Edit Settings</Link>
            </Row>
            <ModuleList modules={templateModules}
                        activeModule={activeModule}
                        setActiveModule={setActiveModule}
                        saveModulesOrder={saveModulesOrder}
                        deleteModules={deleteModules}
                        duplicateModules={duplicateModules}
                        checkIsReadOnlyModuleItem={checkIsReadOnlyModuleItem}
                        setUserAction={setUserActionHandler}
            />
            <Row className="pt-2">
              <div className="m-auto">
                <Button variant="outline-primary" onClick={() => {
                  setUserActionHandler(UserAction.EDIT_FOLDER, {
                    callback: addFolder
                  });
                }}>
                  + Folder
                </Button>
                <Button variant="outline-primary" onClick={addModule}>
                  + Module
                </Button>
              </div>
            </Row>
          </Col>
          <Col>
            {activeModule &&
            (!isModuleReadOnly
                ? <ModuleEditor
                  activeModule={activeModule}
                  updateModuleList={updateModuleList}
                  sendModule={sendModule}
                  onSave={onSave}
                  tagList={tagList}
                  formContent={formContent}
                  setFormContent={setFormContent}
                  formReminder={formReminder}
                  formTrigger={formTrigger}
                  setFormReminder={setFormReminder}
                  setFormTrigger={setFormTrigger}
                  recipientLists={recipientLists}
                  recipientList={recipientList}
                  setRecipientList={setRecipientList}
                />
                : <ModuleViewer
                  activeModule={activeModule}
                  formContent={formContent}
                />
            )}
            {!activeModule &&
            <h4 style={{
              textAlign: "center",
              width: "50%",
              margin: "auto",
              verticalAlign: "middle"
            }}
            >
              It looks like you don't have any Modules yet. Get started by creating one on the left.</h4>
            }
          </Col>
        </Row>
        <ModalList
          {...{
            userAction,
            userActionData,
            setUserAction: setUserActionHandler
          }}
        />
      </LoadingContainer>
    )
  };

export default Modules;
