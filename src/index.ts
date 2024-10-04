import { readFileSync } from "fs";
import { tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { getVariables, generateTruthAssignments } from "./utils";
import { VariableNode, ExpressionNode } from "./node";

function main() {
    if (process.argv.length < 3) {
        console.error("Usage: tsc && node dist/index.js <input-file>");
        process.exit(1);
    }

    const inputFilename = process.argv[2];
    const inputContent = readFileSync(inputFilename, "utf-8");
    const expressions = inputContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    expressions.forEach(processExpression);
}

function processExpression(expression: string) {
    const tokens = tokenize(expression);
    if (!tokens.ok) {
        console.error(`'${expression}' Tokenization error: ${tokens.error}`);
        return;
    }

    const parser = new Parser(tokens.value);
    const parseResult = parser.parseExpression();
    if (!parseResult.ok) {
        console.error(`'${expression}' Parsing error: ${parseResult.error}`);
        return;
    }

    const variables = getVariables(tokens.value);
    const variableNodes = variables.map((name) => new VariableNode(name));
    const allExpressions = [...variableNodes, ...parser.subExpressions];
    const expressionMap = new Map<string, ExpressionNode>();

    allExpressions.forEach((expr) => {
        const exprStr = expr.toString();
        if (!expressionMap.has(exprStr)) {
            expressionMap.set(exprStr, expr);
        }
    });

    const expressionsList = Array.from(expressionMap.values());
    const assignments = generateTruthAssignments(variables);

    const headers = expressionsList.map((expr) => expr.toString());
    const dataRows = assignments.map((assignment) =>
        expressionsList.map((expr) => (expr.evaluate(assignment) ? "T" : "F"))
    );

    printTruthTable(expression, headers, dataRows);
}

function printTruthTable(expression: string, headers: string[], dataRows: string[][]) {
    const columnWidths = headers.map((header, i) =>
        Math.max(...dataRows.map((row) => row[i].length), header.length)
    );

    const headerLine = buildTableLine(headers, columnWidths);
    const separatorLine = buildSeparatorLine(columnWidths);
    const rowLines = dataRows.map((row) => buildTableLine(row, columnWidths));

    console.log(`EXPR: ${expression}\n`);
    console.log(headerLine);
    console.log(separatorLine);
    rowLines.forEach((line) => console.log(line));
    console.log();
}

function buildTableLine(cells: string[], widths: number[]): string {
    const line = cells.map((cell, i) => cell.padEnd(widths[i])).join(" | ");
    return `| ${line} |`;
}

function buildSeparatorLine(widths: number[]): string {
    const line = widths.map((width) => "-".repeat(width)).join(" | ");
    return `| ${line} |`;
}

main();
