import React, {useEffect} from "react";
import axios from "axios";
import {
  NavbarBrand,
  Navbar,
  Dropdown,
  Container,
  Button,
  Image,
  Row
} from "react-bootstrap";
import {get} from "lodash";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import ProfileDropdownItem from "./ProfileDropdownItem";
import {Link, NavLink, useHistory, useLocation} from "react-router-dom";
import {useApolloClient, useMutation, useQuery} from "@apollo/react-hooks";
import {
  CREATE_CONSULTANT_PROFILE,
  CREATE_LEARNER_PROFILE,
  CURRENT_USER,
  CURRENT_USER_PROFILE,
} from "../../../graphql/queries";
import './ElentaNav.scss';
import {ElentaCachePersistor, ElentaClient} from "../../../app";

export const ElentaNav = () => {
  const location = useLocation();
  const history = useHistory();
  const client = useApolloClient();
  const {data: {user}} = useQuery(CURRENT_USER);
  const {data: {userProfile}} = useQuery(CURRENT_USER_PROFILE);

  const consultantProfile = get(user, 'consultantProfile', null);
  const learnerProfile = get(user, 'learnerProfile', null);

  const [runLearnerMutation, {loading: learnerMutationLoading, error: learnerMutationError, data: learnerMutationData}] = useMutation(CREATE_LEARNER_PROFILE);
  const [runConsultantMutation, {loading: consultantMutationLoading, error: consultantMutationError, data: consultantMutationData}] = useMutation(CREATE_CONSULTANT_PROFILE);

  useEffect(() => {
    let userProfile = null;

    if (learnerMutationData) {
      userProfile = learnerMutationData.createLearnerProfile;
    }
    if (consultantMutationData) {
      userProfile = consultantMutationData.createConsultantProfile;
    }

    if (userProfile) {
      client.writeData({
        data: {
          userProfile
        }
      });
      redirectToProfile();
    }
  }, [learnerMutationData, consultantMutationData]);

  const selectProfile = (profile) => {
    if (profile.id !== userProfile.id) {
      client.writeData({
        data: {
          userProfile: profile
        }
      });
    }

    redirectToProfile();
  };

  const redirectToProfile = () => {
    history.push("/dashboard");
  };

  const createProfile = (accountType) => {
    switch (accountType) {
      case "consultant": {
        runConsultantMutation({
          variables: {
            input: {
              picture_url: "https://lorempixel.com/640/480/?20990",
              title: "Consultant",
              bio: "",
              user: {
                connect: user.id
              }
            }
          }
        });
        break;
      }
      case "learner": {
        runLearnerMutation({
          variables: {
            input: {
              picture_url: "https://lorempixel.com/640/480/?20990",
              role: "Learner",
              tenure: "Learner",
              user: {
                connect: user.id
              }
            }
          }
        });
        break;
      }
    }
  };

  const logout = () => {
    axios.post('/logout')
      .then(function (response) {
        localStorage.removeItem('token');
        (async () => {
          await ElentaClient.clearStore();
          await ElentaCachePersistor.purge()
        })();
        window.location.replace('/');
      })
      .catch(function (error) {
        localStorage.removeItem('token');
        (async () => {
          await ElentaClient.clearStore();
          await ElentaCachePersistor.purge()
        })();
        window.location.replace('/');
      });
  };

  return (
    <Container>
      <Row>
        <Navbar bg="light" fixed="top">
          <NavbarBrand>
            <Link to={user ? "/dashboard" : "/"}>
              <Image src={process.env.ASSET_URL + "/images/logo.png"} alt="logo" style={{height: '30px'}}/>
            </Link>
          </NavbarBrand>
          <NavbarToggle/>
          <NavbarCollapse className="justify-content-end">
            {user
              ?
              <>
                <Dropdown>
                  <Dropdown.Toggle id="account-dropdown"
                                   className="account-dropdown rounded-circle">
                    {
                      userProfile &&
                      <Image src={userProfile.picture_url ?
                        userProfile.picture_url
                        : `${process.env.APP_URL}/images/avatar.svg`
                      }
                             className="profile-image"
                             alt="Profile Picture" roundedCircle/>
                    }
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      consultantProfile &&
                      <ProfileDropdownItem key={consultantProfile.id}
                                           onClick={() => selectProfile({
                                             ...consultantProfile,
                                             type: "consultantProfile"
                                           })}
                                           profile={consultantProfile}/>
                    }
                    {
                      learnerProfile &&
                      <ProfileDropdownItem key={learnerProfile.id}
                                           onClick={() => selectProfile({...learnerProfile, type: "learnerProfile"})}
                                           profile={learnerProfile}/>
                    }
                    <Dropdown.Item onClick={() => logout()}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                  <b className="pl-2 pr-4">{user.name}</b>
                </Dropdown>
              </>
              :
              <div>
                <NavLink to={'/login'} activeClassName="disabled">
                  <Button>Log in</Button>
                </NavLink>
              </div>
            }
          </NavbarCollapse>
        </Navbar>
      </Row>
    </Container>
  );
};

export default ElentaNav;
