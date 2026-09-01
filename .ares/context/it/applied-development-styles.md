# @ares/coding-js — Standard di sviluppo e contratto directory

## Standard di stile del codice

- **ESM puro**: `package.json` ha `"type": "module"`; sorgenti in `src/` e entrypoint in `index.js`.
- **Modularità per responsabilità**: `src/` è organizzato per fase del pipeline (source → extractor → analyzer → structure → cfg → instrumenter → runtime → reporter → mermaid), con un `analyzer.js` che orchestra il flusso.
- **API funzionali pure**: funzioni esportate (es. `analyzeJavaScript`, `buildCFG`, `renderCFGToMermaid`) senza side-effect globali; la CLI è confinata in `bin/coding-js.js`.
- Pipeline: parse → estrazione → CFG/flusso → instrumentazione → esecuzione → report.

## Alberatura reale del modulo

```
coding-js/
├─ .ares/                        # contesto, docs (en/it), tasks — MANUALE
│  ├─ context/                   # README.md (+ context/it/)
│  ├─ docs/en, docs/it           # coding-js.md, completamento
│  └─ tasks/                     # ticket/checklist
├─ .git/, .gitignore             # GENERATO (vcs) / MANUALE
├─ bin/                          # MANUALE — CLI
│  └─ coding-js.js               # ares-coding-js
├─ examples/                     # MANUALE — esempi (es. process-values.js)
├─ node_modules/                 # GENERATO (yarn install)
├─ scripts/                      # MANUALE — script di sviluppo
│  ├─ print-complex-cfg.mjs
│  └─ print-complex-structure.mjs
├─ src/                          # MANUALE — codice sorgente
│  └─ analyzer.js                # + source.js, extractor.js, cfg-builder.js,
│                                #   structure-builder.js, instrumenter.js,
│                                #   runtime.js, reporter.js, mermaid.js
├─ test/                         # MANUALE — test (coding-js.test.js)
├─ Guida-Generatore-CFG-JavaScript.md   # MANUALE — guida legacy
├─ index.js                      # MANUALE — entrypoint libreria
├─ package.json                  # MANUALE
├─ README.md                     # MANUALE
└─ test.json                     # MANUALE — fixture/input di test
```

## Distinzione GENERATO vs MANUALE

### Generato automaticamente (non va committato a mano)

- `node_modules/` — installato da Yarn.
- `.git/` — storia di repository.
- eventuali report/CFG JSON scritti su disco dall'utente via `--out` della CLI (non fanno parte del source).

### Manuale (scritto a mano, NON rigenerare/sovrascrivere)

- `src/`, `bin/`, `scripts/` — codice e CLI.
- `index.js`, `package.json`, `README.md`, `.gitignore` — entrypoint, metadati, configurazione.
- `.ares/context/`, `.ares/docs/`, `.ares/tasks/` — documentazione e ticket.
- `test/`, `examples/`, fixture (`test.json`), `Guida-Generatore-CFG-JavaScript.md` — contenuti autoriali.

### Regola operativa

Non rigenerare né sovrascrivere i contenuti manuali. Non esiste directory `build/`/`dist/`: il package è sorgente puro ESM. Gli output di analisi (CFG/report) sono artefatti d'uso finale, non file di progetto.
