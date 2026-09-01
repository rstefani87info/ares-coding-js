# @ares/coding-js — Panoramica CLI

## Entrypoint binario

- `ares-coding-js` → `./bin/coding-js.js`

## Script npm

- `test` — `node --test ./test/coding-js.test.js`.
- `cfg:complex` — `node ./scripts/print-complex-cfg.mjs` (stampa il CFG dell'esempio complesso `examples/process-values.js`).
- `structured:complex` — `node ./scripts/print-complex-structure.mjs` (stampa il flusso strutturato dell'esempio complesso).
- `ares-coding-js` — alias del binario.

## Comando CLI `ares-coding-js`

Parser a singolo comando basato su flag `--`:

```
ares-coding-js --module <path> --function <name> [--class <name>] [--object <name>] [--datasets <json>] [--format structured|cfg|full] [--out <file>]
```

Argomenti:

- `--module <path>` — percorso del file modulo ES da analizzare (obbligatorio).
- `--function <name>` — nome della funzione da selezionare (obbligatorio).
- `--class <name>` — nome della classe (se la funzione è un metodo).
- `--object <name>` — nome dell'oggetto (se la funzione è un metodo di oggetto).
- `--datasets <json>` — dataset di esecuzione in JSON (es. `"[[5,3],[1,8]]"`).
- `--format structured|cfg|full` — formato di output (default `full`).
- `--out <file>` — scrive il report JSON su file invece che su stdout.

Uso dalla libreria (API primaria):

```js
import { analyzeJavaScript, analyzeModule } from "@ares/coding-js";
```
