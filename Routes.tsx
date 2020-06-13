import React from 'react';
import {useQuery} from "@apollo/react-hooks";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import FormSample from "./components/consultants/ElentaFormBuilder/FormSample";
import LoginPage from "./pages/shared/LoginPage";
import PasswordResetPage from "./pages/shared/PasswordResetPage";
import TemplateSettingsPage from "./pages/consultants/TemplateSettingsPage";
import TemplateEditorPage from "./pages/consultants/TemplateEditorPage";
import ProgramSettingsPage from "./pages/consultants/ProgramSettingsPage";
import ProgramLearnerPage from "./pages/learners/ProgramLearnerPage";
import LoginCallbackPage from "./pages/shared/LoginCallbackPage";
import ConsultantDashboard from "./pages/consultants/ConsultantDashboard";
import PageContainer from "./components/hoc/PageContainer/PageContainer";
import PrivateRoute from "./components/hoc/PrivateRoute";
import {CURRENT_USER_PROFILE} from "./graphql/queries";
import ConsultantProfileSettingsPage from "./pages/consultants/ConsultantProfileSettingsPage";
import LearnerProfileSettingsPage from "./pages/learners/LearnerProfileSettingsPage";
import LearnerDashboard from "./pages/learners/LearnerDashboard";
import NotFoundPage from "./pages/shared/NotFoundPage";
import ProgramEnrolPage from "./components/learners/ProgramEnrolPage";
import ProgramContentPage from "./pages/consultants/ProgramContentPage";

const Routes = () => {
  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  return (
    <BrowserRouter>
      <PageContainer>
        <Switch>
          <Route exact={true} path="/" component={LoginPage}/>
          <Route exact={true} path="/login" component={LoginPage}/>
          <Route exact={true} path="/login/callback/:token" component={LoginCallbackPage}/>
          <Route exact={true} path="/password/reset/:token" component={PasswordResetPage}/>
          <Route exact={true} path="/formsample" component={FormSample}/>
          {
            userProfile && userProfile.type === "learnerProfile" &&
              <>
                <PrivateRoute exact={true} path="/dashboard" component={LearnerDashboard}/>
                <PrivateRoute exact={true} path="/preferences" component={LearnerProfileSettingsPage}/>
                <PrivateRoute exact={true} path="/program/enrol/:id" component={ProgramEnrolPage}/>
                <PrivateRoute exact={true} path="/program/respond/:id" component={ProgramLearnerPage}/>
              </>
          }
          {
            userProfile && userProfile.type === "consultantProfile" &&
            <>
              <PrivateRoute exact={true} path="/dashboard" component={ConsultantDashboard}/>
              <PrivateRoute exact={true} path="/preferences" component={ConsultantProfileSettingsPage}/>

              <PrivateRoute exact={true} path="/program/settings/:id" component={ProgramSettingsPage}/>
              <PrivateRoute exact={true} path="/program/content/:id" component={ProgramContentPage}/>

              <PrivateRoute exact={true} path="/template/settings/:id" component={TemplateSettingsPage}/>
              <PrivateRoute exact={true} path="/template/content/:id" component={TemplateEditorPage}/>
            </>
          }
          <Route component={NotFoundPage} />
        </Switch>
      </PageContainer>
    </BrowserRouter>
  )
};

export default Routes;
