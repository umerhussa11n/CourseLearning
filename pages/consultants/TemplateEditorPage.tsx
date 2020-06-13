import * as React from "react";
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useParams} from "react-router-dom";
import {
  CURRENT_USER_PROFILE,
  GET_TEMPLATE,
  UPDATE_TEMPLATE_MODULES,
  DUPLICATE_TEMPLATE_MODULES,
  UPSERT_MODULE
} from "../../graphql/queries";
import Tab from "react-bootstrap/Tab";
import Modules from "../../components/consultants/modules/Modules";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import {useContext, useState} from "react";
import _ from "lodash";
import Nav from "react-bootstrap/Nav";
import TemplateRequestTable from "../../components/consultants/templates/TemplateRequestTable";
import {ToastContext} from "../../contexts/ToastContext";

export const TemplateContext = React.createContext(null);

export const TemplateEditorPage = () => {
  let {id} = useParams();

  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  const [template, setTemplate] = useState(null);
  const {loading, error, data} = useQuery(GET_TEMPLATE, {variables: {id}});
  const [runMutation, {loading: mutationLoading, error: mutationError}] = useMutation(UPSERT_MODULE);
  const [updateTemplateModulesMutation, {loading: updateMutationLoading, error: updateMutationError}] = useMutation(UPDATE_TEMPLATE_MODULES);
  const [duplicateModulesMutation, {loading: duplicateMutationLoading, error: duplicateMutationMutationError}] = useMutation(DUPLICATE_TEMPLATE_MODULES);

  const [activeModule, setActiveModule] = useState(null);

  const toastContext = useContext(ToastContext);

  const updateTemplateModules = (updatedModules, withFolders = []) => {
    const newState = _.cloneDeep(template);
    newState.modules = [
      ...updatedModules,
      ...withFolders
    ];

    setTemplate(newState);
  };

  const updateModule = (module) => {
    runMutation({
      variables: {
        input: {
          id: module.id,
          title: module.title,
          description: module.description,
          reminder: {
            upsert: module.reminder
          },
          trigger: {
            upsert: module.trigger
          },
          content: module.content
        }
      }
    }).then(r => {
      toastContext.addToast({header: "Success!", body: "Saved"});
      let modules = _.cloneDeep(template.modules);
      modules = modules.filter(m => m.id !== r.data.upsertModule.id);
      const module = {...r.data.upsertModule, pivot: _.get(r.data, "upsertModule.templates.0.pivot", {})};
      delete module.programs;
      modules.push(module);
      updateTemplateModules(modules);

      setActiveModule(module);
    });
  };

  const addModule = () => {
    runMutation({
      variables: {
        input: {
          title: "New Module",
          description: "Module description",
          owner: {
            connect: userProfile.id
          },
          templates: {
            connect: [template.id]
          }
        }
      }
    }).then(r => {
      const modules = _.cloneDeep(template.modules);
      const module = {...r.data.upsertModule, pivot: _.get(r.data, "upsertModule.templates.0.pivot", {})};
      delete module.templates;
      modules.push(module);
      updateTemplateModules(modules);
    });
  };

  const saveModulesOrder = (newModules) => {
    const templateModules = newModules.reduce(
      (acc, module) => {
        const {id, folder, order} = module.pivot;
        !module.isFolder && acc.push({id, folder, order});
        return acc;
      }, []
    );

    const withFolders = newModules.filter(module => module.isFolder);
    updateTemplateModules(newModules);
    updateTemplateModulesMutation({
      variables: {
        input: {
          id: template.id,
          templateModules: {
            upsert: templateModules
          }
        }
      }
    }).then(r => {
      updateTemplateModules(r.data.updateTemplateModules.modules, withFolders);
    });
  };

  const updateRecipientList = (recipientList, module) => {
    updateTemplateModulesMutation({
      variables: {
        input: {
          id: template.id,
          templateModules: {
            upsert: [
              {
                id: module.pivot.id,
                recipient_list_id: recipientList.id
              }
            ]
          }
        }
      }
    }).then(r => {
      updateTemplateModules(r.data.updateTemplateModules.modules);
      toastContext.addToast({header: "Success!", body: "Saved"});
    });
  };

  const deleteModules = (modules) => {
    updateTemplateModulesMutation({
      variables: {
        input: {
          id: template.id,
          templateModules: {
            delete: modules
          }
        }
      }
    }).then(r => {
      updateTemplateModules(r.data.updateTemplateModules.modules);
    });
  };

  const duplicateModules = (modules) => {
    duplicateModulesMutation({
      variables: {
        input: {
          id: template.id,
          type: 'template',
          modules
        }
      }
    }).then(r => {
      updateTemplateModules(r.data.duplicateTemplateModules.modules);
    });
  };

  const addFolder = (data) => {
    let newTemplate = _.cloneDeep(template);
    const id = Math.round(Math.random() * 1e6);
    newTemplate.modules = [
      {
        id: id,
        title: data.folder,
        isFolder: true,
        pivot: {id, order: 0, folder: null},
        modules: []
      },
      ...newTemplate.modules
    ];

    setTemplate(newTemplate);
  };

  if (data && !template) {
    setTemplate(data.getTemplate);
    if (data.getTemplate.modules.length) setActiveModule(data.getTemplate.modules[0]);
  }

  return (
    <LoadingContainer
      loading={[mutationLoading, updateMutationLoading, duplicateMutationLoading, loading]}
      error={[mutationError, updateMutationError, duplicateMutationMutationError, error]}
    >
      <Tab.Container defaultActiveKey="modules" id="template-editor" transition={false}>
        <Nav variant="tabs" fill className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="modules">Modules</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="requests">Requests</Nav.Link>
          </Nav.Item>
        </Nav>
        {template &&
        <TemplateContext.Provider
          value={{programModules: template.templateModules, ...template, activeModule, setActiveModule}}>
          <Tab.Content>
            <Tab.Pane eventKey="modules" title="Content">
              <Modules
                addModule={addModule}
                addFolder={addFolder}
                saveModulesOrder={saveModulesOrder}
                deleteModules={deleteModules}
                duplicateModules={duplicateModules}
                updateRecipientList={updateRecipientList}
                updateModule={updateModule}
                sendModule={null}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="requests" title="Requests">
              <TemplateRequestTable requests={template ? template.requests : []}/>
            </Tab.Pane>
          </Tab.Content>
        </TemplateContext.Provider>
        }
      </Tab.Container>
    </LoadingContainer>
  )
};

export default TemplateEditorPage;
