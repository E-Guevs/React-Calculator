import React, { Component } from "react";

export default class Hotkeys extends Component {
  render() {
    return (
      <div id="hotkeys-container">
        <button className="hotkey">Esc</button>
        <button className="hotkey">
          <span>Back</span>
          <span>space</span>
        </button>
        <button className="hotkey">↑</button>
        <button className="hotkey">/</button>
        <button className="hotkey">7</button>
        <button className="hotkey">8</button>
        <button className="hotkey">9</button>
        <button className="hotkey">*</button>
        <button className="hotkey">4</button>
        <button className="hotkey">5</button>
        <button className="hotkey">6</button>
        <button className="hotkey">-</button>
        <button className="hotkey">1</button>
        <button className="hotkey">2</button>
        <button className="hotkey">3</button>
        <button className="hotkey">+</button>
        <button className="hotkey">0</button>
        <button className="hotkey">.</button>
        <button className="hotkey">Enter</button>
      </div>
    );
  }
}
