export abstract class ExpressionNode {
    public abstract evaluate(variables: Record<string, boolean>): boolean;
    public abstract toString(): string;
}

export class VariableNode extends ExpressionNode {
    public constructor(private readonly name: string) {
        super();
    }

    public evaluate(variables: Record<string, boolean>): boolean {
        return variables[this.name];
    }

    public toString(): string {
        return this.name;
    }
}

export class UnaryOperatorNode extends ExpressionNode {
    public constructor(
        private readonly operator: string,
        private readonly operand: ExpressionNode
    ) {
        super();
    }

    public evaluate(variables: Record<string, boolean>): boolean {
        const operandValue = this.operand.evaluate(variables);
        return this.operator === "~" ? !operandValue : false;
    }

    public toString(): string {
        return `${this.operator}${this.operand.toString()}`;
    }
}

export class BinaryOperatorNode extends ExpressionNode {
    public constructor(
        private readonly operator: string,
        private readonly left: ExpressionNode,
        private readonly right: ExpressionNode
    ) {
        super();
    }

    public evaluate(variables: Record<string, boolean>): boolean {
        const leftValue = this.left.evaluate(variables);
        const rightValue = this.right.evaluate(variables);

        switch (this.operator) {
            case "∧":
                return leftValue && rightValue;
            case "∨":
                return leftValue || rightValue;
            case "→":
                return !leftValue || rightValue;
            default:
                return false;
        }
    }

    public toString(): string {
        return `${this.left.toString()} ${this.operator} ${this.right.toString()}`;
    }
}
