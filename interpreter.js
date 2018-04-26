const AST = require('./ast');

function interpret(text, rhyme){
    const lineData = getCleanedLines(text);
    //UGH HORRIBLE LOGIC PLZ FIX
    let es = detectCodeBlocks(lineData, rhyme);
    es = Array.isArray(es)? es: [es];
    const ast = new AST.Program(es); //TODO: change func name. Also move this logic
    // console.log(ast)
    return evaluate(ast, rhyme);
}

function evaluate(ast, rhyme, bindings = {}){
    // console.log(ast)
    if(Array.isArray(ast) && ast.length===1){ //Super hacky!!! Fix root problem!!
        ast = ast[0];
    }
    if(ast instanceof AST.Program){
        return evaluateProgram(ast, rhyme, bindings);
    }
    if(ast instanceof AST.Num){
        return ast.n;
    }
    if(ast instanceof AST.Str){
        return ast.val;
    }
    if(ast instanceof AST.Assign){
        return evaluate(ast.e, rhyme, bindings);
    }
    if(ast instanceof AST.Operation){
        return binaryOperation(ast.op,
                evaluate(ast.e1, rhyme, bindings),
                evaluate(ast.e2, rhyme, bindings));
    }
    if(ast instanceof AST.Ref){
        return evaluateRef(ast.x, rhyme, bindings);
    }
    if(ast instanceof AST.If){
        // console.log('!!!!')
        // console.log(ast.e1, ast.e2, ast.e3)
        if(evaluateIfElse(ast.e1, rhyme, bindings)){
            return evaluateIfElse(ast.e2, rhyme, bindings);
        }
        else{
            return evaluateIfElse(ast.e3, rhyme, bindings);
        }
    }
    if(ast instanceof AST.Func){
        var f = function(...args){

            // console.log('calling function', args)
          const newBindings
            = ast.ps.reduce( (acc, p, idx) => {
                const newAcc = Object.assign({}, acc);
                newAcc[p] = args[0][idx]
                return newAcc;
            }, Object.assign({}, bindings));
          return evaluateFunction(ast, rhyme, newBindings, f)
        }
        f.numExpectedArguments = ast.ps.length;
        return f;
    }
    if(ast instanceof AST.Call){
        // console.log('bindings', bindings)
        // console.log('ast.f', ast.f)
        const f = evaluateRef(ast.f, rhyme, bindings);
        const ps =
            ast.ps.slice(0, f.numExpectedArguments).map( (p) => evaluate(new AST.Ref(p), rhyme, bindings))
        return f(ps);
    }
    throw('I dont handle evalauting '+(ast.constructor.name)+' yet!');
}

//TODO: everything below needs to be consolidated!!!
function evaluateIfElse(esOriginal, rhyme, bindings){
    const es = Array.isArray(esOriginal)? esOriginal : [esOriginal];
    const updatedBindings =
        es.slice(0, es.length-1).reduce( (acc, e) => {
            const newAcc = Object.assign({}, acc);
            if(e instanceof AST.Assign){
                if(e.e instanceof AST.Func){
                    e.e.selfReference = e.x; //This is kinda wizardy, not sure if I should
                }
                newAcc[e.x] = evaluate(e.e, rhyme, Object.assign({}, acc));
            }
            return newAcc;
        }, Object.assign({}, bindings));
    return evaluate(es[es.length-1], rhyme, updatedBindings);
}

function evaluateProgram(ast, rhyme, bindings){
    const updatedBindings =
        ast.es.slice(0, ast.es.length-1).reduce( (acc, e) => {
            const newAcc = Object.assign({}, acc);
            if(e instanceof AST.Assign){
                if(e.e instanceof AST.Func){
                    e.e.selfReference = e.x; //This is kinda wizardy, not sure if I should
                }
                newAcc[e.x] = evaluate(e.e, rhyme, Object.assign({}, acc));
            }
            return newAcc;
        }, Object.assign({}, bindings));
    return evaluate(ast.es[ast.es.length-1], rhyme, updatedBindings);
}

function evaluateFunction(ast, rhyme, bindings, f){

    const es = Array.isArray(ast.es)? ast.es : [ast.es]; //TODO: this is super hacky and wrong!!!
    const selfBindings = {};
    selfBindings[ast.selfReference] = f;
    const updatedBindings =
        es.slice(0, ast.es.length-1).reduce( (acc, e) => {
            const newAcc = Object.assign({}, acc);
            if(e instanceof AST.Assign){
                newAcc[e.x] = evaluate(e.e, rhyme, Object.assign({}, acc));
            }
            return newAcc;
        }, Object.assign({}, bindings, selfBindings));
    return evaluate(es[es.length-1], rhyme, updatedBindings);
}

function evaluateRef(x, rhyme, bindings){
    const val =
        Object.keys(bindings).reduce( (acc, key) => {
            if(acc!==null){
                return acc;
            }
            if(isRhyme(rhyme, key, x)){
                return bindings[key];
            }
            return null;
        }, null);
    if(val===null){
        throw("unbound reference "+x);
    }
    return val;
}

function binaryOperation(op, e1, e2){
  if(op === "*"){
    return e1 * e2;
  }
  if(op === "+"){
    return e1 + e2;
  }
  if(op === "-"){
    return e1 - e2;
  }
  if(op === "/"){
    return e1 / e2;
  }
  if(op === "%"){
      return e1 % e2;
  }
  if(op === "=="){
      return e1 === e2;
  }
  if(op === ">"){
      return e1 > e2;
  }
  if(op === "<"){
      return e1 < e2;
  }
  if(op === "&&"){
      return e1 && e2;
  }
  if(op === "||"){
      return e1 || e2;
  }
}


function detectCodeBlocks(lines, rhyme){
    if(detectInteger(lines, rhyme)){
        return parseInteger(lines);
    }
    if(detectFunction(lines, rhyme)){
        return parseFunction(lines, rhyme);
    }
    if(detectString(lines)){
        return parseString(lines);
    }
    if(detectOperation(lines)){
        return parseOperation(lines);
    }
    if(detectFunctionCall(lines, rhyme)){
        return parseFunctionCall(lines);
    }
    if(detectIfElseBlock(lines, rhyme)){
        return parseIfElseBlock(lines, rhyme);
    }
    const res = lines.reduce( (acc, lineData, idx) => {
        const line = lineData.text;
        if(idx===lines.length-1 && (!acc.openRhyme || !isRhyme(rhyme, acc.openRhyme, getLastWord(line)))){ //TODO: clean this line!!!
            const expression = detectCodeBlocks(acc.currentGroup.concat(lineData), rhyme);
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
        if(isRhyme(rhyme, acc.openRhyme, getLastWord(line))){
            const expression = detectCodeBlocks(acc.currentGroup, rhyme);
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
    }, {openRhyme: null, currentGroup: [], groups: []});
    return res.groups;
}

function detectIfElseBlock(lineData, rhyme){
    const lines = lineData.map((l) => l.text)
    const joined = lines.join('\s');
    if(!ifElseRegex().test(joined)){
        return false;
    }
    const endOfE1Idx =
        lineData.findIndex( (l) => /.*\?/.test(l.text));
    if(endOfE1Idx > 0 && (!isLinesRhyming(rhyme, lines[0], lines[endOfE1Idx]))){
        return false;
    }
    const beginningOfE3Idx =
        lineData.findIndex( (l) => /(otherwise|else).*/.test(l.text))
    if(beginningOfE3Idx < lines.length-1 && !isLinesRhyming(rhyme, lines[beginningOfE3Idx], lines[lines.length-1])){
        return false;
    }
    return true;
}

function parseIfElseBlock(lineData, rhyme){
    const lines = lineData.map( (l) => l.text);
    const endOfE1Idx =
        lines.findIndex( (l) => /.*\?/.test(l));
    const beginningOfE3Idx =
        lines.findIndex( (l) => /(otherwise|else).*/.test(l));
    const e1Lines = lineData.slice(0, endOfE1Idx+1);
    const e2Lines = lineData.slice(endOfE1Idx+1, beginningOfE3Idx );
    const e3Lines = lineData.slice(beginningOfE3Idx);
    const e1 = e1Lines.length===1?
        new AST.Ref(getNthWord(e1Lines[0].text, 0))
        : detectCodeBlocks(cutFirstAndLastLines(e1Lines), rhyme);
    const e2 = e2Lines.length===1?
        new AST.Ref(getNthWord(e2Lines[0].text, 0))
        : detectCodeBlocks(cutFirstAndLastLines(e2Lines), rhyme);
    const e3 = e3Lines.length===1?
        new AST.Ref(getNthWord(e3Lines[0].text, 1))
        : detectCodeBlocks(cutFirstAndLastLines(e3Lines), rhyme);
    return new AST.If(e1, e2, e3);
}

function isLinesRhyming(rhyme, line1, line2){
    const words1 = line1.split(/\s+/);
    const words2 = line2.split(/\s+/);
    return isRhyme(rhyme, words1[words1.length-1], words2[words2.length-1]);
}

function detectReference(lineData){
    return lineData.length===1
        && !detectString(lineData)
        && !detectFunctionCall(lineData);
}

function parseReference(lineData){
    const words = lineData[0].text.split(/\s+/);
    return new AST.Ref(words[0])
}

function parseFunctionCall(lineData){
    const words = lineData[0].text.split(/\s+/);
    return new AST.Call(words[0], words.slice(1));
}

function parseFunction(lineData, rhyme){
    const lines = lineData.map( (l) => l.text);
    const rhymeToEndBody = getLastWord(lines[lines.length-2]);
    const openingBodyIdx =
        lines.findIndex( (l) => isRhyme(rhyme, getLastWord(l), rhymeToEndBody));
    const parameters =
        lines.slice(1, openingBodyIdx).map( (l) => getLastWord(l))
    const body = lineData.slice(openingBodyIdx+1, lines.length-2)
    const expressions = detectCodeBlocks(body, rhyme) ;
    return new AST.Func(parameters, expressions)
}

function parseInteger(lineData){
    if(lineData.length!==2){
        throw("Must call parseInteger on pair of lines")
    }
    const lines = lineData.map( (l) => l.text)
    const words = lines[0].split(/\s+/).concat(lines[1].split(/\s+/));
    const firstLetter = words[0][0].toLowerCase();
    const n = words.reduce( (acc, val) => {
        return val[0].toLowerCase() === firstLetter? (acc+1) : acc;
    }, 0) - 1;
    return new AST.Num(n);
}

function parseOperation(lineData){
    //TODO: handle a line that is too short
    if(lineData.length!==1){
        throw("Must call parseOperation on a single line");
    }
    const line = lineData[0].text;
    const words = line.split(/\s+/);
    const e1 = new AST.Ref(words[0]);
    const e2 = new AST.Ref(words[1]);
    const operativeWord = line.match(operationalWordsRegex())[1];
    const op = mapOperativeWordToOperation(operativeWord);
    return new AST.Operation(e1, e2, op);

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



function cutFirstAndLastLines(lines){
    return lines.slice(0, lines.length-1)
}

function parseString(lineData){
    if(lineData.length!==1){
        throw("Must call parseString on a single line")
    }
    return new AST.Str((lineData[0].text).match(/\"(.*)\"/)[1]);
}

function operationalWordsRegex(){
    return /\s(by|over|give|take|leave|is|more|less|and|or)/;
}

function ifElseRegex(){
    return /(.*)\?(.*)(otherwise|else)(.*)/
}

function detectOperation(lines){
    return lines.length===1 &&
        !/\".*\"/.test(lines[0].text)
        && operationalWordsRegex().test(lines[0].text)
}

function detectString(lines){
    return lines.length===1 &&
        /\".*\"/.test(lines[0].text);
}

function detectInteger(lines, rhyme){
    return lines.length===2 &&
        hasWrappingRhyme(lines, rhyme)
}

function detectFunction(lines, rhyme){
    return lines.length > 5 &&
        hasWrappingInternalRhyme(lines[0].text, rhyme)
        && hasWrappingRhyme(lines, rhyme);
}

function detectFunctionCall(lines, rhyme){
    return lines.length===1 && hasInternalWrappingAlliteration(lines[0].text);
}

function hasInternalWrappingAlliteration(line){
    const words = line.split(/\s+/);
    return words[0][0]===words[words.length-1][0];
}

function hasWrappingRhyme(lines, rhyme){
    return isRhyme(rhyme, getLastWord(lines[0].text), getLastWord(lines[lines.length-1].text));
}

function hasWrappingInternalRhyme(line, rhyme){
    const words = line.split(/\s+/);
    return isRhyme(rhyme, words[0], words[words.length-1]);
}

function getCleanedLines(text){
    return text.split('\n')
        .map( (l) => l.toLowerCase().trim())
        .map( (l, idx) => {return {text: l, lineNumber: idx}})
        .filter( (l) => (l.text!=="" && !/\(.*\)/.test(l.text)))
}

function getLastWord(line){
    const words = line.split(/\s+/);
    return words[words.length-1];
}


function getNthWord(line, n){
    const words = line.split(/\s+/);
    return words[n];
}


function isRhyme(rhyme, word1, word2){
    return rhyme.doRhyme(stripFinalPunctuation(word1), stripFinalPunctuation(word2));
}

function stripFinalPunctuation(word){
    return word.replace(/\b[\.\?\!\,]+/, "");
}

module.exports = {
    interpret: interpret
}
