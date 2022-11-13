export default function addEffects(className) {
  const elements = document.getElementsByClassName(className);

  for (let element of elements) {
    // CONSTANTS
    const key = element.getAttribute("keyboard"),
      buttonType = element.getAttribute("class"),
      // DEFAULT COLORS
      colorOperandDefault = "linear-gradient(to bottom left, #37474F, #263238)",
      colorOperatorDefault =
        "linear-gradient(to bottom left, #00796B, #004D40)",
      colorEraseDefault = "linear-gradient(to bottom left, #5A509E, #39247D)",
      colorEqualsDefault = "linear-gradient(to bottom left, #386F93, #194865)",
      // HOVER COLORS
      colorOperandHover = "radial-gradient(#546E7A, #263238)",
      colorOperatorHover = "radial-gradient(#009688, #004D40)",
      colorEraseHover = "radial-gradient(#6F69A4, #39247D)",
      colorEqualsHover = "radial-gradient(#5888AD, #194865)",
      // ACTIVE COLORS
      colorOperandActive = "#546E7A",
      colorOperatorActive = "#009688",
      colorEraseActive = "#6F69A4",
      colorEqualsActive = "#5888AD";

    // FUNCTION TO SET DEFAULT BUTTON COLORS
    function setDefaultColor() {
      element.style.background = buttonType.includes("operand")
        ? colorOperandDefault
        : buttonType.includes("operator")
        ? colorOperatorDefault
        : buttonType.includes("erase")
        ? colorEraseDefault
        : colorEqualsDefault;
    }

    // FUNCTION TO HANDLE POINTER PRESS
    function handlePointerPress() {
      element.style.background = "ghostwhite";
      element.style.transform = "scale(0.95)";
      element.style.color = buttonType.includes("operand")
        ? colorOperandActive
        : buttonType.includes("operator")
        ? colorOperatorActive
        : buttonType.includes("erase")
        ? colorEraseActive
        : colorEqualsActive;
    }

    // FUNCTION TO HANDLE POINTER RELEASE
    function handlePointerRelease() {
      element.style.color = "inherit";
      element.style.transform = "scale(1)";
      setDefaultColor();
    }

    // FUNCTION TO HANDLE KEY PRESS
    function handleKeyPress(event) {
      element.blur(); // REMOVES MOUSE FOCUS FROM THE ELEMENT
      if (event.key === "Tab") event.preventDefault(); // PREVENTS THE TAB KEY'S DEFAULT ACTION
      setDefaultColor(event);

      if (event.key === key) {
        event.preventDefault(); // PREVENTS THE EVENT KEY'S DEFAULT ACTION

        element.style.background = "ghostwhite";
        element.style.transform = "scale(0.95)";
        element.style.color = buttonType.includes("operand")
          ? colorOperandActive
          : buttonType.includes("operator")
          ? colorOperatorActive
          : buttonType.includes("erase")
          ? colorEraseActive
          : colorEqualsActive;
      }
    }

    // FUNCTION TO HANDLE KEY RELEASE
    function handleKeyRelease(event) {
      if (event.key === key) {
        element.style.color = "inherit";
        element.style.transform = "scale(1)";
        setDefaultColor(event);
      }
    }

    // FUNCTION TO HANDLE HOVER
    function handleHover() {
      element.style.background = buttonType.includes("operand")
        ? colorOperandHover
        : buttonType.includes("operator")
        ? colorOperatorHover
        : buttonType.includes("erase")
        ? colorEraseHover
        : colorEqualsHover;
    }

    // FUNCTION TO HANDLE UNHOVER
    function handleUnhover(event) {
      setDefaultColor(event);
    }

    // HOVER EVENT LISTENER
    element.addEventListener("mousemove", handleHover);

    // UNHOVER EVENT LISTENER
    element.addEventListener("mouseout", handleUnhover);

    // POINTER PRESS EVENT LISTENER
    element.addEventListener("pointerdown", () => {
      handlePointerPress();
      element.removeEventListener("mousemove", handleHover);
      element.removeEventListener("mouseout", handleUnhover);
    });

    // POINTER RELEASE EVENT LISTENER
    document.addEventListener("pointerup", () => {
      handlePointerRelease();
      element.addEventListener("mousemove", handleHover);
      element.addEventListener("mouseout", handleUnhover);
    });

    // KEY PRESS EVENT LISTENER
    document.addEventListener("keydown", (event) => {
      handleKeyPress(event);
      element.removeEventListener("mousemove", handleHover);
      element.removeEventListener("mouseout", handleUnhover);
    });

    // KEY RELEASE EVENT LISTENER
    document.addEventListener("keyup", (event) => {
      handleKeyRelease(event);
      element.addEventListener("mousemove", handleHover);
      element.addEventListener("mouseout", handleUnhover);
    });
  }
}
