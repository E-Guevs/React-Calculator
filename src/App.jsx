import React, { Component } from "react";
import Buttons from "./components/Buttons";
import DisplayContainer from "./components/DisplayContainer";
import Hotkeys from "./components/Hotkeys";
import HotkeysTitle from "./components/HotkeysTitle";
import addEffects from "./style functions/addEffects";

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOperand: "0",
      previousOperand: "",
      evaluated: false,
      hotkeysDisplay: { display: "none" },
      hotkeysToggleInnerText: "SHOW KEYBOARD HOTKEYS",
      hotkeysShown: false,
    };
    this.append = this.append.bind(this);
    this.appendOnClick = this.appendOnClick.bind(this);
    this.operate = this.operate.bind(this);
    this.operateOnClick = this.operateOnClick.bind(this);
    this.delete = this.delete.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.clear = this.clear.bind(this);
    this.addKeyboardSupport = this.addKeyboardSupport.bind(this);
    this.toggleHotkeys = this.toggleHotkeys.bind(this);
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: EVENT LISTENERS UPON COMPONENT MOUNTING~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  componentDidMount() {
    let initialTouchY;
    document.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
        initialTouchY = event.changedTouches[0].clientY;
      },
      { passive: false }
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        let updatedTouchY = event.changedTouches[0].clientY;
        let scrollDistance = initialTouchY - updatedTouchY;
        window.scrollBy(0, scrollDistance);
        initialTouchY = updatedTouchY;
      },
      { passive: false }
    );

    document.addEventListener("keydown", this.addKeyboardSupport);
    document.addEventListener("load", addEffects("button"));
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: EVENT LISTENERS UPON COMPONENT MOUNTING~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: ADD KEYBOARD SUPPORT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  addKeyboardSupport(event) {
    if (/^\d$|^[.]$/.test(event.key)) this.append(event.key);
    if (/^[-+*/]$|^ArrowUp$/.test(event.key)) {
      this.operate(
        document
          .querySelector(`button[keyboard="${event.key}"]`)
          .getAttribute("value")
      );
    }
    if (/^Backspace$/.test(event.key)) this.delete();
    if (/^Enter$/.test(event.key)) this.evaluate();
    if (/^Escape$/.test(event.key)) this.clear();
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: ADD KEYBOARD SUPPORT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: APPEND~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  append(targetValue) {
    if (
      /\s[−+×/^]\s[(]?−?0$/.test(this.state.currentOperand) && // IF DISPLAY ENDS WITH AN OPERATOR (NEGATIVE INCLUDED) FOLLOWED BY A ZERO
      targetValue === "0" // && IF TARGET VALUE IS ZERO
    )
      return this.state; // PREVENTS MULTIPLE ZEROS AT THE BEGINNING OF NUMBERS

    if (
      /[)]$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH A CLOSING PARENTHESIS
    )
      return this.state; // PREVENTS NUMBERS OR A DECIMAL POINT AFTER A CLOSING PARENTHESIS

    if (
      this.state.evaluated === false && // IF EVALUATED STATUS IS FALSE
      /\d+\.\d*$/.test(this.state.currentOperand) && // IF THE CURRENT NUMBER IN THE DISPLAY INCLUDES A DECIMAL POINT
      targetValue === "." // && IF TARGET VALUE IS THE DECMIAL POINT
    )
      return this.state; // PREVENTS MULTIPLE DECIMAL POINTS IN NUMBERS

    if (
      this.state.evaluated === false && // IF EVALUATED STATUS IS FALSE
      /\d{15,}$/.test(this.state.currentOperand.match(/[^,.]/g).join("")) // && IF THE CURRENT NUMBER ALREADY HAS 15 DIGITS
    )
      return this.state; // PREVENTS EXCEEDING THE DIGIT INPUT LIMIT

    if (
      this.state.hotkeysShown === true // IF THE HOTKEYS ARE SHOWN
    )
      return this.state; // PREVENTS CALCULATOR ACTIVITY

    this.setState({
      currentOperand:
        this.state.evaluated === true // IF EVALUATED STATUS IS TRUE
          ? targetValue === "." // IF TARGET VALUE IS A DECIMAL POINT
            ? "0." // REINITIALIZES DISPLAY WITH A ZERO FOLLOWED BY A DECIMAL POINT
            : targetValue // REINITIALIZES DISPLAY WITH A NEW INPUT
          : /^[−+×/0^]$/.test(this.state.currentOperand) && // IF DISPLAY IS AN OPERATOR (NEGATIVE EXCLUDED) OR A ZERO
            targetValue !== "." // && IF TARGET VALUE ISN'T THE DECIMAL POINT
          ? targetValue // INITIALIZES DISPLAY WITH AN INPUT
          : this.state.currentOperand.match(/\d*\.?\d*$/).join("") === "0" && // IF THE CURRENT NUMBER IN THE DISPLAY IS ZERO
            targetValue !== "." // && IF TARGET VALUE ISN'T THE DECIMAL POINT
          ? `${this.state.currentOperand.replace(/0$/, targetValue)}`
          : // PREVENTS CURRENT NUMBER (NON-ZERO) IN THE DISPLAY FROM BEGINNING WITH ZERO

          targetValue === "." // IF TARGET VALUE IS THE DECIMAL POINT
          ? /\s?[−+×/^]\s?[(]?−?$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH AN OPERATOR (NEGATIVE INCLUDED)
            ? /^\d|^-/.test(this.state.currentOperand) // IF DISPLAY BEGINS WITH A NUMBER (NEGATIVE INCLUDED)
              ? `${this.state.currentOperand}0.` // APPENDS A ZERO FOLLOWED BY A DECIMAL POINT TO THE DISPLAY
              : "0." // STARTS THE DISPLAY WITH A ZERO FOLLOWED BY A DECIMAL POINT
            : `${this.state.currentOperand}.` // APPENDS A DECIMAL POINT TO THE DISPLAY
          : `${this.state.currentOperand}${targetValue}`, // APPENDS INPUT TO THE DISPLAY BY DEFAULT
      // DOES NOTHING
      previousOperand:
        this.state.evaluated === true // IF EVALUATED STATUS IS TRUE
          ? "" // RESETS CALCULATION
          : this.state.previousOperand,
      evaluated: false,
    });
  }

  // METHOD TO APPEND USING POINTER
  appendOnClick(event) {
    this.append(event.target.getAttribute("value"));
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: APPEND~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: OPERATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  operate(targetValue) {
    if (
      /\s[−+×/^]\s[(]−$/.test(this.state.currentOperand) && // IF DISPLAY ENDS WITH AN APPENDED NEGATIVE
      targetValue === "−" // && IF TARGET VALUE IS THE MINUS OPERATOR
    )
      return this.state; // PREVENTS MORE THAN ONE APPENDED NEGATIVE SIGN IN THE DISPLAY

    if (
      /\s[−+×/^]\s[(]−$/.test(this.state.previousOperand) && // IF CALCULATION ENDS WITH AN APPENDED NEGATIVE
      this.state.currentOperand === "−" && // && IF DISPLAY IS A MINUS OPERATOR
      targetValue === "−" // && IF TARGET VALUE IS THE MINUS OPERATOR
    )
      return this.state; // PREVENTS MORE THAN ONE APPENDED NEGATIVE SIGN IN THE CALCULATION

    if (
      this.state.currentOperand === "Can't Divide by Zero" || // IF MESSAGE DISPLAYS "Can't Divide by Zero"
      this.state.currentOperand === "Infinity" || // IF MESSAGE DISPLAYS "Infinity"
      this.state.currentOperand === "Math ERROR" // IF MESSAGE DISPLAYS "Math ERROR"
    )
      return this.state; // PREVENTS OPERATING DISPLAY MESSAGES

    if (
      this.state.hotkeysShown === true // IF THE HOTKEYS ARE SHOWN
    )
      return this.state; // PREVENTS CALCULATOR ACTIVITY

    this.setState({
      currentOperand: targetValue, // DISPLAYS THE TARGET OPERATOR
      previousOperand:
        this.state.evaluated === true // IF EVALUATED STATUS IS TRUE
          ? `${this.state.currentOperand} ${targetValue} `
          : // INITIALIZES CALCULATION WITH PREVIOUS ANSWER FOLLOWED BY TARGET OPERATOR

          /^[−+×/^]/.test(this.state.currentOperand) // IF DISPLAY BEGINS WITH AN OPERATOR
          ? targetValue === "−" // IF TARGET VALUE IS THE MINUS OPERATOR
            ? `${this.state.previousOperand}(−` // APPENDS NEGATIVE SIGN TO THE CALCULATION
            : this.state.previousOperand.replace(
                /\s[−+×/^]\s[(]?−?$/,
                ` ${targetValue} `
              )
          : // SWITCHES BETWEEN OPERATORS (NEGATIVE INCLUDED)

          /[(]−$/.test(this.state.previousOperand) // IF CALCULATION ENDS WITH AN APPENDED NEGATIVE
          ? `${this.state.previousOperand}${this.state.currentOperand}) ${targetValue} `
          : // UPDATES CALCULATION AND THEN APPENDS CLOSING PARENTHESIS AND TARGET OPERATOR

          /\s[−+×/^]\s[(]?−?$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH AN OPERATOR (NEGATIVE INCLUDED)
          ? targetValue === "−" // IF TARGET VALUE IS THE MINUS OPERATOR
            ? `${this.state.previousOperand}${this.state.currentOperand}(−` // UPDATES CALCULATION AND THEN APPENDS NEGATIVE SIGN
            : `${this.state.previousOperand}${this.state.currentOperand.replace(
                /\s[−+×/^]\s[(]?−?$/,
                ` ${targetValue} `
              )}`
          : // UPDATES CALCULATION AND THEN SWITCHES BETWEEN OPERATORS (NEGATIVE INCLUDED)

          /[(]−\d+\.?\d*$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH A NEGATIVE NUMBER
          ? /\.$/.test(this.state.currentOperand) // IF NEGATIVE NUMBER ENDS WITH A DECIMAL POINT
            ? `${this.state.previousOperand}${this.state.currentOperand.slice(
                0,
                -1
              )}) ${targetValue} `
            : // REPLACES DECIMAL POINT WITH A CLOSING PARENTHESIS, UPDATES THE CALCULATION, AND THEN APPENDS TARGET OPERATOR

              `${this.state.previousOperand}${this.state.currentOperand}) ${targetValue} `
          : // APPENDS CLOSING PARENTHESIS TO THE DISPLAY, UPDATES THE CALCULATION AND THEN APPENDS TARGET OPERATOR
          /\.$/.test(this.state.currentOperand) // IF NUMBER ENDS WITH DECIMAL POINT
          ? `${this.state.previousOperand}${this.state.currentOperand.slice(
              0,
              -1
            )} ${targetValue} `
          : // IGNORES DECIMAL POINT, UPDATES THE CALCULATION, AND THEN APPENDS TARGET OPERATOR

            `${this.state.previousOperand}${this.state.currentOperand} ${targetValue} `,
          // UPDATES CALCULATION AND THEN APPENDS TARGET OPERATOR BY DEFAULT
      evaluated: false,
    });
  }

  // METHOD TO OPERATE USING POINTER
  operateOnClick(event) {
    this.operate(event.target.getAttribute("value"));
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: OPERATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: DELETE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  delete() {
    if (
      this.state.hotkeysShown === true // IF THE HOTKEYS ARE SHOWN
    )
      return this.state; // PREVENTS CALCULATOR ACTIVITY

    this.setState({
      currentOperand:
        this.state.evaluated === true // IF EVALUATED STATUS IS TRUE
          ? this.state.previousOperand.slice(0, -3) // TRANSFERS CALCULATION BACK TO THE DISPLAY WITHOUT THE EQUAL SIGN
          : this.state.currentOperand.length > 1 // IF DISPLAY LENGTH IS GREATER THAN ONE
          ? /^[(]−$/.test(this.state.currentOperand) // IF DISPLAY IS A NEGATIVE SIGN
            ? "0"
            : /[(]−$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH A NEGATIVE SIGN
            ? this.state.currentOperand.slice(0, -2) // DELETES APPENDED NEGATIVE SIGN
            : /\s[−+×/^]\s$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH AN OPERATOR (NEGATIVE EXCLUDED)
            ? this.state.currentOperand.slice(0, -3) // DELETES OPERATOR
            : this.state.currentOperand.slice(0, -1) // DELETES DIGITS AND DECIMALS BY DEFAULT
          : this.state.previousOperand !== "" // IF CALCULATION ISN'T EMPTY
          ? this.state.previousOperand // TRANSFERS CALCULATION BACK TO THE DISPLAY
          : "0", // RESETS DISPLAY AFTER DELETING EVERYTHING
      previousOperand:
        this.state.evaluated === true // IF EVALUATED STATUS IS TRUE
          ? ""
          : this.state.currentOperand.length > 1 // IF DISPLAY LENGTH IS GREATER THAN ONE
          ? this.state.previousOperand // DOES NOTHING
          : "", // RESETS CALCULATION AFTER DELETING EVERYTHING FROM THE DISPLAY
      evaluated: false,
    });
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: DELETE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: EVALUATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  evaluate() {
    if (
      this.state.currentOperand === "0" && // IF DISPLAY IS ZERO
      this.state.previousOperand === "" // IF CALCULATION IS EMPTY
    )
      return this.state; // PREVENTS EVALUATION DURING INITIAL CALCULATOR STATUS

    if (
      this.state.evaluated === true // IF EVALUATED STATUS IS TRUE
    )
      return this.state; // PREVENTS MULTIPLE CONSECUTIVE EVALUATIONS

    if (
      this.state.currentOperand === "Can't Divide by Zero" || // IF MESSAGE DISPLAYS "Can't Divide by Zero"
      this.state.currentOperand === "Infinity" || // IF MESSAGE DISPLAYS "Infinity"
      this.state.currentOperand === "Math ERROR" // IF MESSAGE DISPLAYS "Math ERROR"
    )
      return this.state; // PREVENTS EVALUATING DISPLAY MESSAGES

    if (
      this.state.hotkeysShown === true // IF THE HOTKEYS ARE SHOWN
    )
      return this.state; // PREVENTS CALCULATOR ACTIVITY

    let expression = /^[−+×/^]$/.test(this.state.currentOperand) // IF DISPLAY IS AN OPERATOR
      ? `${this.state.previousOperand.replace(/\s[−+×/^]\s[(]?−?$/, "")}`
      : // IGNORES OPERATOR (NEGATIVE INCLUDED) AT THE END OF THE CALCULATION

      /\s[−+×/^]\s[(]?−?$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH AN OPERATOR (NEGATIVE INCLUDED)
      ? `${this.state.previousOperand}${this.state.currentOperand.replace(
          /\s[−+×/^]\s[(]?−?$/,
          ""
        )}`
      : // IGNORES OPERATOR (NEGATIVE INCLUDED) AT THE END OF THE DISPLAY

      /[(]−$/.test(this.state.previousOperand) || // IF CALCULATION ENDS WITH AN APPENDED NEGATIVE
        /[(]−\d+\.?\d*$/.test(this.state.currentOperand) // || IF DISPLAY ENDS WITH A NEGATIVE NUMBER
      ? `${this.state.previousOperand}${this.state.currentOperand})`
      : // REPLACES OPERATOR (NEGATIVE INCLUDED) AT THE END OF THE DISPLAY WITH A CLOSING PARENTHESIS

        `${this.state.previousOperand}${this.state.currentOperand}`; // COMPLETES THE CALCULATION BY DEFAULT

    expression = expression
      .replace(/^-/, "0 - ") // REPLACES THE NEGATIVE SIGN AT THE BEGINNING WITH A ZERO FOLLOWED BY A MINUS OPERATOR
      .replace(/−/g, "-") // REPLACES EACH MINUS SYMBOL WITH A JAVASCRIPT SUBTRACTION OPERATOR
      .replace(/×/g, "*") // REPLACES EACH MULTIPLICATION SYMBOL WITH A JAVASCRIPT MULTIPLICATION OPERATOR
      .replace(/\^/g, "**"); // REPLACES EACH CARET SYMBOL WITH A JAVASCRIPT EXPONENTIATION OPERATOR
    // CONVERTS CALCULATION TO A JAVASCRIPT EXPRESSION

    let answer =
      Math.round(eval(expression) * 100000000000000) / 100000000000000; // EVALUATES THE JAVASCRIPT EXPRESSION
    if (
      /^\d{16,}/.test(answer.toString()) // IF THE INTEGER PART OF THE ANSWER HAS 16 OR MORE DIGITS
    )
      answer = answer.toExponential(8); // EXPRESSES THE ANSWER IN EXPONENTIAL NOTATION

    answer = answer
      .toString() // CONVERTS ANSWER TO STRING
      .replace(/e/, "×10^"); // CONVERTS E-NOTATION TO SCIENTIFIC NOTATION

    this.setState({
      currentOperand: /\s[/]\s0\s|\s[/]\s0$/.test(expression) // IF THE EXPRESSION INCLUDES A DIVISION BY ZERO
        ? "Can't Divide by Zero" // DISPLAYS THE MESSAGE "Can't Divide by Zero"
        : answer === "NaN" // IF THE ANSWER RETURNS "NaN" (NOT A NUMBER)
        ? "Math ERROR" // DISPLAYS THE MESSAGE "Math ERROR"
        : answer, // DISPLAYS THE ANSWER BY DEFAULT
      previousOperand: /^[−+×/^]$/.test(this.state.currentOperand) // IF DISPLAY IS AN OPERATOR
        ? this.state.previousOperand.replace(/\s[−+×/^]\s[(]?−?$/, " = ")
        : // REPLACES OPERATOR (NEGATIVE INCLUDED) AT THE END OF THE CALCULATION WITH THE EQUAL SIGN

        /[(]−$/.test(this.state.previousOperand) // IF CALCULATION ENDS WITH AN APPENDED NEGATIVE
        ? `${this.state.previousOperand}${this.state.currentOperand}) = `
        : // APPENDS CLOSING PARENTHESIS AND THE EQUAL SIGN TO THE CALCULATION

        /\s[−+×/^]\s[(]?−?$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH AN OPERATOR (NEGATIVE INCLUDED)
        ? `${this.state.previousOperand}${this.state.currentOperand.replace(
            /\s[−+×/^]\s[(]?−?$/,
            " = "
          )}`
        : // UPDATES CALCULATION AND THEN REPLACES THE OPERATOR (NEGATIVE INCLUDED) AT THE END WITH THE EQUAL SIGN

        /[(]−\d+\.?\d*$/.test(this.state.currentOperand) // IF DISPLAY ENDS WITH A NEGATIVE NUMBER
        ? /\.$/.test(this.state.currentOperand) // IF NEGATIVE NUMBER ENDS WITH DECIMAL POINT
          ? `${this.state.previousOperand}${this.state.currentOperand.slice(
              0,
              -1
            )}) = `
          : // REPLACES DECIMAL POINT WITH A CLOSING PARENTHESIS, UPDATES THE CALCULATION, AND THEN APPENDS THE EQUAL SIGN

            `${this.state.previousOperand}${this.state.currentOperand}) = `
        : // APPENDS CLOSING PARENTHESIS TO THE DISPLAY, UPDATES THE CALCULATION AND THEN APPENDS THE EQUAL SIGN

        /\.$/.test(this.state.currentOperand) // IF NUMBER ENDS WITH DECIMAL POINT
        ? `${this.state.previousOperand}${this.state.currentOperand.slice(
            0,
            -1
          )} = `
        : // IGNORES DECIMAL POINT, UPDATES THE CALCULATION, AND THEN APPENDS THE EQUAL SIGN

          `${this.state.previousOperand}${this.state.currentOperand} = `,
        // UPDATES CALCULATION AND THEN APPENDS THE EQUAL SIGN BY DEFAULT
      evaluated: true, // CONFIRMS EVALUATED STATUS
    });
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: EVALUATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: CLEAR~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  clear() {
    if (
      this.state.hotkeysShown === true // IF THE HOTKEYS ARE SHOWN
    )
      return this.state; // PREVENTS CALCULATOR ACTIVITY

    this.setState({
      currentOperand: "0", // RESETS DISPLAY
      previousOperand: "", // RESETS CALCULATION
      evaluated: false, // RESETS EVALUATED STATUS
    });
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: CLEAR~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: TOGGLE HOTKEYS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  toggleHotkeys() {
    this.setState({
      hotkeysDisplay: !this.state.hotkeysShown
        ? { display: "block" }
        : { display: "none" },
      hotkeysToggleInnerText: !this.state.hotkeysShown
        ? "HIDE KEYBOARD HOTKEYS"
        : "SHOW KEYBOARD HOTKEYS",
      hotkeysShown: !this.state.hotkeysShown,
    });
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: TOGGLE HOTKEYS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~START: RENDER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

  render() {
    return (
      <div id="container">
        <div>
          <h1>SIMPLE REACT CALCULATOR</h1>
          <div className="keyboard-support">WITH KEYBOARD SUPPORT</div>
        </div>
        <div id="calculator">
          <DisplayContainer
            current={this.state.currentOperand}
            previous={this.state.previousOperand}
          />
          <Buttons
            append={this.appendOnClick}
            operate={this.operateOnClick}
            delete={this.delete}
            evaluate={this.evaluate}
            clear={this.clear}
          />
          <div id="calculator-hotkeys" style={this.state.hotkeysDisplay}>
            <HotkeysTitle />
            <Hotkeys />
          </div>
        </div>
        <div id="toggle-hotkey-display" onPointerUp={this.toggleHotkeys}>
          {this.state.hotkeysToggleInnerText}
        </div>
      </div>
    );
  }

  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~END: RENDER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
}
