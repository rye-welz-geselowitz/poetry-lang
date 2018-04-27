const utilities = require('./utilities');
const AST = require('./ast');

function parse(lines, rhyme, level=0){
    const parsers = [parseInteger, parseIfElseBlock, parseFunction,
        parseString, parseOperation, parseFunctionCall, parseCodeBlocks];
    return parsers.reduce( (acc, f) => acc? acc : f(lines, rhyme, level), null)
}

//PARSERS
function parseCodeBlocks(lines, rhyme, level){
    const es = lines.reduce( (acc, lineData, idx) => {
        const line = lineData.text;
        if(idx===lines.length-1 && (!acc.openRhyme || !utilities.isRhyme(rhyme, acc.openRhyme, getLastWord(line)))){ //TODO: clean this line!!!
            const expression = parse(acc.currentGroup.concat(lineData), rhyme, level+1);
            return {
                openRhyme: acc.openRhyme,
                currentGroup: [],
                groups: acc.groups.concat(expression)
            }
        }
        if(acc.openRhyme===null){
            const lastWord = getLastWord(line);
            return {openRhyme: lastWord,
                    currentGroup: lastWord[lastWord.length-1]==="?"? [lineData]: [], //TODO: ugh this is gross!!
                    groups: acc.groups}
        }
        if(utilities.isRhyme(rhyme, acc.openRhyme, getLastWord(line))){
            const expression = parse(acc.currentGroup, rhyme, level+1);
            const assignment = new AST.Assign(acc.openRhyme, expression)
            return {
                openRhyme: null,
                currentGroup: [],
                groups: acc.groups.concat([assignment])
            }
        }
        return {
            openRhyme: acc.openRhyme,
            currentGroup: acc.currentGroup.concat(lineData),
            groups: acc.groups
        }
    }, {openRhyme: null, currentGroup: [], groups: []}).groups;
    if(level===0){
        return new AST.Program(es);
    }
    return es.length===1? es[0] : es;

}

function parseInteger(lineData, rhyme){
    if(lineData.length===2 && hasWrappingRhyme(lineData, rhyme)){
        const lines = lineData.map( (l) => l.text)
        const words = lines[0].split(/\s+/).concat(lines[1].split(/\s+/));
        const firstLetter = words[0][0].toLowerCase();
        const n = words.reduce( (acc, val) => {
            return val[0].toLowerCase() === firstLetter? (acc+1) : acc;
        }, 0) - 1;
        return new AST.Num(n);
    }
    return null;
}

function parseIfElseBlock(lineData, rhyme, level){
    const lines = lineData.map( (l) => l.text.toLowerCase());
    const endOfE1Idx =
        lines.findIndex( (l) => /.*\?/.test(l));
    const beginningOfE3Idx =
        lines.findIndex( (l) => /(otherwise|else).*/.test(l));
    if(checkIfElseExpressionBoundaries(rhyme, lines, endOfE1Idx, beginningOfE3Idx)){
        const e1Lines = lineData.slice(0, endOfE1Idx+1);
        const e2Lines = lineData.slice(endOfE1Idx+1, beginningOfE3Idx );
        const e3Lines = lineData.slice(beginningOfE3Idx);
        const e1 = e1Lines.length===1?
            new AST.Ref(getNthWord(e1Lines[0].text, 0))
            : parse(cutFirstAndLastLines(e1Lines), rhyme, level+1);
        const e2 = e2Lines.length===1?
            new AST.Ref(getNthWord(e2Lines[0].text, 0))
            : parse(cutFirstAndLastLines(e2Lines), rhyme, level+1);
        const e3 = e3Lines.length===1?
            new AST.Ref(getNthWord(e3Lines[0].text, 1))
            : parse(cutFirstAndLastLines(e3Lines), rhyme, level+1);
        return new AST.If(e1, e2, e3);
    }
    return null;
}

function parseFunction(lineData, rhyme, level){
    if(detectFunction(lineData, rhyme)){
        const lines = lineData.map( (l) => l.text);
        const rhymeToEndBody = getLastWord(lines[lines.length-2]);
        const openingBodyIdx =
            lines.findIndex( (l) => utilities.isRhyme(rhyme, getLastWord(l), rhymeToEndBody));
        const parameters =
            lines.slice(1, openingBodyIdx).map( (l) => getLastWord(l))
        const body = lineData.slice(openingBodyIdx+1, lines.length-2)
        const expressions = parse(body, rhyme, level+1);
        return new AST.Func(parameters, expressions)
    }
    return null;

}

function parseString(lineData){
    const matches = lineData.length && matchString(lineData[0].text);
    return matches? new AST.Str(matches[1]) : null;
}


function parseFunctionCall(lineData, rhyme){
    if(lineData.length===1 && hasInternalWrappingAlliteration(lineData[0].text)){
        const words = lineData[0].text.split(/\s+/);
        return new AST.Call(words[0], words.slice(1));
    }
    return null;

}


function parseOperation(lineData){
    const line = lineData[0].text;
    const matches = line && line.match(operationalWordsRegex())
    if(line && lineData.length===1 && matchString(line) === null && matches){
        const words = line.split(/\s+/);
        const e1 = new AST.Ref(words[0]);
        const e2 = new AST.Ref(words[1]);
        const operativeWord = matches[1];
        const op = mapOperativeWordToOperation(operativeWord);
        return new AST.Operation(e1, e2, op);
    }
    return null;
}


//HELPERS
function detectFunction(lines, rhyme){
    return lines.length > 5 &&
        hasWrappingInternalRhyme(lines[0].text, rhyme)
        && hasWrappingRhyme(lines, rhyme);
}

function matchString(text){
    return text.match(/\"(.*)\"/);
}

//TODO: extract / clarify
function checkIfElseExpressionBoundaries(rhyme, lines, endOfE1Idx, beginningOfE3Idx){
    return endOfE1Idx > -1 && beginningOfE3Idx > -1
        && !(endOfE1Idx > 0
                && (!isLinesRhyming(rhyme, lines[0], lines[endOfE1Idx])))
        && !((beginningOfE3Idx < lines.length-1 &&
            !isLinesRhyming(rhyme, lines[beginningOfE3Idx], lines[lines.length-1])))
}


function hasWrappingRhyme(lines, rhyme){
    return utilities.isRhyme(rhyme, getLastWord(lines[0].text),
        getLastWord(lines[lines.length-1].text));
}

function hasWrappingInternalRhyme(line, rhyme){
    const words = line.split(/\s+/);
    return utilities.isRhyme(rhyme, words[0], words[words.length-1]);
}

function operationalWordsRegex(){
    return /\s(by|over|give|take|leave|is|more|less|and|or)/;
}

function ifElseRegex(){
    return /(.*)\?(.*)(otherwise|else)(.*)/
}

function hasInternalWrappingAlliteration(line){
    const words = line.split(/\s+/);
    return words[0][0].toLowerCase()===words[words.length-1][0].toLowerCase();
}





function mapOperativeWordToOperation(word){
    const lookup = {
        "by": "*",
        "over": "/",
        "give": "+",
        "take": "-",
        "leave": "%",
        "is": "==",
        "more": ">",
        "less": "<",
        "and": "&&",
        "or": "||"
    }
    const op = lookup[word];
    if(!op){
        throw("invalid operation")
    }
    return op;
}

function isLinesRhyming(rhyme, line1, line2){
    const words1 = line1.split(/\s+/);
    const words2 = line2.split(/\s+/);
    return utilities.isRhyme(rhyme, words1[words1.length-1], words2[words2.length-1]);
}

function getLastWord(line){
    const words = line.split(/\s+/);
    return words[words.length-1];
}


function getNthWord(line, n){
    const words = line.split(/\s+/);
    return words[n];
}


function cutFirstAndLastLines(lines){
    return lines.slice(0, lines.length-1)
}



module.exports = {
    parse: parse
}
