import * as React from 'react';

//Widget
export class ImageWidget extends  React.Component<any,any>{

  constructor(props) {
      super(props);                        
      this.state = {schema: props.schema};
  }

  render(){
      const { schema } = this.state;     
      return(
          <div>
            <img className="mediaMax" src= {schema.imageURL} alt="Image"/>
          </div>            
      );
  }
}

