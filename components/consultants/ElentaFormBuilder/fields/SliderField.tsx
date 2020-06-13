import * as React from "react";
import Slider from "react-rangeslider";
import 'react-rangeslider/lib/index.css';

export default class SliderField extends React.Component<any, any> {
  render() {
    const { schema } = this.props;
    const {min, max, step} = schema;
    const horizontalLabels = {
        0: `${min}`
    }
    horizontalLabels[max] = `${max}`;
    let handleLabel: string = "";
    if(this.props.value != undefined)
        handleLabel= `Value: ${this.props.value}`
    horizontalLabels[max/2] = handleLabel;
    return (
        <div className="slider-labels">
            <Slider {...this.props} labels={horizontalLabels}
                    min={min} max={max} step={step}/>
        </div>
    );
  }
}
