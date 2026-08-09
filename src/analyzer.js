import {recognizeParentheses} from '@ares/core/text.js';

export default function analyzeJavaScript(script) {
    const parenthesized = recognizeParentheses(script);
    const newLined = parenthesized.replace(/\n\r|\n|\r/g, '<br/>');
    const tabs = newLined.match(/(\t+)/g);
    let tabbed = newLined;
    for (const tab of tabs.sort((a, b) => a.length - b.length)) {
        tabbed = tabbed.replaceAll(tab, `<tab length="${tab.length}"/>`);
    }
     
}