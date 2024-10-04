import { readFileSync } from "fs";
import { tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { VariableNode, ExpressionNode } from "./node";
import { getVariables, generateTruthAssignments, printTruthTable } from "./utils";

function main() {
    if (process.argv.length < 3) {
        console.error("Usage: tsc && node dist/index.js <input-file>");
        process.exit(1);
    }

    readFileSync(process.argv[2], "utf-8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .forEach(processExpression);
}

function processExpression(expression: string) {
    const tokens = tokenize(expression);
    if (!tokens.ok) {
        console.error(`'${expression}' Tokenization error: ${tokens.error}`);
        return;
    }

    const parser = new Parser(tokens.value);
    const result = parser.parseExpression();
    if (!result.ok) {
        console.error(`'${expression}' Parsing error: ${result.error}`);
        return;
    }

    const variables = getVariables(tokens.value);
    const variableNodes = variables.map((name) => new VariableNode(name));
    const expressionMap = new Map<string, ExpressionNode>();

    [...variableNodes, ...parser.subExpressions]
        .map((expr) => ({ key: expr.toString(), value: expr }))
        .filter(({ key }) => !expressionMap.has(key))
        .forEach(({ key, value }) => expressionMap.set(key, value));

    const expresions = Array.from(expressionMap.values());
    const assignments = generateTruthAssignments(variables);

    const headers = expresions.map((expr) => expr.toString());
    const dataRows = assignments.map((assignment) =>
        expresions.map((expr) => (expr.evaluate(assignment) ? "T" : "F"))
    );

    printTruthTable(expression, headers, dataRows);
}

main();
