import { Token } from "./tokenizer";

export function getVariables(tokens: Token[]): string[] {
    const set = new Set<string>();
    tokens.filter(({ type }) => type === "variable").forEach(({ value }) => set.add(value));
    return Array.from(set).toSorted();
}

export function getOperators(tokens: Token[]): string[] {
    return tokens.filter(({ type }) => type === "operator").map(({ value }) => value);
}

export function generateTruthAssignments(variables: string[]): Record<string, boolean>[] {
    const numVariables = variables.length;
    const numCombinations = 1 << numVariables;
    const assignments: Record<string, boolean>[] = [];

    for (let i = 0; i < numCombinations; i++) {
        const assignment: Record<string, boolean> = {};

        for (let j = 0; j < numVariables; j++) {
            const variable = variables[j];
            const value = i & (1 << (numVariables - j - 1));
            assignment[variable] = !!!value;
        }

        assignments.push(assignment);
    }

    return assignments;
}

export function printTruthTable(expression: string, headers: string[], dataRows: string[][]) {
    const columnWidths = headers.map((header, i) =>
        Math.max(...dataRows.map((row) => row[i].length), header.length)
    );

    const headerLine = buildTableLine(headers, columnWidths);
    const separatorLine = buildSeparatorLine(columnWidths);
    const rowLines = dataRows.map((row) => buildTableLine(row, columnWidths));

    console.log(headerLine);
    console.log(separatorLine);
    rowLines.forEach((line) => console.log(line));
    console.log();
}

export function buildTableLine(cells: string[], widths: number[]): string {
    const line = cells.map((cell, i) => cell.padEnd(widths[i])).join(" | ");
    return `| ${line} |`;
}

export function buildSeparatorLine(widths: number[]): string {
    const line = widths.map((width) => "-".repeat(width)).join(" | ");
    return `| ${line} |`;
}
