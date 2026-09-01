# Obiettivi @ares/coding-js

## Goal (funzionale)

- Analizzare codice JavaScript e produrre AST/CFG utilizzabili da altri moduli.
- Abilitare una pipeline di trasformazione “AST-first” che, nel tempo, possa supportare traduzioni (JS → altro linguaggio) e migrazioni di codice/applicazioni.

## Task principali (proposta)

- [ ] 1. Stabilizzare il formato del CFG (JSON schema + versioning).
- [ ] 2. Stabilizzare l’interfaccia di selezione funzione (`selector`) e supportare più casi (default export, class method, arrow fn).
- [ ] 3. Isolare layer “AST utils” riusabile (estrazione, rewrite, formatting).
- [ ] 4. Aggiungere un set di “golden tests” per: AST → CFG → Mermaid.
- [ ] 5. Roadmap translation: definire un set minimo di trasformazioni (es. rename, normalize, hoist, introduce types) e documentarlo.

