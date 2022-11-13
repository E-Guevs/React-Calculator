import React, { Component } from "react";
import formatExpression from "../style functions/formatExpression";

export default class DisplayContainer extends Component {
  render() {
    return (
      <div id="display-container">
        <div id="calculation">
          {this.props.previous === ""
            ? ""
            : formatExpression(this.props.previous)}
        </div>
        <div id="display">{formatExpression(this.props.current)}</div>
      </div>
    );
  }
}
