import { fileURLToPath } from "node:url";

import { analyzeModule } from "../index.js";

const analysis = await analyzeModule(
    fileURLToPath(new URL("../examples/process-values.js", import.meta.url)),
    {
        selector: {
            functionName: "processValues",
        },
        datasets: [
            [[2, null, 5, 10], 6],
            [[2, -3, 4], 20],
        ],
    },
);

console.log(analysis.structuredFlowJson);
