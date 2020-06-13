import * as React from "react";
import * as Datetime from "react-datetime";
import {Moment} from "moment";

export default class DTPicker extends React.Component<any, any> {
  render() {
    const { schema } = this.props;
    const {dateFormat, timeFormat} = schema;

    return <Datetime
      {...this.props}
      onChange={(d: Moment) => {
        this.props.onChange(d.format("YYYY-MM-DD HH:mm:ss"))
      }}
      utc={true}
      dateFormat={dateFormat? "YYYY-MM-DD" : false}
      timeFormat={timeFormat? "HH:mm:ss" : false}
      timeConstraints={{
        minutes: {
          min: 0,
          max: 59,
          step: 15
        }
      }}
    />;
  }
}

