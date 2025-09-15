import moo from "moo";
import { ValidationResult } from "./types";

const lexer = moo.compile({
  number: { match: /[0-9]+(?:\.[0-9]+)?/ },
  arithmetic: ["+", "-", "*", "/"],
  comparison: ["=", "!=", "<", ">", "<=", ">="],
  lparen: "(",
  rparen: ")",
  invalid: { match: /./, error: true },
});

export function validateInput(input: string): ValidationResult {
  // Initialize invalidContent array
  const invalidContent: string[] = [];

  //remove whitespace
  let cleanedInput: string = input.replace(/\s+/g, "");

  //check for illegal characters
  const illegalCharacters = /[^0-9+\-*/()=<>!.]/g;
  const illegalCharacterMatches = cleanedInput.match(illegalCharacters);
  if (illegalCharacterMatches) {
    invalidContent.push(...illegalCharacterMatches);
  }

  // process potential numbers (digits and dots)
  const potentialNumbers = cleanedInput.match(
    /(?:\d|\.)[\d.]*(?:\d|\.)|\b\d\b|(?<!\d)\.(?!\d)/g
  );
  if (potentialNumbers) {
    potentialNumbers.forEach((numberStr: string) => {
      if (isNumeric(numberStr)) {
        // If valid, replace it in cleanedInput with its parsed value
        const parsedNumber = parseFloat(numberStr);
        cleanedInput = cleanedInput.replace(numberStr, parsedNumber.toString());
      } else {
        // If invalid, add to invalidContent
        invalidContent.push(numberStr);
      }
    });
  }

  // find disordered comparison operators
  const disorderedComparisons = /=<|=>|=!/g;
  const disorderedComparisonMatches = cleanedInput.match(disorderedComparisons);
  if (disorderedComparisonMatches) {
    invalidContent.push(...disorderedComparisonMatches);
  }

  if (invalidContent.length > 0) {
    return {
      valid: false,
      cleanedInput,
      message: "Expression Error 1: The input contains invalid content.",
      invalidContent,
    };
  }

  const tokens: moo.Token[] = [];
  lexer.reset(cleanedInput);

  //collect the results of lexical analysis, return false if contains illegal characters
  try {
    for (let token of lexer) {
      if (token.type === "invalid") {
        invalidContent.push(token.text);
        return {
          valid: false,
          cleanedInput,
          message: "Expression Error 1: The input contains invalid content.",
          invalidContent,
        };
      }
      //console.log(token);
      tokens.push(token);
    }
  } catch (err: any) {
    return {
      valid: false,
      cleanedInput,
      message: `Unexpected Error: ${err.message}.`,
      invalidContent: [],
    };
  }

  const compareTokens = tokens.filter(
    (t: moo.Token) => t.type === "comparison"
  );
  if (compareTokens.length !== 1) {
    return {
      valid: false,
      cleanedInput,
      message:
        "Expression error 2: The input must contain exactly one comparison operator.",
      invalidContent,
    };
  }

  const [expLeft, expRight] = cleanedInput.split(compareTokens[0].value);
  if (!isValidMathExpression(expLeft) && !isValidMathExpression(expRight)) {
    return {
      valid: false,
      cleanedInput,
      message:
        "Expression Error 3: Neither side of the comparison operator is a valid mathematical expression.",
      invalidContent,
    };
  }

  if (!isValidMathExpression(expLeft)) {
    return {
      valid: false,
      cleanedInput,
      message:
        "Expression Error 3: The left side of the comparison operator is not a valid mathematical expression.",
      invalidContent,
    };
  }

  if (!isValidMathExpression(expRight)) {
    return {
      valid: false,
      cleanedInput,
      message:
        "Expression Error 3: The right side of the comparison operator is not a valid mathematical expression.",
      invalidContent,
    };
  }

  return {
    valid: true,
    cleanedInput,
    message: "The expression is correct.",
    invalidContent,
  };

  // Helper function to check if a string is a valid numeric value
  function isNumeric(str: string): boolean {
    if (typeof str !== "string") return false;
    return !isNaN(Number(str)) && !isNaN(parseFloat(str));
  }

  // Helper function to check if a string is a valid mathematical expression
  function isValidMathExpression(expr: string): boolean {
    if (!expr || expr.trim() === "") {
      return false;
    }

    try {
      // eslint-disable-next-line no-new-func
      new Function(`return ${expr}`)();
      return true;
    } catch {
      return false;
    }
  }
}
