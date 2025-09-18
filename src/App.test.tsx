import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Helper function to interact with the UI and get results
const testMathExpression = async (
  expression: string,
  expectedResult: string
): Promise<void> => {
  render(<App />);

  const input = screen.getByPlaceholderText("Enter function..");
  const button = screen.getByText("Submit");

  fireEvent.change(input, { target: { value: expression } });
  fireEvent.click(button);

  await waitFor(() => {
    const result = screen.getByText(expectedResult);
    expect(result).toBeInTheDocument();
  });
};

// Helper function to test error cases
const testMathExpressionError = async (
  expression: string,
  expectedErrorPattern: RegExp
): Promise<void> => {
  render(<App />);

  const input = screen.getByPlaceholderText("Enter function..");
  const button = screen.getByText("Submit");

  fireEvent.change(input, { target: { value: expression } });
  fireEvent.click(button);

  await waitFor(() => {
    const result = screen.getByText(expectedErrorPattern);
    expect(result).toBeInTheDocument();
  });
};

describe("Math Parser Tests", () => {
  describe("Basic Arithmetic Operations", () => {
    test("1 + 2 = 3 should return true", async () => {
      await testMathExpression("1 + 2 = 3", "True");
    });

    test("2 * 3 + 4 = 10 should return true", async () => {
      await testMathExpression("2 * 3 + 4 = 10", "True");
    });

    test("2 * (3 + 4) = 10 should return false", async () => {
      await testMathExpression("2 * (3 + 4) = 10", "False");
    });

    test("6 = 10 / 2 + 1 should return true", async () => {
      await testMathExpression("6 = 10 / 2 + 1", "True");
    });

    test("12 + 3 != 4 / 2 + 5 should return true", async () => {
      await testMathExpression("12 + 3 != 4 / 2 + 5", "True");
    });

    test("2 + 3 * 2 = 10 should return false", async () => {
      await testMathExpression("2 + 3 * 2 = 10", "False");
    });

    test("2 * 3 + 4 != 10 should return false", async () => {
      await testMathExpression("2 * 3 + 4 != 10", "False");
    });
  });

  describe("Error Handling", () => {
    test("1 + (2 = 3 should show invalid query error", async () => {
      await testMathExpressionError("1 + (2 = 3", /Expression Error 3/);
    });
  });

  describe("Additional Test Cases", () => {
    test("should handle subtraction correctly", async () => {
      await testMathExpression("10 - 3 = 7", "True");
    });

    test("should handle division with decimals", async () => {
      await testMathExpression("5 / 2 = 2.5", "True");
    });

    test("should handle complex nested parentheses", async () => {
      await testMathExpression("(2 + 3) * (4 - 1) = 15", "True");
    });

    test("should handle greater than comparison", async () => {
      await testMathExpression("5 > 3", "True");
    });

    test("should handle less than comparison", async () => {
      await testMathExpression("3 < 5", "True");
    });

    test("should handle greater than or equal comparison", async () => {
      await testMathExpression("5 >= 5", "True");
    });

    test("should handle less than or equal comparison", async () => {
      await testMathExpression("3 <= 5", "True");
    });
  });

  describe("Invalid Input Handling", () => {
    test("should reject expressions with invalid characters", async () => {
      await testMathExpressionError("1 + a = 2", /invalid content/);
    });

    test("should reject expressions with multiple comparison operators", async () => {
      await testMathExpressionError(
        "1 = 2 = 3",
        /exactly one comparison operator/
      );
    });

    test("should reject expressions with no comparison operator", async () => {
      await testMathExpressionError(
        "1 + 2 + 3",
        /exactly one comparison operator/
      );
    });

    test("should reject malformed parentheses", async () => {
      await testMathExpressionError(
        "(1 + 2 = 3",
        /not a valid mathematical expression/
      );
    });
  });

  describe("UI Integration Tests", () => {
    test("should update input and display result when parse button is clicked", async () => {
      await testMathExpression("1 + 2 = 3", "True");
    });

    test("should display error message for invalid input", async () => {
      await testMathExpressionError("1 + a = 2", /Expression Error 1/);
    });

    test("should clear input and show new result for different expressions", async () => {
      render(<App />);

      const input = screen.getByPlaceholderText("Enter function..");
      const button = screen.getByText("Submit");

      // Test first expression
      fireEvent.change(input, { target: { value: "2 + 2 = 4" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("True")).toBeInTheDocument();
      });

      // Test second expression
      fireEvent.change(input, { target: { value: "2 + 2 = 5" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("False")).toBeInTheDocument();
      });
    });
  });
});
