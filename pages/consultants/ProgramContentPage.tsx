import * as React from "react";
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
  CURRENT_USER_PROFILE, DUPLICATE_PROGRAM_MODULES,
  UPDATE_PROGRAM_MODULES,
  UPSERT_MODULE,
  CREATE_PROGRAM_MODULE_SENDS, GET_PROGRAM
} from "../../graphql/queries";
import Tab from "react-bootstrap/Tab";
import Modules from "../../components/consultants/modules/Modules";
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import {useContext, useEffect, useState} from "react";
import _ from "lodash";
import ProgramLearnerTable from "../../components/consultants/programs/ProgramLearnerTable";
import Nav from "react-bootstrap/Nav";
import ProgramInviteTool from "../../components/consultants/programs/ProgramInvite/ProgramInviteTool";
import ProgramInviteTable from "../../components/consultants/programs/ProgramInvite/ProgramInviteTable";
import {ToastContext} from "../../contexts/ToastContext";
import {useParams} from "react-router-dom";

export const ProgramContext = React.createContext(null);

export const ProgramContentPage = () => {
  let {id} = useParams();

  const {loading, error, data} = useQuery(GET_PROGRAM, {variables: {id}});
  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(UPSERT_MODULE);
  const [runSendMutation, {loading: sendMutationLoading, error: sendMutationError, data: sendMutationData}] = useMutation(CREATE_PROGRAM_MODULE_SENDS);
  const [updateProgramModulesMutation, {loading: updateMutationLoading, error: updateMutationError, data: updateMutationData}] = useMutation(UPDATE_PROGRAM_MODULES);
  const [duplicateModulesMutation, {loading: duplicateMutationLoading, error: duplicateMutationMutationError, data: duplicateMutationData}] = useMutation(DUPLICATE_PROGRAM_MODULES);

  const [program, setProgram] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  const toastContext = useContext(ToastContext);

  useEffect(() => {
    if (data) {
      const program = data.getProgram;
      setProgram(program);
      setActiveModule(program.modules.length ? program.modules[0] : null);
    }
  }, [data]);

  const updateProgramModules = (updatedModules, withFolders = []) => {
    let newState = _.cloneDeep(program);
    newState.modules = [
      ...updatedModules,
      ...withFolders
    ];
    setProgram(newState);
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
      let modules = _.cloneDeep(program.modules);
      modules = modules.filter(m => m.id !== r.data.upsertModule.id);
      const module = {...r.data.upsertModule, pivot: _.get(r.data, "upsertModule.programs.0.pivot", {})};
      delete module.programs;
      modules.push(module);
      updateProgramModules(modules);

      setActiveModule(module);
    });
  };

  const sendModule = (module) => {
    runSendMutation({
      variables: {
        input: {
          program_module_id: module.pivot.id
        }
      }
    }).then(r => {
      toastContext.addToast({header: "Success!", body: "Sent"});
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
          programs: {
            connect: [program.id]
          }
        }
      }
    }).then(r => {
      const modules = _.cloneDeep(program.modules);
      const module = {...r.data.upsertModule, pivot: _.get(r.data, "upsertModule.programs.0.pivot", {})};
      delete module.programs;
      modules.push(module);
      updateProgramModules(modules);
    });
  };

  const saveModulesOrder = (newModules) => {
    const programModules = newModules.reduce(
      (acc, module) => {
        const {id, folder, order} = module.pivot;
        !module.isFolder && acc.push({id, folder, order});
        return acc;
      }, []
    );

    const withFolders = newModules.filter(module => module.isFolder);
    updateProgramModules(newModules);
    updateProgramModulesMutation({
      variables: {
        input: {
          id: program.id,
          programModules: {
            upsert: programModules
          }
        }
      }
    }).then(r => {
      updateProgramModules(r.data.updateProgramModules.modules, withFolders);
    });
  };

  const updateRecipientList = (recipientList, module) => {
    updateProgramModulesMutation({
      variables: {
        input: {
          id: program.id,
          programModules: {
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
      updateProgramModules(r.data.updateProgramModules.modules);
      toastContext.addToast({header: "Success!", body: "Saved"});
    });
  };

  const deleteModules = (modules) => {
    updateProgramModulesMutation({
      variables: {
        input: {
          id: program.id,
          programModules: {
            delete: modules
          }
        }
      }
    }).then(r => {
      updateProgramModules(r.data.updateProgramModules.modules);
    });
  };

  const duplicateModules = (modules) => {
    duplicateModulesMutation({
      variables: {
        input: {
          id: program.id,
          type: 'program',
          modules
        }
      }
    }).then(r => {
      updateProgramModules(r.data.duplicateProgramModules.modules);
    });
  };

  const addFolder = (data) => {
    let newProgram = _.cloneDeep(program);
    const id = Math.round(Math.random() * 1e6);
    newProgram.modules = [
      {
        id: id,
        title: data.folder,
        isFolder: true,
        pivot: {id, order: 0, folder: null},
        modules: []
      },
      ...newProgram.modules
    ];

    setProgram(newProgram);
  };

  return (
    <LoadingContainer
      loading={[mutationLoading, updateMutationLoading, duplicateMutationLoading, loading]}
      error={[mutationError, updateMutationError, duplicateMutationMutationError, error]}
    >
      <Tab.Container defaultActiveKey="modules" id="program-editor" transition={false}>
        <Nav variant="tabs" fill className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="modules">Modules</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="learners">Learners</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="invites">Invites</Nav.Link>
          </Nav.Item>
        </Nav>
        {program &&
        <ProgramContext.Provider value={{...program, activeModule, setActiveModule}}>
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
                sendModule={sendModule}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="learners" title="Learners">
              <ProgramLearnerTable program={program}/>
            </Tab.Pane>
            <Tab.Pane eventKey="invites" title="Invites">
              <h3>Invite by Email</h3>
              <ProgramInviteTool setProgram={setProgram} program={program}/>
              <h3>Invites</h3>
              <ProgramInviteTable invites={program ? program.invites : []}/>
            </Tab.Pane>
          </Tab.Content>
        </ProgramContext.Provider>
        }
      </Tab.Container>
    </LoadingContainer>
  )
};

export default ProgramContentPage;
