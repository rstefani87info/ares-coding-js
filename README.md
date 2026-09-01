# ares-coding-js

Toolkit per:

- estrarre funzioni da moduli ES;
- costruire il Control Flow Graph (CFG);
- esportare il CFG in JSON;
- instrumentare la funzione;
- eseguire dataset multipli;
- raccogliere trace runtime;
- produrre una descrizione testuale;
- generare una resa Mermaid del flusso.

## Uso da codice

```js
import { analyzeJavaScript } from "@ares/coding-js";

const analysis = await analyzeJavaScript({
    source: `
        export function max(a, b) {
            if (a > b) {
                return a;
            }

            return b;
        }
    `,
    selector: {
        functionName: "max",
    },
    datasets: [
        [5, 3],
        [1, 8],
    ],
});

console.log(analysis.cfgJson);
console.log(analysis.executions[0].trace);
console.log(analysis.narratives[0]);
console.log(analysis.mermaid);
```

## Uso da CLI

```bash
ares-coding-js --module ./example.js --function max --datasets "[[5,3],[1,8]]"
```

## Caso Complesso

Per stampare il `cfgJson` dell'esempio complesso usato nei test:

```bash
npm run cfg:complex
```

L'esempio sorgente si trova in `./examples/process-values.js`.

## API esportate

- `analyzeJavaScript`
- `analyzeModule`
- `extractFunctionFromAst`
- `buildCFG`
- `exportCFGToJson`
- `instrumentFunction`
- `executeInstrumentedFunction`
- `renderCFGToMermaid`
- `describeExecution`
- `describeExecutions`

## Documentazione

### English
- [Documentation Index](./docs/en/index.md)
- [Coding JS](./docs/en/coding-js.md)

### Italiano
- [Indice Documentazione](./docs/it/index.md)
- [Coding JS](./docs/it/coding-js.md)

Documentazione legacy (italiano):
- [Guida Generatore CFG JavaScript](./Guida-Generatore-CFG-JavaScript.md)

## Task

- [Tasks](./tasks/README.md)
