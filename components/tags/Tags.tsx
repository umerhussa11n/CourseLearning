// Fetch list of tags first
import * as React from "react";
import {useMutation, useQuery} from '@apollo/react-hooks';
import {GET_ALL_TAGS, GET_LEARNER_PROFILE, UPDATE_PROGRAM_MODULE_SEND} from "../../graphql/queries";
import {useEffect, useState} from "react";
import LoadingContainer from "../hoc/LoadingContainer/LoadingContainer";
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {Form} from "react-bootstrap";

// TODO: Change to use react-select
export const Tags = (props) => {
  const {loading: queryLoading, error: queryError, data: queryData} = useQuery(GET_ALL_TAGS);
  const [tagOptions, setTagOptions] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  if (!queryLoading && isFirstLoad) {
    setIsFirstLoad(false);
    setTagOptions(queryData.tags.map((tag) => {
      return {
        id: tag.id,
        label: tag.label,
        __typename: "Tag"
      }
    }));
  }

  const handleOnChange = (data) => {
    props.onChange(data);
  };

  return (
    <div>
      <Form.Label>Add Tags</Form.Label>
      <Typeahead
        id="tagsForm"
        multiple={true}
        onChange={handleOnChange}
        selected={props.formData}
        options={tagOptions}
        placeholder="e.g. Sales Training"
      />
      <Form.Text>
        Tag your {props.schema.taggable} to help you find and manage your content.
      </Form.Text>
    </div>
  )
};


export const tagUiSchema = {
  tags: {
    "ui:field": "tags"
  }
};


export const mutateTagData = (tagsState) => {
  const tags = tagsState === undefined ? [] : {sync: tagsState.map((tag) => {
      return {
        id: tag.id
      }
    })};
  return tags;
};

export default Tags;
