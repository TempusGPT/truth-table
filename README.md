| P   | Q   | R   | ~R  | Q ∧ ~R | P ∨ Q ∧ ~R | P ∨ Q ∧ ~R → P |
| --- | --- | --- | --- | ------ | ---------- | -------------- |
| T   | T   | T   | F   | F      | T          | T              |
| T   | T   | F   | T   | T      | T          | T              |
| T   | F   | T   | F   | F      | T          | T              |
| T   | F   | F   | T   | F      | T          | T              |
| F   | T   | T   | F   | F      | F          | T              |
| F   | T   | F   | T   | T      | T          | F              |
| F   | F   | T   | F   | F      | F          | T              |
| F   | F   | F   | T   | F      | F          | T              |

| P   | Q   | R   | ~P  | ~P ∨ R | ~Q  | ~P ∨ R → ~Q |
| --- | --- | --- | --- | ------ | --- | ----------- |
| T   | T   | T   | F   | T      | F   | F           |
| T   | T   | F   | F   | F      | F   | T           |
| T   | F   | T   | F   | T      | T   | T           |
| T   | F   | F   | F   | F      | T   | T           |
| F   | T   | T   | T   | T      | F   | F           |
| F   | T   | F   | T   | T      | F   | F           |
| F   | F   | T   | T   | T      | T   | T           |
| F   | F   | F   | T   | T      | T   | T           |
