import React, {useEffect} from "react";
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useParams, Redirect, useHistory} from "react-router-dom";
import {Container, Spinner} from "react-bootstrap";
import {CREATE_PROGRAM_LEARNER, CURRENT_USER, UPSERT_TEMPLATE} from "../../graphql/queries";
import LoadingContainer from "../hoc/LoadingContainer/LoadingContainer";

export const ProgramEnrolPage = () => {
  const {id} = useParams();
  const history = useHistory();

  const [runMutation, {loading: mutationLoading, error: mutationError, data: mutationData}] = useMutation(CREATE_PROGRAM_LEARNER);


  useEffect(() => {
    if (!mutationData) {
      runMutation({
        variables: {
          input: {
            program_id: id
          }
        }
      });
    }

    if (mutationData) history.push(`/program/respond/${id}`);
  }, [mutationData]);

  return (
    <LoadingContainer loading={mutationLoading} error={mutationError}>
      Enrolling you...
    </LoadingContainer>
  );
};

export default ProgramEnrolPage;
