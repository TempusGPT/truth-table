import { Token } from "./tokenizer";

export function getVariables(tokens: Token[]): string[] {
    const set = new Set<string>();
    tokens.filter(({ type }) => type === "variable").forEach(({ value }) => set.add(value));
    return Array.from(set).toSorted();
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
