import React from 'react';
import UserAction from './actions';
import CreateFolderModal from './CreateFolderModal';
import RenameFolderModal from './RenameFolderModal';

const ModalList = (props) => {
  const {
    userAction,
    userActionData,
    setUserAction,
  } = props;

  switch (userAction) {
    case UserAction.CREATE_FOLDER:
      return (
        <CreateFolderModal
          {...userActionData}
          onClose={() => {
            setUserAction(null);
          }}
        />
      );

    case UserAction.EDIT_FOLDER:
      return (
        <RenameFolderModal
          {...userActionData}
          onClose={() => {
            setUserAction(null);
          }}
        />
      );
  }

  return null;
};

export default ModalList;
