#!/usr/local/bin/node

/**
 * Node script to convert kindle notes into
 * ./kindleParse.js My Clippings.txt > myClippings.md
 */
const endOfLine = "\r\n";
const kindleNoteDelimiter = "==========" + endOfLine;
const titlePrefix = endOfLine + "# ";
const titleSuffix = endOfLine + endOfLine;

let inputFile = "My Clippings.txt";
if (typeof process.argv[2] !== "undefined") {
    inputFile = process.argv[2];
}

fs = require('fs');

fs.readFile(inputFile, 'utf8', function parseFile(err, data) {
    if (err) {
        throw new Error(err);
    }

    // read into map of sets
    let organisedNotes = new Map();
    data.split(kindleNoteDelimiter).slice(0, 300).forEach(note => {
        lines = note.split(endOfLine);
        title = lines[0];
        body = lines.slice(2).join(endOfLine);
        if (!organisedNotes.has(title)) {
            organisedNotes.set(title, new Set());
        }
        let bodyTrimmed = body.replace(/([\. \r\n]+)$/, "").replace(/(^[\. \r\n]+)/, "") + '.';
        bodyTrimmed = bodyTrimmed.charAt(0).toUpperCase() + bodyTrimmed.slice(1)
        organisedNotes.get(title).add(bodyTrimmed);
    });

    let stringOutput = '';
    organisedNotes.forEach((bodySet, title) => {
        stringOutput += titlePrefix + title + titleSuffix;
        bodySet.forEach(bodyEntry => stringOutput += bodyEntry + endOfLine + endOfLine)
    })

    console.log(stringOutput);
});
