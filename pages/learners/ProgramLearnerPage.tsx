import * as React from "react";
import {useMutation, useQuery} from '@apollo/react-hooks';
import LoadingContainer from "../../components/hoc/LoadingContainer/LoadingContainer";
import {useParams} from "react-router-dom";
import {GET_LEARNER_PROFILE, LEARNER_GET_PROGRAM, UPDATE_PROGRAM_MODULE_SEND} from "../../graphql/queries";
import ProgramModuleSendEditor from "../../components/learners/ProgramModuleSendEditor/ProgramModuleSendEditor";
import ProgramModuleList from "../../components/learners/ProgramModuleList/ProgramModuleList";
import {useContext, useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import _ from "lodash";
import {ProgramModule, Module, Maybe} from "../../graphql/graphql-generated";
import {immutableMerge} from "../../utils/utils";
import Alert from "react-bootstrap/Alert";
import {ToastContext} from "../../contexts/ToastContext";

export const ProgramLearnerPage = () => {
  let {id} = useParams();

  const [formData, setFormData] = useState(null);
  const [activeProgramModule, setActiveProgramModule] = useState(null);

  const {loading: queryLoading, error: queryError, data: queryData} = useQuery(LEARNER_GET_PROGRAM, {variables: {id: id}});
  const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(UPDATE_PROGRAM_MODULE_SEND);

  const toastContext = useContext(ToastContext);

  const update = () => {
    let submitData = _.cloneDeep(formData);
    submitData.response_data = JSON.stringify(submitData.response_data);
    submitData.id = activeProgramModule.sends[0].id;
    delete submitData.response_timestamp;

    runMutation({
      variables: {
        input: submitData
      }
    }).then(r => {
      toastContext.addToast({header: "Success!", body: "Saved"});
    });
  };

  const setModule = (module: Module) => {
    setActiveProgramModule(queryData.getProgram.programModules.filter((pm => pm.module.id == module.id))[0]);
  };

  /**
   * TODO: Set the activeProgramModule the first time based on:
   * - The latest send_timestamp, where response_timestamp is null for programModule.sends[0]
   *  (programModule.sends will always only have one element in this context)
   */
  useEffect(() => {
    if (queryData) {
      let apm = queryData.getProgram.programModules.filter(pm => !!pm.sends.length)[0];
      setActiveProgramModule(apm);
    }
  }, [queryData]);

  useEffect(() => {
    if (activeProgramModule && activeProgramModule.sends.length) {
      setFormData({
        response_data: JSON.parse(activeProgramModule.sends[0].response_data),
        response_rating: activeProgramModule.sends[0].response_rating,
        response_feedback: activeProgramModule.sends[0].response_feedback,
        response_timestamp: activeProgramModule.sends[0].response_timestamp,
        id: activeProgramModule.sends[0].id
      });
    }
  }, [activeProgramModule]);

  return (
    <LoadingContainer
      loading={[mutationLoading, queryLoading]}
      error={[mutationError, queryError]}>
      {(!activeProgramModule || (activeProgramModule && !activeProgramModule.sends.length)) &&
        <Alert variant="info">
          This program hasn't started yet! You'll recieve an email when the first module is published.
        </Alert>
      }
      {queryData && activeProgramModule && formData &&
      <>
        <Row>
          <Col md={3}>
            <ProgramModuleList
              modules={queryData.getProgram.programModules.filter(pm => !!pm.sends.length).map(pm => pm.module)}
              activeModule={activeProgramModule.module}
              setActiveModule={setModule}
            />
          </Col>
          <Col>
            <ProgramModuleSendEditor
              module={activeProgramModule.module}
              formData={formData}
              onChange={d => setFormData(immutableMerge(formData, d))}
              onSubmit={update}
            />
          </Col>
        </Row>
      </>
      }
    </LoadingContainer>
  )
};

export default ProgramLearnerPage;
