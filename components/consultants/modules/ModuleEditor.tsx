import React from 'react';
import ElentaFormBuilder from "../ElentaFormBuilder/ElentaFormBuilder";
import ModuleSettingsEditor from "./ModuleSettingsEditor";
import {Row, Form, Tab, Nav, Button} from 'react-bootstrap';


const ModuleEditor = ({
                        activeModule,
                        updateModuleList,
                        sendModule,
                        onSave,
                        formContent,
                        setFormContent,
                        formReminder,
                        formTrigger,
                        setFormReminder,
                        setFormTrigger,
                        recipientLists,
                        recipientList,
                        setRecipientList,
                        tagList
                      }) => {
  return (
    <>
      <Row className="pb-1 mr-0" style={{justifyContent: "flex-end"}}>
        {sendModule &&
        <Button variant="outline-primary" onClick={() => sendModule(activeModule)}>Send Module</Button>
        }
        <Button className="ml-1" onClick={onSave}>Save Module</Button>
      </Row>
      <Tab.Container defaultActiveKey="content" id="module-editor" transition={false}>
        <Nav variant="tabs" fill className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="content">Content</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="settings">Settings</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="content" title="Content">
            <div className="ml-3">
              <Form.Group>
                <h5>Title</h5>
                <Form.Control
                  value={activeModule ? activeModule.title || "" : ""}
                  placeholder='Post-Workshop Survey'
                  onChange={e => updateModuleList({title: e.target.value})}
                />
              </Form.Group>
              <Form.Group>
                <h5>Description</h5>
                <Form.Control
                  as='textarea'
                  value={activeModule ? activeModule.description || "" : ""}
                  placeholder='Your feedback helps us improve...'
                  onChange={e => updateModuleList({description: (e.target as HTMLInputElement).value})}
                />
              </Form.Group>
            </div>
            <Form.Group>
              <h5>Content</h5>
              <ElentaFormBuilder
                schema={formContent.schema}
                uiSchema={formContent.uiSchema}
                tagList={tagList}
                onSave={(schema, uiSchema) => {
                  setFormContent({
                    schema: schema,
                    uiSchema: uiSchema
                  });
                }}
              />
            </Form.Group>
          </Tab.Pane>
          <Tab.Pane eventKey="settings" title="Settings">
            <ModuleSettingsEditor
              reminder={formReminder}
              trigger={formTrigger}
              setFormReminder={setFormReminder}
              setFormTrigger={setFormTrigger}
              recipientLists={recipientLists}
              recipientList={recipientList}
              setRecipientList={setRecipientList}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

// @ts-ignore
export default ModuleEditor;
