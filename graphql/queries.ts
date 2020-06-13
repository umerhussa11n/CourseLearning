import {gql} from 'graphql.macro';

//TODO: fragments
export const GET_TEMPLATE = gql`
  query getTemplate($id: ID!) {
    getTemplate(id: $id) {
      id
      title
      can_request
      is_public
      dynamic_fields
      created_at
      templateModules {
        id
        module_variables
      }
      modules {
        id
        title
        content
        conditions
        pivot {
          id
          folder
          order
          recipient_list_id
        }
        reminder {
          id
          subject
          message
          frequency
          max_reminders
        }
        trigger {
          id
          start_timestamp
          start_timestamp_field
          frequency
          max_sends
        }
      }
      recipientLists {
        id
        name
        channel
        max_recipients
      }
      requests {
        id
        email
        organization
        comment
      }
      tags {
        id
        label
      }
    }
  }
`;

export const GET_TEMPLATES_BY_OWNER = gql`
  query getTemplatesByOwner($consultant_profile_id: ID!) {
    getTemplatesByOwner(consultant_profile_id: $consultant_profile_id) {
      id
      title
      dynamic_fields
    }
  }
`;

export const UPSERT_TEMPLATE = gql`
  mutation updateTemplate($input: UpsertTemplateInput!) {
    upsertTemplate(input: $input) {
      id
      title
      can_request
      is_public
      dynamic_fields
      tags {
        id
        label
      }
    }
  }
`;

export const UPDATE_TEMPLATE_MODULES = gql`
  mutation updateTemplateModules($input: UpdateTemplateModulesInput!) {
    updateTemplateModules(input: $input) {
      id
      modules {
        id
        title
        description
        content
        conditions
        pivot {
          id
          folder
          order
          recipient_list_id
        }
        reminder {
          id
          subject
          message
          frequency
          max_reminders
        }
        trigger {
          id
          start_timestamp
          start_timestamp_field
          frequency
          max_sends
        }
      }
    }
  }
`;

export const DUPLICATE_TEMPLATE_MODULES = gql`
  mutation duplicateTemplateModules($input: DuplicateTemplateModulesInput!) {
    duplicateTemplateModules(input: $input) {
      id
      modules {
        id
        title
        description
        content
        conditions
        pivot {
          id
          folder
          order
          recipient_list_id
        }
        reminder {
          id
          subject
          message
          frequency
          max_reminders
        }
        trigger {
          id
          start_timestamp
          start_timestamp_field
          frequency
          max_sends
        }
      }
    }
  }
`;

export const DUPLICATE_PROGRAM_MODULES = gql`
  mutation duplicateProgramModules($input: DuplicateProgramModulesInput!) {
    duplicateProgramModules(input: $input) {
      id
      modules {
        id
        title
        description
        content
        conditions
        pivot {
          id
          folder
          order
          recipient_list_id
        }
        reminder {
          id
          subject
          message
          frequency
          max_reminders
        }
        trigger {
          id
          start_timestamp
          start_timestamp_field
          frequency
          max_sends
        }
      }
    }
  }
`;

export const UPDATE_PROGRAM_MODULES = gql`
  mutation updateProgramModules($input: UpdateProgramModulesInput!) {
    updateProgramModules(input: $input) {
      id
      modules {
        id
        title
        description
        content
        conditions
        pivot {
          id
          folder
          order
          recipient_list_id
        }
        reminder {
          id
          subject
          message
          frequency
          max_reminders
        }
        trigger {
          id
          start_timestamp
          start_timestamp_field
          frequency
          max_sends
        }
      }
    }
  }
`;

export const LEARNER_GET_PROGRAM = gql`
  query getProgram($id: ID!) {
    getProgram(id: $id) {
      id
      title
      format
      max_learners
      start_timestamp
      can_invite
      is_public
      dynamic_fields
      created_at
      template {
        id
        title
      }
      programModules {
        id
        module {
          id
          title
          description
          content
        }
        sends {
          id
          learner {
            id
          }
          reason
          channel
          subject
          message

          send_timestamp
          open_timestamp
          click_timestamp
          response_timestamp

          response_feedback
          response_rating
          response_data
        }
      }
    }
  }
`;

export const GET_PROGRAM = gql`
  query getProgram($id: ID!) {
    getProgram(id: $id) {
      id
      title
      format
      max_learners
      start_timestamp
      can_invite
      is_public
      dynamic_fields
      created_at
      company_name
      company_logo_url
      template {
        id
        title
      }
      modules {
        id
        title
        description
        content
        conditions

        pivot {
          id
          folder
          order
          recipient_list_id
        }

        reminder {
          id
          subject
          message
          frequency
          max_reminders
        }
        trigger {
          id
          start_timestamp
          start_timestamp_field
          frequency
          max_sends
        }
      }
      recipientLists {
        id
        name
        channel
        max_recipients
      }
      programModules {
        id
        module_variables
        module {
          id
          title
        }
        recipientList {
          id
          name
        }
        sends {
          id
          learner {
            id
          }
          reason
          channel
          subject
          message

          send_timestamp
          open_timestamp
          click_timestamp
          response_timestamp

          response_feedback
          response_rating
          response_data
        }

      }
      learners {
        user {
          id
          name
        }
        id
        picture_url
        role
        tenure
      }
      tags {
        id
        label
      }
      invites {
        email
        creator {
          id
          name
        }
        learner {
          id
        }
      }
    }
  }
`;

export const UPSERT_PROGRAM = gql`
  mutation upsertProgram($input: UpsertProgramInput!) {
    upsertProgram(input: $input) {
      id
      template {
        id
        title
      }
      title
      format
      max_learners
      start_timestamp
      can_invite
      is_public
      dynamic_fields
      tags {
        id
        label
      }
      company_name
      company_logo_url
    }
  }
`;

export const CREATE_PROGRAM_INVITES = gql`
  mutation createProgramInvites($input: [CreateProgramInviteInput]!) {
    createProgramInvites(input: $input) {
      id
      email
      created_at
    }
  }
`;

export const CREATE_PROGRAM_MODULE_SENDS = gql`
  mutation createProgramModuleSends($input: CreateProgramModuleSendsInput!) {
    createProgramModuleSends(input: $input) {
      id
      programModule {
        id
      }
      learner {
        id
      }
      recipientList {
        id
      }
      reason
      channel
      subject
      message

      send_timestamp
      open_timestamp
      click_timestamp
      response_timestamp

      response_feedback
      response_rating
      response_data
    }
  }
`;

export const UPSERT_MODULE = gql`
  mutation upsertModule($input: UpsertModuleInput!) {
    upsertModule(input: $input) {
      id
      title
      description
      content
      conditions
      pivot {
        id
        folder
        order
        recipient_list_id
      }
      programs {
        id
        pivot {
          id
          folder
          order
          recipient_list_id
        }
      }
      templates {
        id
        pivot {
          id
          folder
          order
          recipient_list_id
        }
      }
      reminder {
        id
        subject
        message
        frequency
        max_reminders
      }
      trigger {
        id
        start_timestamp
        start_timestamp_field
        frequency
        max_sends
      }
      tags {
        id
        label
      }
    }
  }
`;

export const GET_TAG = gql`
  query getTag($id: ID!) {
    getTag(id: $id) {
      id
      name
      created_at
      templates {
        id
        title
      }
      programs {
        id
        title
      }
      modules {
        id
        title
      }
    }
  }
`;

export const GET_ALL_TAGS = gql`
    query tags {
      tags {
        id
        label
        created_at
      }
    }
`;

export const UPDATE_PROGRAM_MODULE_SEND = gql`
  mutation updateConsultantProfile($input: UpdateProgramModuleSendInput!) {
    updateProgramModuleSend(input: $input) {
      id
      response_rating
      response_feedback
      response_data
    }
  }
`;

export const GET_USER = gql`
  query getUser($id : ID!) {
    getUser(id: $id) {
      id
      name
      email
      email_verified_at
      learnerProfile {
        id
        picture_url
        role
        tenure
      }
      consultantProfile {
        id
        picture_url
        title
        bio
      }
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      id
      name
      email
      email_verified_at
      learnerProfile {
        id
        picture_url
        role
        tenure
      }
      consultantProfile {
        id
        picture_url
        title
        bio
      }
    }
  }
`;

export const CREATE_CONSULTANT_PROFILE = gql`
  mutation createConsultantProfile($input: CreateConsultantProfileInput!) {
    createConsultantProfile(input: $input) {
      id
      picture_url
      title
      bio
      programs {
        id
        title
        format
        max_learners
        start_timestamp
        can_invite
        is_public
        progress
        programModules {
          id
          module {
            id
            title
          }
          sends {
            id
            response_timestamp
          }
        }
        learners {
          id
        }
        invites {
          id
        }
      }
      templates {
        id
        title
        can_request
        is_public
        requests {
          id
        }
        programs {
          id
        }
      }
    }
  }
`;

export const CREATE_PROGRAM_LEARNER = gql`
  mutation createProgramLearner($input : CreateProgramLearnerInput!) {
    createProgramLearner(input: $input) {
      id
    }
  }
`;

export const CREATE_LEARNER_PROFILE = gql`
  mutation createLearnerProfile($input: CreateLearnerProfileInput!) {
    createLearnerProfile(input: $input) {
      id
      picture_url
      role
      tenure
      programInvites {
        id
        program {
          id
          title
          start_timestamp
        }
      }
      programs {
        id
        title
        format
        max_learners
        start_timestamp
        can_invite
        is_public
        progress
        programModules {
          id
          module {
            id
            title
            content
          }
          sends {
            id
            response_timestamp
            response_data
            response_feedback
            response_rating
            programModule {
              id
              module {
                id
                title
                content
              }
            }
          }
        }
      }
    }
  }
`;

// TODO: Hide invites that have been accepted by adding ProgramLearner relation
// on invites and checking if it exists
export const GET_LEARNER_PROFILE = gql`
  query getLearnerProfile($user_id : ID!) {
    getLearnerProfile(user_id: $user_id) {
      id
      picture_url
      role
      tenure
      programInvites {
        id
        program {
          id
          title
          format
          start_timestamp
        }
      }
      programs {
        id
        title
        format
        max_learners
        start_timestamp
        can_invite
        is_public
        progress
        programModules {
          id
          module {
            id
            title
            content
          }
          sends {
            id
            response_timestamp
            response_data
            response_feedback
            response_rating
            programModule {
              id
              module {
                id
                title
                content
              }
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_LEARNER_PROFILE = gql`
  mutation updateLearnerProfile($input: UpdateLearnerProfileInput!) {
    updateLearnerProfile(input: $input) {
      id
      picture_url
      role
      tenure
      programInvites {
        id
        program {
          id
          title
          start_timestamp
        }
      }
      programs {
        id
        title
        format
        max_learners
        start_timestamp
        can_invite
        is_public
        progress
        programModules {
          id
          module {
            id
            title
            content
          }
          sends {
            id
            response_timestamp
            response_data
            response_feedback
            response_rating
            programModule {
              id
              module {
                id
                title
                content
              }
            }
          }
        }
      }
    }
  }
`;


export const GET_CONSULTANT_PROFILE = gql`
  query getConsultantProfile($user_id : ID!) {
    getConsultantProfile(user_id: $user_id) {
      id
      picture_url
      title
      bio
      programs {
        id
        title
        format
        max_learners
        start_timestamp
        can_invite
        is_public
        progress
        programModules {
          id
          module {
            id
            title
          }
          sends {
            id
            response_timestamp
          }
        }
        learners {
          id
        }
        invites {
          id
        }
      }
      templates {
        id
        title
        can_request
        is_public
        requests {
          id
        }
        programs {
          id
        }
      }
    }
  }
`;

export const UPDATE_CONSULTANT_PROFILE = gql`
  mutation updateConsultantProfile($input: UpdateConsultantProfileInput!) {
    updateConsultantProfile(input: $input) {
      id
      picture_url
      title
      bio

      programs {
        id
        title
        format
        max_learners
        start_timestamp
        can_invite
        is_public
        progress
        programModules {
          id
          module {
            id
            title
          }
          sends {
            id
            response_timestamp
          }
        }
        learners {
          id
        }
        invites {
          id
        }
      }
      templates {
        title
        can_request
        is_public
        requests {
          id
        }
        programs {
          id
        }
      }
    }
  }
`;

//Local apollo state queries

export const CURRENT_USER = gql`
  {
    user @client{
      id
      name
      email
      email_verified_at
      learnerProfile {
        id
        picture_url
        role
        tenure
      }
      consultantProfile {
        id
        picture_url
        title
        bio
      }
    }
  }
`;

export const CURRENT_USER_PROFILE = gql`
  {
    userProfile @client{
      id
      picture_url
      type
    }
  }
`;
