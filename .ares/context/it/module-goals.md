# @ares/coding-js — Scopo, obiettivi e responsabilità

## Introduzione

`@ares/coding-js` è il **toolkit di analisi JavaScript** dell'ecosistema aReS. Parsa codice in AST, estrae funzioni da moduli ES, costruisce il Control Flow Graph (CFG), instrumenta le funzioni per eseguire dataset multipli, raccoglie trace runtime e produce sia una descrizione testuale sia una resa Mermaid del flusso.

## Obiettivi

- Esportare primitive AST/CFG stabili per l'analisi di codice JavaScript.
- Supportare estrazione, CFG, instrumentazione, esecuzione, trace e narrativa del flusso.
- Costruire la base per evoluzioni future di code-to-code / app-to-app tramite trasformazioni AST.

## Responsabilità principali

- **Parsing ed estrazione** (`src/source.js`, `src/extractor.js`): `loadModuleSource`, `parseModuleSource` (via `@babel/parser`) ed `extractFunctionFromAst` (da funzioni, classi o oggetti).
- **Analisi** (`src/analyzer.js`): `analyzeJavaScript` e `analyzeModule` orchestrano l'intero flusso.
- **CFG** (`src/cfg-builder.js`): `buildCFG` e `exportCFGToJson`.
- **Flusso strutturato** (`src/structure-builder.js`): `buildStructuredFlow` ed `exportStructuredFlowToJson`.
- **Instrumentazione ed esecuzione** (`src/instrumenter.js`, `src/runtime.js`): `instrumentFunction`, `executeInstrumentedFunction`, `sanitizeValue`.
- **Reporting** (`src/mermaid.js`, `src/reporter.js`): `renderCFGToMermaid`, `describeExecution`, `describeExecutions`.

## Cosa il modulo NOTA non fa

- **Non** valuta o giudica la qualità del codice: produce rappresentazioni (CFG, structured flow, trace, narrative).
- **Non** fornisce capacità di generazione/refactor di codice (fase futura prevista).
- Esiste una CLI di analisi ma il package è primariamente una **libreria** consumata via import.

## Note

- Entrypoint pubblico: `index.js` (riesporta le funzioni di `src/`).
- CLI: `ares-coding-js` (vedi `cli-overview.md`).
- Dipende da `@babel/*` per parsing/traversal/generazione.
