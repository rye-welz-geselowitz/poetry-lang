const parse = require('./parse');
const evaluate = require('./evaluate');

function interpret(text, rhyme){
    const lineData = getCleanedLines(text);
    let ast = parse.parse(lineData, rhyme);
    return evaluate.evaluate(ast, rhyme);
}

function getCleanedLines(text){
    return text.split('\n')
        .map( (l) => l.trim())  
        .map( (l, idx) => {return {text: l, lineNumber: idx}})
        .filter( (l) => (l.text!=="" && !/\(.*\)/.test(l.text)))
}




module.exports = {
    interpret: interpret
}
