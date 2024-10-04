import { Result, Ok, Err } from "./result";

export interface Token {
    type: "variable" | "operator";
    value: string;
    position: number;
}

const operators = [..."~∧∨→"];
const variables = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export function tokenize(expression: string): Result<Token[], string> {
    const tokens: Token[] = [];

    for (let i = 0; i < expression.length; i += 1) {
        const char = expression[i];

        if (char.trim() === "") {
            continue;
        }

        if (variables.includes(char)) {
            tokens.push({ type: "variable", value: char, position: i });
            continue;
        }

        if (operators.includes(char)) {
            tokens.push({ type: "operator", value: char, position: i });
            continue;
        }

        return Err(`Invalid character '${char}' at position ${i + 1}.`);
    }

    return Ok(tokens);
}
