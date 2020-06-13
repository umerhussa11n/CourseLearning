import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Date: any;
};

export type Query = {
   __typename?: 'Query';
  me?: Maybe<User>;
  users: Array<User>;
  getUser: User;
  getConsultantProfile: ConsultantProfile;
  getProgram: Program;
  getTemplate: Template;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetConsultantProfileArgs = {
  id: Scalars['ID'];
};


export type QueryGetProgramArgs = {
  id: Scalars['ID'];
};


export type QueryGetTemplateArgs = {
  id: Scalars['ID'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  email_verified_at?: Maybe<Scalars['DateTime']>;
  card_brand?: Maybe<Scalars['String']>;
  card_last_four?: Maybe<Scalars['String']>;
  trial_ends_at?: Maybe<Scalars['DateTime']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  learnerProfile?: Maybe<Array<Maybe<LearnerProfile>>>;
  consultantProfile?: Maybe<Array<Maybe<ConsultantProfile>>>;
};


export type LearnerProfile = {
   __typename?: 'LearnerProfile';
  id: Scalars['ID'];
  user: User;
  picture_url?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  tenure?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  programs?: Maybe<Array<Maybe<Program>>>;
  programModules?: Maybe<Array<Maybe<ProgramModule>>>;
};

export type Program = {
   __typename?: 'Program';
  id: Scalars['ID'];
  owner: ConsultantProfile;
  template: Template;
  title: Scalars['String'];
  format: Scalars['String'];
  max_learners?: Maybe<Scalars['Int']>;
  start_timestamp?: Maybe<Scalars['DateTime']>;
  can_share?: Maybe<Scalars['Boolean']>;
  is_public?: Maybe<Scalars['Boolean']>;
  dynamic_fields?: Maybe<Scalars['String']>;
  dynamic_fields_data?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  programModules?: Maybe<Array<Maybe<ProgramModule>>>;
  modules?: Maybe<Array<Maybe<Module>>>;
  learners?: Maybe<Array<Maybe<LearnerProfile>>>;
  invites?: Maybe<Array<Maybe<ProgramInvite>>>;
};

export type ConsultantProfile = {
   __typename?: 'ConsultantProfile';
  id: Scalars['ID'];
  user: User;
  picture_url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  programs?: Maybe<Array<Maybe<Program>>>;
  templates?: Maybe<Array<Maybe<Template>>>;
};

export type Template = {
   __typename?: 'Template';
  id: Scalars['ID'];
  owner: ConsultantProfile;
  title: Scalars['String'];
  can_request: Scalars['Boolean'];
  is_public: Scalars['Boolean'];
  dynamic_fields?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  templateModules?: Maybe<Array<Maybe<TemplateModule>>>;
  modules?: Maybe<Array<Maybe<Module>>>;
  requests?: Maybe<Array<Maybe<TemplateRequest>>>;
  programs?: Maybe<Array<Maybe<Program>>>;
};

export type TemplateModule = {
   __typename?: 'TemplateModule';
  id: Scalars['ID'];
  module?: Maybe<Module>;
  folder?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type Module = {
   __typename?: 'Module';
  id: Scalars['ID'];
  owner: User;
  title: Scalars['String'];
  description: Scalars['String'];
  is_public: Scalars['Boolean'];
  content?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  templates?: Maybe<Array<Maybe<Template>>>;
  programs?: Maybe<Array<Maybe<Program>>>;
  reminders?: Maybe<Array<Maybe<ModuleReminder>>>;
  triggers?: Maybe<Array<Maybe<ModuleTrigger>>>;
};

export type ModuleReminder = {
   __typename?: 'ModuleReminder';
  id: Scalars['ID'];
  module?: Maybe<Module>;
  type: Scalars['String'];
  subject: Scalars['String'];
  message: Scalars['String'];
  frequency: Scalars['Int'];
  max_reminders: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type ModuleTrigger = {
   __typename?: 'ModuleTrigger';
  id: Scalars['ID'];
  module?: Maybe<Module>;
  start_timestamp?: Maybe<Scalars['DateTime']>;
  start_timestamp_field?: Maybe<Scalars['String']>;
  frequency: Scalars['Int'];
  max_sends: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type TemplateRequest = {
   __typename?: 'TemplateRequest';
  id: Scalars['ID'];
  template: Template;
  learner?: Maybe<LearnerProfile>;
  email?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type ProgramModule = {
   __typename?: 'ProgramModule';
  id: Scalars['ID'];
  program?: Maybe<Program>;
  module?: Maybe<Module>;
  folder?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
  reminders?: Maybe<Array<Maybe<ModuleReminder>>>;
  triggers?: Maybe<Array<Maybe<ModuleTrigger>>>;
  sends?: Maybe<Array<Maybe<ProgramModuleSend>>>;
};

export type ProgramModuleSend = {
   __typename?: 'ProgramModuleSend';
  id: Scalars['ID'];
  programModule?: Maybe<ProgramModule>;
  learner?: Maybe<LearnerProfile>;
  reason: Scalars['String'];
  channel: Scalars['String'];
  subject: Scalars['String'];
  message: Scalars['String'];
  send_timestamp: Scalars['DateTime'];
  open_timestamp: Scalars['DateTime'];
  click_timestamp: Scalars['DateTime'];
  response_timestamp: Scalars['DateTime'];
  response_feedback?: Maybe<Scalars['String']>;
  response_rating: Scalars['Int'];
  response_data: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type ProgramInvite = {
   __typename?: 'ProgramInvite';
  id: Scalars['ID'];
  program: Program;
  creator: User;
  learner?: Maybe<LearnerProfile>;
  email: Scalars['String'];
  message: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createConsultantProfile: ConsultantProfile;
  updateConsultantProfile: ConsultantProfile;
  createLearnerProfile: LearnerProfile;
  updateLearnerProfile: LearnerProfile;
  createModule: Module;
  updateModule: Module;
  deleteModule?: Maybe<Module>;
  createTemplate: Template;
  updateTemplate: Template;
  createTemplateRequest: TemplateRequest;
  updateTemplateRequest: TemplateRequest;
};


export type MutationCreateConsultantProfileArgs = {
  input?: Maybe<CreateConsultantProfileInput>;
};


export type MutationUpdateConsultantProfileArgs = {
  input?: Maybe<UpdateConsultantProfileInput>;
};


export type MutationCreateLearnerProfileArgs = {
  input?: Maybe<CreateLearnerProfileInput>;
};


export type MutationUpdateLearnerProfileArgs = {
  input?: Maybe<UpdateLearnerProfileInput>;
};


export type MutationCreateModuleArgs = {
  input?: Maybe<CreateModuleInput>;
};


export type MutationUpdateModuleArgs = {
  input?: Maybe<UpdateModuleInput>;
};


export type MutationDeleteModuleArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTemplateArgs = {
  input?: Maybe<CreateTemplateInput>;
};


export type MutationUpdateTemplateArgs = {
  input?: Maybe<UpdateTemplateInput>;
};


export type MutationCreateTemplateRequestArgs = {
  input?: Maybe<CreateTemplateRequestInput>;
};


export type MutationUpdateTemplateRequestArgs = {
  input?: Maybe<UpdateTemplateRequestInput>;
};

export type CreateConsultantProfileInput = {
  picture_url: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  user: CreateConsultantProfileBelongsTo;
};

export type CreateConsultantProfileBelongsTo = {
  connect: Scalars['ID'];
};

export type UpdateConsultantProfileInput = {
  picture_url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
};

export type CreateLearnerProfileInput = {
  picture_url: Scalars['String'];
  role?: Maybe<Scalars['String']>;
  tenure?: Maybe<Scalars['String']>;
  user: CreateLearnerProfileBelongsTo;
};

export type CreateLearnerProfileBelongsTo = {
  connect: Scalars['ID'];
};

export type UpdateLearnerProfileInput = {
  picture_url?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  tenure?: Maybe<Scalars['String']>;
};

export type CreateModuleInput = {
  owner: CreateModuleBelongsToUser;
  title: Scalars['String'];
  description: Scalars['String'];
  is_public: Scalars['Boolean'];
  content?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['String']>;
  reminders?: Maybe<CreateModuleHasManyReminders>;
  triggers?: Maybe<CreateModuleHasManyTriggers>;
};

export type CreateModuleBelongsToUser = {
  connect: Scalars['ID'];
};

export type CreateModuleHasManyReminders = {
  create?: Maybe<Array<CreateModuleReminderInput>>;
};

export type CreateModuleReminderInput = {
  module?: Maybe<CreateModuleReminderBelongsToModule>;
  type: Scalars['String'];
  subject: Scalars['String'];
  message: Scalars['String'];
  frequency: Scalars['Int'];
  max_reminders: Scalars['Int'];
};

export type CreateModuleReminderBelongsToModule = {
  connect: Scalars['ID'];
};

export type CreateModuleHasManyTriggers = {
  create?: Maybe<Array<CreateModuleTriggerInput>>;
};

export type CreateModuleTriggerInput = {
  module?: Maybe<CreateModuleTriggerBelongsToModule>;
  start_timestamp?: Maybe<Scalars['DateTime']>;
  start_timestamp_field?: Maybe<Scalars['String']>;
  frequency: Scalars['Int'];
  max_sends: Scalars['Int'];
};

export type CreateModuleTriggerBelongsToModule = {
  connect: Scalars['ID'];
};

export type UpdateModuleInput = {
  title?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  is_public: Scalars['Boolean'];
  content?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['String']>;
  reminders?: Maybe<UpdateModuleHasManyReminders>;
  triggers?: Maybe<UpdateModuleHasManyTriggers>;
};

export type UpdateModuleHasManyReminders = {
  update?: Maybe<Array<UpdateModuleReminderInput>>;
};

export type UpdateModuleReminderInput = {
  id: Scalars['ID'];
  module?: Maybe<UpdateModuleReminderBelongsToModule>;
  type: Scalars['String'];
  subject: Scalars['String'];
  message: Scalars['String'];
  frequency: Scalars['Int'];
  max_reminders: Scalars['Int'];
};

export type UpdateModuleReminderBelongsToModule = {
  connect: Scalars['ID'];
};

export type UpdateModuleHasManyTriggers = {
  update?: Maybe<Array<UpdateModuleTriggerInput>>;
};

export type UpdateModuleTriggerInput = {
  id: Scalars['ID'];
  module?: Maybe<UpdateModuleTriggerBelongsToModule>;
  type: Scalars['String'];
  subject: Scalars['String'];
  message: Scalars['String'];
  frequency: Scalars['Int'];
  max_reminders: Scalars['Int'];
};

export type UpdateModuleTriggerBelongsToModule = {
  connect: Scalars['ID'];
};

export type CreateTemplateInput = {
  owner: CreateUserBelongsTo;
  title: Scalars['String'];
  can_request: Scalars['Boolean'];
  is_public: Scalars['Boolean'];
  dynamic_fields?: Maybe<Scalars['String']>;
  modules?: Maybe<CreateModulesBelongsToMany>;
};

export type CreateUserBelongsTo = {
  connect: Scalars['ID'];
};

export type CreateModulesBelongsToMany = {
  connect?: Maybe<Array<ConnectTemplateModule>>;
};

export type ConnectTemplateModule = {
  id: Scalars['ID'];
  folder?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
};

export type UpdateTemplateInput = {
  title?: Maybe<Scalars['String']>;
  can_request?: Maybe<Scalars['Boolean']>;
  is_public?: Maybe<Scalars['Boolean']>;
  dynamic_fields?: Maybe<Scalars['String']>;
  modules?: Maybe<UpdateModulesBelongsToMany>;
};

export type UpdateModulesBelongsToMany = {
  sync?: Maybe<Array<ConnectTemplateModule>>;
};

export type CreateTemplateRequestInput = {
  template: CreateTemplateBelongsTo;
  learner?: Maybe<CreateLearnerProfileBelongsTo>;
  email?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
};

export type CreateTemplateBelongsTo = {
  connect: Scalars['ID'];
};

export type UpdateTemplateRequestInput = {
  email?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
};


export type ProgramLearner = {
   __typename?: 'ProgramLearner';
  id: Scalars['ID'];
  program: Program;
  learner: LearnerProfile;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at: Scalars['DateTime'];
};

export type PaginatorInfo = {
   __typename?: 'PaginatorInfo';
  count: Scalars['Int'];
  currentPage: Scalars['Int'];
  firstItem?: Maybe<Scalars['Int']>;
  hasMorePages: Scalars['Boolean'];
  lastItem?: Maybe<Scalars['Int']>;
  lastPage: Scalars['Int'];
  perPage: Scalars['Int'];
  total: Scalars['Int'];
};

export type PageInfo = {
   __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  currentPage?: Maybe<Scalars['Int']>;
  lastPage?: Maybe<Scalars['Int']>;
};

export enum Trashed {
  Only = 'ONLY',
  With = 'WITH',
  Without = 'WITHOUT'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OrderByClause = {
  field: Scalars['String'];
  order: SortOrder;
};

export type MyQueryQueryVariables = {
  id: Scalars['ID'];
};


export type MyQueryQuery = (
  { __typename?: 'Query' }
  & { getTemplate: (
    { __typename?: 'Template' }
    & Pick<Template, 'id' | 'title' | 'dynamic_fields' | 'created_at'>
    & { modules?: Maybe<Array<Maybe<(
      { __typename?: 'Module' }
      & Pick<Module, 'id' | 'title' | 'description' | 'content' | 'conditions'>
      & { reminders?: Maybe<Array<Maybe<(
        { __typename?: 'ModuleReminder' }
        & Pick<ModuleReminder, 'id' | 'type' | 'subject' | 'message' | 'frequency' | 'max_reminders'>
      )>>>, triggers?: Maybe<Array<Maybe<(
        { __typename?: 'ModuleTrigger' }
        & Pick<ModuleTrigger, 'id' | 'start_timestamp' | 'start_timestamp_field' | 'frequency' | 'max_sends'>
      )>>> }
    )>>> }
  ) }
);


export const MyQueryDocument = gql`
    query MyQuery($id: ID!) {
  getTemplate(id: $id) {
    id
    title
    dynamic_fields
    created_at
    modules {
      id
      title
      description
      content
      conditions
      reminders {
        id
        type
        subject
        message
        frequency
        max_reminders
      }
      triggers {
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
export type MyQueryComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<MyQueryQuery, MyQueryQueryVariables>, 'query'> & ({ variables: MyQueryQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const MyQueryComponent = (props: MyQueryComponentProps) => (
      <ApolloReactComponents.Query<MyQueryQuery, MyQueryQueryVariables> query={MyQueryDocument} {...props} />
    );
    
export type MyQueryProps<TChildProps = {}> = ApolloReactHoc.DataProps<MyQueryQuery, MyQueryQueryVariables> & TChildProps;
export function withMyQuery<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  MyQueryQuery,
  MyQueryQueryVariables,
  MyQueryProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, MyQueryQuery, MyQueryQueryVariables, MyQueryProps<TChildProps>>(MyQueryDocument, {
      alias: 'myQuery',
      ...operationOptions
    });
};

/**
 * __useMyQueryQuery__
 *
 * To run a query within a React component, call `useMyQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMyQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyQueryQuery, MyQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<MyQueryQuery, MyQueryQueryVariables>(MyQueryDocument, baseOptions);
      }
export function useMyQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyQueryQuery, MyQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MyQueryQuery, MyQueryQueryVariables>(MyQueryDocument, baseOptions);
        }
export type MyQueryQueryHookResult = ReturnType<typeof useMyQueryQuery>;
export type MyQueryLazyQueryHookResult = ReturnType<typeof useMyQueryLazyQuery>;
export type MyQueryQueryResult = ApolloReactCommon.QueryResult<MyQueryQuery, MyQueryQueryVariables>;

      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": []
  }
};
      export default result;
    