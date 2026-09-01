# @ares/coding-js — Dipendenze aReS

## Dipendenze @ares/* dichiarate

Dal `package.json`:

- `@ares/core` (`workspace:^`) — **dipendenza**.
- `@ares/scd` (`workspace:^`) — **dipendenza**.

### Perché `@ares/core`

Usato concretamente per le utility del core: `coding-js` importa `recognizeParentheses` da `@ares/core/text.js`, ad esempio nel pipeline di parsing/estrrazione per gestire il bilanciamento delle parentesi.

### Perché `@ares/scd`

`@ares/scd` fornisce gli strumenti di analisi di progetto/contesto aReS; è dichiarato come dipendenza per il supporto alla contestualizzazione del tooling (analogamente ad altri package aReS).

## Chi dipende da @ares/coding-js

Dall'analisi delle `package.json` del workspace, **nessun altro modulo @ares/* dichiara una dipendenza da `@ares/coding-js`**. Il modulo risulta attualmente un toolkit di analisi autonomo.

## Note

- Dependency non-aReS principali: le librerie `@babel/parser`, `@babel/traverse`, `@babel/types`, `@babel/generator`, `@babel/template` (uso per parsing/trasformazione/generazione AST).
