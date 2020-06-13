import * as React from 'react';
import ReactPlayer from 'react-player';

//Widget
export class VideoWidget extends  React.Component<any,any>{

  constructor(props) {
      super(props);                        
      this.state = {schema: props.schema};
  }

  render(){
      const { schema } = this.state;     
      return <ReactPlayer className="mediaMax" url={schema.videoURL} playing />
  }
}

