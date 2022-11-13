export default function formatExpression(expression) {
  const regex =
    /Can't Divide by Zero|Infinity|Math ERROR|-|\d+\.?\d*|[)]|\s?[−+×/^]\s?[(]?−?|[×]10\^|\s[=]\s/g;
  // REGEX FOR NUMBERS, OPERATORS, CLOSING PARENTHESES, INFINITY, AND THE EQUAL SIGN

  let formattedExpression = []; // AN ARRAY THAT WOULD CONTAIN THE FORMATTED TERMS OF THE EXPRESSION

  function formatNumber(num) {
    if (num == null) return;
    const numFormat = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }); // FORMATS THE INTEGER PART TO INTERNATIONAL FORMAT
    const [integer, decimal] = num.split("."); // SPLITS THE INTEGER AND DECIMAL PARTS WITH A DECIMAL POINT
    if (decimal == null) return numFormat.format(integer); // IF THERE IS NO DECIMAL, RETURNS A FORMATTED INTEGER
    return `${numFormat.format(integer)}.${decimal}`; // RETURNS THE FORMATTED NUMBER BY DEFAULT
  }

  for (let term of expression.match(
    regex
  ) /* SEPARATES THE EXPRESSION INTO NUMBERS, OPERATORS, AND THE CLOSING PARENTHESIS */) {
    formattedExpression.push(
      term.replace(term.match(/\d+\.?\d*/g), formatNumber(term))
    ); // FORMATS THE NUMBERS IN THE EXPRESSION
  }

  return formattedExpression.join(""); // RETURNS THE JOINED TERMS OF THE EXPRESSION
}
