import { ExpressionNode, VariableNode, UnaryOperatorNode, BinaryOperatorNode } from "./nodes";
import { Result, Ok, Err } from "./result";
import { Token } from "./tokenizer";

export class Parser {
    public readonly subExpressions: ExpressionNode[];
    private readonly tokens: Token[];
    private position = 0;

    public constructor(tokens: Token[]) {
        this.subExpressions = [];
        this.tokens = tokens;
    }

    public parseExpression(): Result<ExpressionNode, string> {
        return this.parseImplication();
    }

    private parseImplication(): Result<ExpressionNode, string> {
        const left = this.parseDisjunction();
        if (!left.ok) {
            return left;
        }

        while (this.match("→")) {
            this.consumeToken();

            const right = this.parseDisjunction();
            if (!right.ok) {
                return right;
            }

            left.value = new BinaryOperatorNode("→", left.value, right.value);
            this.subExpressions.push(left.value);
        }

        return Ok(left.value);
    }

    private parseDisjunction(): Result<ExpressionNode, string> {
        const left = this.parseConjunction();
        if (!left.ok) {
            return left;
        }

        while (this.match("∨")) {
            this.consumeToken();

            const right = this.parseConjunction();
            if (!right.ok) {
                return right;
            }

            left.value = new BinaryOperatorNode("∨", left.value, right.value);
            this.subExpressions.push(left.value);
        }

        return Ok(left.value);
    }

    private parseConjunction(): Result<ExpressionNode, string> {
        const left = this.parseNegation();
        if (!left.ok) {
            return left;
        }

        while (this.match("∧")) {
            this.consumeToken();

            const right = this.parseNegation();
            if (!right.ok) {
                return right;
            }

            left.value = new BinaryOperatorNode("∧", left.value, right.value);
            this.subExpressions.push(left.value);
        }

        return Ok(left.value);
    }

    private parseNegation(): Result<ExpressionNode, string> {
        if (this.match("~")) {
            this.consumeToken();

            const operand = this.parseNegation();
            if (!operand.ok) {
                return operand;
            }

            const node = new UnaryOperatorNode("~", operand.value);
            this.subExpressions.push(node);
            return Ok(node);
        }

        return this.parsePrimary();
    }

    private parsePrimary(): Result<ExpressionNode, string> {
        const token = this.currentToken();

        if (token?.type !== "variable") {
            return Err(
                `Variable expected at position ${token ? token.position + 1 : "end of input"}.`
            );
        }

        this.consumeToken();
        const node = new VariableNode(token.value);
        this.subExpressions.push(node);
        return Ok(node);
    }

    private currentToken(): Token | null {
        return this.tokens[this.position] ?? null;
    }

    private consumeToken(): Token | null {
        return this.tokens[this.position++] ?? null;
    }

    private match(value: string): boolean {
        return this.currentToken()?.value === value;
    }
}
