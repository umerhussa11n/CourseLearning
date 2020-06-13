import * as React from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder } from "../../../../utils/utils"
import './css/fields.css';


export class RankField extends  React.Component<any,any>{

    constructor(props) {
      super(props);
      let {formData, schema} = props;

      if(formData === undefined || formData.length == 0 ){
        formData = [...schema.items.enum];
      }
      this.state = { formData, schema};
    }

    componentDidMount(){
      this.props.onChange([...this.state.formData]);
    }

    handleDrop = (result) => {
      if (!result.destination) {
        return;
      }
      let { formData } = this.state;
      formData = reorder(formData, result.source.index, result.destination.index);
      this.setState({ formData },
        ()=> this.props.onChange([...formData]));
    }

    render(){
        const {formData, schema} = this.state;
        return (
        <div>
          <div className="form-group">            
              <DragDropContext onDragEnd={this.handleDrop}>
                <Droppable droppableId="droppable">
                  {(droppableProvided) => (
                    <div
                      ref={droppableProvided.innerRef}
                      className="rank-item">
                      {formData.map((item, index) => (
                          <Draggable key={index} draggableId={`${item}_${index}`} index={index}>
                            {(draggableProvided, draggableSnapshot) => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                              >
                                <i className="fas fa-arrows-alt-v"></i>
                                <span>{` ${item}`}</span>
                              </div>
                              )}
                          </Draggable>
                          ))
                        }
                          {droppableProvided.placeholder}
                      </div>
                    )}
                </Droppable>
              </DragDropContext>
          </div>
        </div>
        );
    }
}