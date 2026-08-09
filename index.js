/**
 * @author Roberto Stefani
 */

export { analyzeJavaScript, analyzeModule } from "./src/analyzer.js";
export { buildCFG, exportCFGToJson } from "./src/cfg-builder.js";
export { extractFunctionFromAst } from "./src/extractor.js";
export { instrumentFunction } from "./src/instrumenter.js";
export { renderCFGToMermaid } from "./src/mermaid.js";
export { describeExecution, describeExecutions } from "./src/reporter.js";
export { executeInstrumentedFunction, sanitizeValue } from "./src/runtime.js";
export { loadModuleSource, parseModuleSource } from "./src/source.js";
export {
    buildStructuredFlow,
    exportStructuredFlowToJson,
} from "./src/structure-builder.js";
