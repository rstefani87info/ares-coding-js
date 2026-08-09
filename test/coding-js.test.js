import test from "node:test";
import assert from "node:assert/strict";

import { analyzeJavaScript } from "../index.js";

test("analizza una funzione libera, genera CFG e trace coerenti", async () => {
    const source = `
        export function max(a, b) {
            if (a > b) {
                return a;
            }

            return b;
        }
    `;

    const analysis = await analyzeJavaScript({
        source,
        selector: {
            functionName: "max",
        },
        datasets: [
            [5, 3],
            [1, 8],
        ],
    });

    assert.equal(analysis.cfg.function, "max");
    assert.deepEqual(analysis.cfg.params, ["a", "b"]);
    assert.match(analysis.cfgJson, /"type": "If"/);
    assert.match(analysis.mermaid, /flowchart TD/);
    assert.equal(analysis.executions[0].result, 5);
    assert.equal(analysis.executions[1].result, 8);
    assert.ok(
        analysis.executions[0].trace.some((entry) => entry.type === "If"),
    );
    assert.ok(
        analysis.executions[0].trace.some((entry) => entry.type === "Return"),
    );
});

test("supporta l'estrazione di un metodo di classe con thisArg", async () => {
    const source = `
        export class Calculator {
            multiply(value) {
                return this.factor * value;
            }
        }
    `;

    const analysis = await analyzeJavaScript({
        source,
        selector: {
            className: "Calculator",
            functionName: "multiply",
        },
        datasets: [[7]],
        thisArg: {
            factor: 3,
        },
    });

    assert.equal(analysis.function.kind, "classMethod");
    assert.equal(analysis.executions[0].result, 21);
    assert.equal(analysis.executions[0].trace.at(-1).type, "End");
});

test("supporta funzioni esportate come variabile con arrow function e parametri destrutturati", async () => {
    const source = `
        export const summarize = ({ total }, increment = 1, ...items) =>
            total + increment + items.length;
    `;

    const analysis = await analyzeJavaScript({
        source,
        selector: {
            functionName: "summarize",
        },
        datasets: [
            [{ total: 4 }, 2, "a", "b", "c"],
        ],
    });

    assert.equal(analysis.function.kind, "function");
    assert.deepEqual(analysis.cfg.params, ["total", "increment", "items"]);
    assert.equal(analysis.executions[0].result, 9);
    assert.ok(
        analysis.cfg.nodes.some((node) => node.type === "Return"),
    );
    assert.ok(
        analysis.executions[0].trace.some((entry) => entry.type === "Return"),
    );
});

test("traccia try/catch/finally in un metodo oggetto", async () => {
    const source = `
        const operations = {
            divide(a, b) {
                try {
                    if (b === 0) {
                        throw new Error("division by zero");
                    }

                    return a / b;
                } catch (error) {
                    return null;
                } finally {
                    const status = "done";
                }
            }
        };
    `;

    const analysis = await analyzeJavaScript({
        source,
        selector: {
            objectName: "operations",
            functionName: "divide",
        },
        datasets: [
            [10, 2],
            [10, 0],
        ],
    });

    assert.equal(analysis.function.kind, "objectMethod");
    assert.equal(analysis.executions[0].result, 5);
    assert.equal(analysis.executions[1].result, null);
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "Catch"));
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "Finally"));
    assert.ok(
        analysis.executions[1].trace.some((entry) => entry.type === "Catch"),
    );
    assert.ok(
        analysis.executions[1].trace.some((entry) => entry.type === "Finally"),
    );
});

test("gestisce un flusso complesso con for-of, continue, break e try/catch/finally", async () => {
    const source = `
        export function processValues(values, limit) {
            let sum = 0;

            try {
                for (const value of values) {
                    if (value == null) {
                        continue;
                    }

                    if (value < 0) {
                        throw new Error("negative value");
                    }

                    sum += value;

                    if (sum > limit) {
                        break;
                    }
                }

                return sum;
            } catch (error) {
                return -1;
            } finally {
                const status = sum > limit ? "capped" : "complete";
                void status;
            }
        }
    `;

    const analysis = await analyzeJavaScript({
        source,
        selector: {
            functionName: "processValues",
        },
        datasets: [
            [[2, null, 5, 10], 6],
            [[2, -3, 4], 20],
        ],
    });

    assert.equal(analysis.executions[0].result, 7);
    assert.equal(analysis.executions[1].result, -1);
    assert.equal(analysis.cfg.nodes[0]?.type, "Start");
    assert.notEqual(analysis.cfg.nodes[1]?.type, "End");
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "ForOf"));
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "Continue"));
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "Break"));
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "Catch"));
    assert.ok(analysis.cfg.nodes.some((node) => node.type === "Finally"));
    assert.equal(
        analysis.cfg.nodes.find((node) => node.type === "ForOf")?.condition,
        "const value of values",
    );
    assert.equal(
        analysis.cfg.nodes.find(
            (node) =>
                node.type === "Throw" &&
                node.code === "throw new Error(\"negative value\");",
        )?.catch,
        analysis.cfg.nodes.find((node) => node.type === "Catch")?.id,
    );
    assert.equal(
        analysis.cfg.nodes.find(
            (node) => node.type === "Return" && node.code === "return sum;",
        )?.finally,
        analysis.cfg.nodes.find((node) => node.type === "Finally")?.id,
    );
    assert.ok(
        analysis.executions[0].trace.some((entry) => entry.type === "Break"),
    );
    assert.ok(
        analysis.executions[1].trace.some((entry) => entry.type === "Catch"),
    );
});

test("espone una rappresentazione strutturata gerarchica del flusso", async () => {
    const source = `
        export function processValues(values, limit) {
            let sum = 0;

            try {
                for (const value of values) {
                    if (value == null) {
                        continue;
                    }

                    if (value < 0) {
                        throw new Error("negative value");
                    }

                    sum += value;

                    if (sum > limit) {
                        break;
                    }
                }

                return sum;
            } catch (error) {
                return -1;
            } finally {
                const status = sum > limit ? "capped" : "complete";
                void status;
            }
        }
    `;

    const analysis = await analyzeJavaScript({
        source,
        selector: {
            functionName: "processValues",
        },
        datasets: [
            [[2, null, 5, 10], 6],
        ],
    });

    assert.equal(analysis.structuredFlow.function, "processValues");
    assert.equal(analysis.structuredFlow.nodes[0]?.type, "variableDeclaration");
    assert.equal(analysis.structuredFlow.nodes[1]?.type, "try");
    assert.ok(Number.isInteger(analysis.structuredFlow.nodes[1]?.id));
    assert.equal(analysis.structuredFlow.nodes[1]?.nodes[0]?.type, "forOf");
    assert.equal(analysis.structuredFlow.nodes[1]?.nodes[0]?.id, 10);
    assert.equal(
        analysis.structuredFlow.nodes[1]?.nodes[0]?.iterator,
        "const value of values",
    );
    assert.equal(
        analysis.structuredFlow.nodes[1]?.nodes[0]?.nodes[0]?.id,
        16,
    );
    assert.equal(
        analysis.structuredFlow.nodes[1]?.nodes[0]?.nodes[0]?.consequent?.[0]?.id,
        17,
    );
    assert.equal(
        analysis.structuredFlow.nodes[1]?.catch?.type,
        "catch",
    );
    assert.ok(Number.isInteger(analysis.structuredFlow.nodes[1]?.catch?.id));
    assert.equal(
        analysis.structuredFlow.nodes[1]?.finally?.type,
        "finally",
    );
    assert.ok(Number.isInteger(analysis.structuredFlow.nodes[1]?.finally?.id));
    assert.match(analysis.structuredFlowJson, /"type": "try"/);
    assert.match(analysis.structuredFlowJson, /"type": "forOf"/);
});
