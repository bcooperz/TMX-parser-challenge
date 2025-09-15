# Mathematical Function Parser

A robust TypeScript-based mathematical expression parser that evaluates and validates mathematical equations with support for arithmetic operations, comparison operators, and parentheses grouping.

## Features

- ✅ **Mathematical Expression Parsing** - Supports addition, subtraction, multiplication, and division
- ✅ **Comparison Operators** - Handles `=`, `!=`, `<`, `>`, `<=`, `>=` operators
- ✅ **Parentheses Support** - Proper order of operations with nested parentheses
- ✅ **TypeScript** - Full type safety and enhanced developer experience
- ✅ **Input Validation** - Comprehensive error handling and invalid character detection
- ✅ **Real-time UI** - Interactive web interface with instant feedback
- ✅ **Comprehensive Testing** - 22 test cases covering all functionality

## Supported Operations

### Arithmetic Operations

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`

### Comparison Operators

- Equality: `=`
- Inequality: `!=`
- Less than: `<`
- Greater than: `>`
- Less than or equal: `<=`
- Greater than or equal: `>=`

### Examples

```javascript
// Basic arithmetic
"1 + 2 = 3"; // → true
"2 * 3 + 4 = 10"; // → true
"6 = 10 / 2 + 1"; // → true

// Parentheses
"2 * (3 + 4) = 10"; // → false (correctly evaluates to 14)
"(2 + 3) * (4 - 1) = 15"; // → true

// Comparison operators
"12 + 3 != 4 / 2 + 5"; // → true
"5 > 3"; // → true
"3 <= 5"; // → true

// Error cases
"1 + (2 = 3"; // → Error: Invalid syntax
"1 + a = 2"; // → Error: Invalid characters
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/bcooperz/TMX-parser-challenge.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

### `npm start`

Runs the app in development mode with hot reloading.

### `npm test`

Launches the test runner with 22 test cases.

### `npm run type-check`

Runs TypeScript type checking without emitting files.

### `npm run gen-parser`

Regenerates the parser from the Nearley grammar file.

## Project Structure

```
src/
├── App.tsx              # Main React component
├── App.test.tsx         # Comprehensive test suite
├── lexer.ts             # Input validation and tokenization
├── types.ts             # TypeScript type definitions
├── math.js              # Generated parser (from math.ne)
├── math.ne              # Nearley grammar definition
├── index.tsx            # Application entry point
└── App.css              # Component styles
```

## Architecture

### Lexical Analysis (`lexer.ts`)

- Validates input characters and removes whitespace
- Identifies and processes numbers, operators, and parentheses
- Detects invalid characters and malformed expressions
- Returns structured validation results with error details

### Grammar Parsing (`math.ne` → `math.js`)

- Defines mathematical expression grammar using Nearley
- Handles operator precedence and associativity
- Supports nested parentheses and complex expressions
- Generates JavaScript parser for runtime evaluation

## Error Handling

The parser provides detailed error messages for various scenarios:

- **Expression Error 1**: Invalid characters detected
- **Expression Error 2**: Missing or multiple comparison operators
- **Expression Error 3**: Invalid mathematical expressions on either side of comparison

## Testing

The project includes 22 test cases covering:

- ✅ Basic arithmetic operations
- ✅ Order of operations (PEMDAS)
- ✅ Parentheses grouping
- ✅ All comparison operators
- ✅ Decimal number handling
- ✅ Error validation
- ✅ UI interaction testing

Run tests with:

```bash
npm test
```

## Development

### Adding New Features

1. Update the grammar in `src/math.ne`
2. Regenerate parser: `npm run gen-parser`
3. Update types in `src/types.ts` if needed
4. Add tests in `src/App.test.tsx`
5. Run type checking: `npm run type-check`
