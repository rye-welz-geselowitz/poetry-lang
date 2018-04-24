const AST = require('./ast');

function interpret(text, rhyme){
    const ast = parse(text, rhyme);
    return evaluate(ast, rhyme);
}

function parse(text, rhyme){
    const units = unitsFromString(text);
    const es = units.reduce((acc, unit) => {
        return acc.concat(parseUnit(unit, rhyme))
    }, []);
    return new AST.Program(es);
}

function evaluate(ast, rhyme, bindings = {}){
    if(ast instanceof AST.Program){
        const updatedBindings =
            ast.es.reduce( (acc, e) => {
                const newAcc = Object.assign({}, acc);
                if(e instanceof AST.Assign){
                    newAcc[e.x] = evaluate(e.e);
                }
                return newAcc;
            }, {})
        return evaluate(ast.es[ast.es.length-1], rhyme, updatedBindings);
    }
    if(ast instanceof AST.Assign){
        return evaluate(ast.e, rhyme, bindings);
    }
    if(ast instanceof AST.Num){
        return ast.n;
    }
    if(ast instanceof AST.Operation){
        return binaryOperation(ast.op,
            evaluate(ast.e1, rhyme, bindings),
            evaluate(ast.e2, rhyme, bindings));
    }
    if(ast instanceof AST.Ref){
        return evaluateRef(ast.x, rhyme, bindings)
    }
    throw('I dont handle evalauting '+(ast.constructor.name)+' yet!')
}

function evaluateRef(x, rhyme, bindings){
    const val =
        Object.keys(bindings).reduce( (acc, key) => {
            if(acc!==null){
                return acc;
            }
            if(rhyme.doRhyme(key, x)){
                return bindings[key];
            }
            return null;
        }, null);
    if(val===null){
        throw("unbound reference");
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
}


function parseUnit(unit, rhyme){
    const lines = getCleanedLines(unit);
    if(isInteger(lines, rhyme)){
        const {n, x} = parseIntegerReference(lines);
        return new AST.Assign(x, new AST.Num(n) );
    }
    if(isOperation(lines, rhyme)){
        return parseOperation(lines);
    }
    throw("can't parse unit")
}

function parseOperation(lines){
    const ref1 = lastWord(lines[0])
    const ref2 = lastWord(lines[lines.length-1]);
    const operation = mapInterveningLineNumberToOperation(lines.length-2)
    return new AST.Operation(new AST.Ref(ref1), new AST.Ref(ref2), operation);
}



function isOperation(lines, rhyme){
    return lines.length > 1 &&
        !rhyme.doRhyme(lastWord(lines[0]), lastWord(lines[lines.length-1]));
}

function isInteger(lines, rhyme){
    return rhyme.doRhyme(lastWord(lines[0]), lastWord(lines[1])) &&
        lines.length===2;
}

function parseIntegerReference(lines){
    if(lines.length!==2){
        throw("Must call parseInteger on pair of lines")
    }
    const words = lines[0].split(/\s/).concat(lines[1].split(/\s/));
    const firstLetter = words[0][0].toLowerCase();
    const n = words.reduce( (acc, val) => {
        return val[0].toLowerCase() === firstLetter? (acc+1) : acc;
    }, 0) - 1;
    return {
        n: n,
        x: lastWord(lines[0])
    }
}

function lastWord(line){
    const words = line.split(/\s+/);
    return words[words.length-1];
}

function unitsFromString(text){
    return text.replace(/(\n{2,})/g, "\n\n").split("\n\n");
}


function getCleanedLines(text){
	return text.split(/[\r\n]+/)
			.map((line) => cleanLine(line))
			.filter((line) => line!== "")
}

function cleanLine(line){
    return line.trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g,'')
        .replace(/\s{2,}/g," ")
}

function mapInterveningLineNumberToOperation(n){
    switch(n){
      case 0:
        return "+"
      case 1:
        return "-"
      case 2:
        return "*"
      case 3:
        return "/"
    }
    throw("invalid operation "+n);
}

module.exports = {
    interpret: interpret
}
