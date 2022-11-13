import React, { Component } from "react";

export default class Buttons extends Component {
  render() {
    return (
      <div id="buttons-container">
        <button
          className="button erase"
          id="clear"
          value="AC"
          keyboard="Escape"
          onPointerUp={this.props.clear}>
          AC
        </button>
        <button
          className="button erase"
          id="delete"
          value="⌫"
          keyboard="Backspace"
          onPointerUp={this.props.delete}>
          ⌫
        </button>
        <button
          className="button operator"
          id="exponent"
          value="^"
          keyboard="ArrowUp"
          onPointerUp={this.props.operate}>
          x⁽ⁿ⁾
        </button>
        <button
          className="button operator"
          id="divide"
          value="/"
          keyboard="/"
          onPointerUp={this.props.operate}>
          ÷
        </button>
        <button
          className="button operand"
          id="seven"
          value="7"
          keyboard="7"
          onPointerUp={this.props.append}>
          7
        </button>
        <button
          className="button operand"
          id="eight"
          value="8"
          keyboard="8"
          onPointerUp={this.props.append}>
          8
        </button>
        <button
          className="button operand"
          id="nine"
          value="9"
          keyboard="9"
          onPointerUp={this.props.append}>
          9
        </button>
        <button
          className="button operator"
          id="multiply"
          value="×"
          keyboard="*"
          onPointerUp={this.props.operate}>
          ×
        </button>
        <button
          className="button operand"
          id="four"
          value="4"
          keyboard="4"
          onPointerUp={this.props.append}>
          4
        </button>
        <button
          className="button operand"
          id="five"
          value="5"
          keyboard="5"
          onPointerUp={this.props.append}>
          5
        </button>
        <button
          className="button operand"
          id="six"
          value="6"
          keyboard="6"
          onPointerUp={this.props.append}>
          6
        </button>
        <button
          className="button operator"
          id="subtract"
          value="−"
          keyboard="-"
          onPointerUp={this.props.operate}>
          −
        </button>
        <button
          className="button operand"
          id="one"
          value="1"
          keyboard="1"
          onPointerUp={this.props.append}>
          1
        </button>
        <button
          className="button operand"
          id="two"
          value="2"
          keyboard="2"
          onPointerUp={this.props.append}>
          2
        </button>
        <button
          className="button operand"
          id="three"
          value="3"
          keyboard="3"
          onPointerUp={this.props.append}>
          3
        </button>
        <button
          className="button operator"
          id="add"
          value="+"
          keyboard="+"
          onPointerUp={this.props.operate}>
          +
        </button>
        <button
          className="button operand"
          id="zero"
          value="0"
          keyboard="0"
          onPointerUp={this.props.append}>
          0
        </button>
        <button
          className="button operand"
          id="decimal"
          value="."
          keyboard="."
          onPointerUp={this.props.append}>
          .
        </button>
        <button
          className="button"
          id="equals"
          value="="
          keyboard="Enter"
          onPointerUp={this.props.evaluate}>
          =
        </button>
      </div>
    );
  }
}
