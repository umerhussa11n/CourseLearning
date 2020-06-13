import React from 'react';
import {useQuery} from "@apollo/react-hooks";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import FormSample from "./components/consultants/ElentaFormBuilder/FormSample";
import ProgramContentPage from "./pages/consultants/ProgramContentPage";
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

const LoginRoutes = () => {
  return (
    <BrowserRouter>
      <PageContainer>
        <Switch>
          <Route exact={true} path="/" component={FormSample}/>
          <Route exact={true} path="/login" component={LoginPage}/>
          <Route exact={true} path="/login/callback/:token" component={LoginCallbackPage}/>
          <Route exact={true} path="/password/reset/:token" component={PasswordResetPage}/>
        </Switch>
      </PageContainer>
    </BrowserRouter>
  )
};

export default LoginRoutes;
