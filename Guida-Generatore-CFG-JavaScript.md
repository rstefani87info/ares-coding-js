# Guida Completa: Generatore di Diagrammi di Flusso e Trace Runtime per JavaScript

## Obiettivo

Realizzare un sistema che, dato:

-   un modulo ES
-   una classe
-   un oggetto
-   una funzione appartenente ad essi

sia in grado di:

1.  estrarre la funzione;
2.  costruire il Control Flow Graph (CFG);
3.  esportarlo in JSON;
4.  eseguire la funzione passo-passo con insiemi di parametri;
5.  produrre un trace completo;
6.  generare una descrizione testuale dell'esecuzione.

------------------------------------------------------------------------

# Architettura

``` text
Codice JS
    │
    ▼
@babel/parser
    │
    ▼
AST
    │
    ▼
Costruzione CFG
    │
    ├── JSON
    ├── Trace
    ├── Mermaid
    ├── React Flow
    └── Processo scritto
```

## Librerie consigliate

  Scopo                Libreria
  -------------------- ----------------------
  Parsing              @babel/parser
  Traversal            @babel/traverse
  Generazione codice   @babel/generator
  Scope analysis       eslint-scope
  Rendering            React Flow / Mermaid
  Sandbox esecuzione   vm (Node)

# Modello JSON del CFG

``` json
{
  "function":"calcola",
  "params":["a","b"],
  "nodes":[
    {
      "id":1,
      "type":"start",
      "next":2
    },
    {
      "id":2,
      "type":"if",
      "condition":"a>b",
      "true":3,
      "false":4
    },
    {
      "id":3,
      "type":"return",
      "code":"return a"
    },
    {
      "id":4,
      "type":"return",
      "code":"return b"
    }
  ]
}
```

# Dataset di test

``` json
[
    [5,3],
    [1,8],
    [10,10]
]
```

Ogni elemento rappresenta una tupla dei parametri.

# Trace runtime

``` json
{
    "node":2,
    "line":15,
    "condition":"a>b",
    "result":true,
    "locals":{
        "a":5,
        "b":3
    }
}
```

# Instrumentazione

Trasformazione:

``` js
if(a>b){
    x++;
}
```

in

``` js
trace(1);

if(a>b){

    trace(2,{
        result:a>b
    });

    x++;

    trace(3,{
        x
    });

}
```

# Tipi di nodo

-   Start
-   End
-   Statement
-   VariableDeclaration
-   Assignment
-   Expression
-   If
-   Switch
-   For
-   ForIn
-   ForOf
-   While
-   DoWhile
-   Break
-   Continue
-   Return
-   Throw
-   Try
-   Catch
-   Finally
-   Call
-   Await

# Pipeline suggerita

1.  Parsing AST
2.  Costruzione CFG
3.  Validazione
4.  Esportazione JSON
5.  Instrumentazione
6.  Esecuzione con N dataset
7.  Raccolta trace
8.  Generazione report testuale
9.  Rendering grafico

# Estensioni future

-   Copertura dei rami
-   Analisi del flusso dati
-   Call graph interprocedurale
-   Supporto TypeScript
-   Supporto JSX
-   Esportazione Graphviz DOT
-   Esportazione Mermaid
-   Debugger visuale React Flow
-   Confronto tra due esecuzioni
-   Integrazione con LLM per spiegazioni automatiche

# Conclusione

L'approccio più robusto consiste nel separare:

-   AST (struttura sintattica)
-   CFG (flusso di controllo)
-   Trace (esecuzione)
-   Renderer (visualizzazione)
-   Narratore (descrizione testuale)

Questa architettura è modulare, estendibile e adatta alla costruzione di
un debugger/documentatore avanzato per codice JavaScript.
