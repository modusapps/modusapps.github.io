const END_OF_LINE = "\n";
const KINDLE_NOTE_DELIMITER = "==========" + END_OF_LINE;
const TITLE_PREFIX = END_OF_LINE + "# ";
const TITLE_SUFFIX = END_OF_LINE + END_OF_LINE;
const FILL_INPUT_SAMPLE_CONTENT_AT_START = false;

// page elements
let convertButton = document.getElementById('convertButton');
let copyButton = document.getElementById('copyButton');
let inputContent = document.getElementById('inputContent');
let outputContent = document.getElementById('outputContent');
let outputContentHtmlWrapper = document.getElementById('outputContentHtmlWrapper');
let outputContentHtml = document.getElementById('outputContentHtml');

// events
convertButton.addEventListener("click", () => {
    let outputContentMarkdown = parseMyClippings(inputContent.value);
    outputContent.value = outputContentMarkdown;
    outputContentHtml.innerHTML = marked(outputContentMarkdown);
    outputContentHtmlWrapper.style.visibility = "visible";
});

copyButton.addEventListener("click", () => {
    window.prompt("Press Ctrl+C / Cmd+C to copy to the clipboard", outputContent.value);
})

if (FILL_INPUT_SAMPLE_CONTENT_AT_START) {
    fetch('sample.txt')
        .then(response => response.text())
        .then(data => {
            inputContent.value = data;
        })
}

// functions
function parseMyClippings(inputContent) {
    // read into map of sets
    let organisedNotesMap = new Map();
    inputContent.split(KINDLE_NOTE_DELIMITER).forEach(note => {
        let lines = note.split(END_OF_LINE);
        let title = lines[0].trim();
        if (title.length > 1) {
            let body = lines.slice(2).join(END_OF_LINE);
            if (!organisedNotesMap.has(title)) {
                organisedNotesMap.set(title, new Set());
            }
            let bodyTrimmed = trimNewLinesSpacesDots(body) + '.';
            bodyTrimmed = bodyTrimmed.charAt(0).toUpperCase() + bodyTrimmed.slice(1)
            organisedNotesMap.get(title).add(bodyTrimmed);
        }
    });

    let stringOutput = '';
    organisedNotesMap.forEach((bodySet, title) => {
        stringOutput += TITLE_PREFIX + title + TITLE_SUFFIX;
        bodySet.forEach(bodyEntry => stringOutput += bodyEntry + END_OF_LINE + END_OF_LINE)
    });
    
    return stringOutput;
}

function trimNewLinesSpacesDots(content)
{
    return content
        // starting
        .replace(/([\.\r\n]+)$/, "")
        .replace(/([\.\n]+)$/, "")
        // ending
        .replace(/(^[\.\r\n]+)/, "")
        .replace(/(^[\.\n]+)/, "")
        .trim();
}
