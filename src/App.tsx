import React, { useState } from "react";
import { validateInput } from "./lexer";
import nearley from "nearley";
import grammar from "./math.js";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [invalidContent, setInvalidContent] = useState<string[]>([]);

  const handleParse = (): void => {
    const { valid, cleanedInput, message, invalidContent } =
      validateInput(input);
    setInput(cleanedInput);
    setIsValid(valid);
    setInvalidContent(invalidContent);
    if (valid) {
      const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
      parser.feed(cleanedInput);
      setResult(parser.results[0] ? "True" : "False");
    } else {
      setResult(message);
    }
  };

  const getResultColor = (): string => {
    if (isValid === null) return "black";
    return isValid ? "green" : "red";
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "400px" }}>
        <h1>TMX Function Parser</h1>
        <div style={{ display: "flex", alignItems: "" }}>
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder="Enter function.."
            style={{
              width: "250px",
              height: "100%",
              margin: "0 10px 0 0",
              padding: "10px",
            }}
          />
          <button onClick={handleParse} style={{ padding: "10px 20px" }}>
            Submit
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          color: getResultColor(),
        }}
      >
        <strong>{result}</strong>
      </div>
      {/* Highlight invalid content */}
      {invalidContent.length > 0 && (
        <div style={{ marginTop: "10px", fontSize: "16px" }}>
          <strong>Invalid Content:</strong>
          {invalidContent.map((char: string, index: number) => (
            <span
              key={index}
              style={{
                backgroundColor: "yellow",
                color: "black",
                padding: "2px 5px",
                margin: "0 2px",
                borderRadius: "3px",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
