#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { analyzeModule } from "../src/analyzer.js";

function parseArgs(argv) {
    const options = {};

    for (let index = 0; index < argv.length; index += 1) {
        const current = argv[index];
        if (!current.startsWith("--")) {
            continue;
        }

        const key = current.slice(2);
        const value = argv[index + 1] && !argv[index + 1].startsWith("--")
            ? argv[++index]
            : true;

        options[key] = value;
    }

    return options;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (!args.module || !args.function) {
        process.stderr.write(
            "Uso: ares-coding-js --module <path> --function <name> [--class <name>] [--object <name>] [--datasets <json>] [--format structured|cfg|full] [--out <file>]\n",
        );
        process.exitCode = 1;
        return;
    }

    const analysis = await analyzeModule(args.module, {
        selector: {
            functionName: args.function,
            className: args.class || undefined,
            objectName: args.object || undefined,
        },
        datasets: args.datasets ? JSON.parse(args.datasets) : [],
    });

    const format = args.format || "full";
    let payload;

    if (format === "structured") {
        payload = analysis.structuredFlow;
    } else if (format === "cfg") {
        payload = analysis.cfg;
    } else {
        payload = {
            selector: analysis.selector,
            structuredFlow: analysis.structuredFlow,
            structuredFlowJson: analysis.structuredFlowJson,
            cfg: analysis.cfg,
            cfgJson: analysis.cfgJson,
            mermaid: analysis.mermaid,
            executions: analysis.executions,
            narratives: analysis.narratives,
        };
    }

    const output = JSON.stringify(payload, null, 2);

    if (args.out) {
        await writeFile(args.out, output, "utf8");
        process.stdout.write(`Report scritto in ${args.out}\n`);
        return;
    }

    process.stdout.write(`${output}\n`);
}

main().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
});
