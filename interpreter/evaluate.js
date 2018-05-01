const utilities = require('./utilities');
const AST = require('./ast');


function evaluate(ast, rhyme, bindings = {}){
    const evaluators = [evaluateProgram, evaluateNumber, evaluateString,
        evaluateAssignment, evaluateOperation, evaluateRef, evaluateIfElse,
        evaluateFunction, evaluateCall];
    return evaluators
            .reduce( (acc, f) => acc!==null? acc : f(ast, rhyme, bindings), null)
}

function evaluateCall(ast, rhyme, bindings){
    if(ast instanceof AST.Call){
        const f = evaluateRefHelper(ast.f, rhyme, bindings);
        const ps =
            ast.ps.slice(0, f.numExpectedArguments)
            .map( (p) => evaluate(new AST.Ref(p), rhyme, bindings))
        return f(ps);
    }
    return null;
}

function evaluateAssignment(ast, rhyme, bindings){
    if(ast instanceof AST.Assign){
        return evaluate(ast.e, rhyme, bindings);
    }
    return null;
}

function evaluateOperation(ast, rhyme, bindings){
    if(ast instanceof AST.Operation){
        return binaryOperation(ast.op,
                evaluate(ast.e1, rhyme, bindings),
                evaluate(ast.e2, rhyme, bindings));
    }
    return null;
}

function evaluateNumber(ast){
    if(ast instanceof AST.Num){
            return ast.n;
    }
    return null;
}

function evaluateString(ast){
    if(ast instanceof AST.Str){
        return ast.val;
    }
    return null;
}

function evaluateIfElse(ast, rhyme, bindings){
    if(ast instanceof AST.If){
        if(evaluateExpressions(ast.e1, rhyme, bindings)){
            return evaluateExpressions(ast.e2, rhyme, bindings);
        }
        else{
            return evaluateExpressions(ast.e3, rhyme, bindings);
        }
    }
    return null;
}
function evaluateProgram(ast, rhyme, bindings){
    if(ast instanceof AST.Program){
        return evaluateExpressions(ast.es, rhyme, bindings);
    }
    return null;
}

function evaluateFunction(ast, rhyme, bindings){
    if(ast instanceof AST.Func){
        var f = function(...args){
          const newBindings
            = ast.ps.reduce( (acc, p, idx) => {
                const newAcc = Object.assign({}, acc);
                newAcc[p] = args[0][idx]
                return newAcc;
            }, Object.assign({}, bindings));
          const selfBindings = Object.assign({}, newBindings);
          selfBindings[ast.selfReference] = f;
          return evaluateExpressions(ast.es, rhyme, selfBindings)
        }
        f.numExpectedArguments = ast.ps.length;
        return f;
    }
    return null;
}

function evaluateRef(ast, rhyme, bindings){
    if(ast instanceof AST.Ref){
        return evaluateRefHelper(ast.x, rhyme, bindings);
    }
    return null;
}

function evaluateRefHelper(x, rhyme, bindings){
    const val =
        Object.keys(bindings).reduce( (acc, key) => {
            if(acc!==null){
                return acc;
            }
            if(utilities.isRhyme(rhyme, key, x)){
                return bindings[key];
            }
            return null;
        }, null);
    if(val===null){
        throw("unbound reference "+x);
    }
    return val;
}

function evaluateExpressions(esOriginal, rhyme, bindings){
    const es = Array.isArray(esOriginal)? esOriginal : [esOriginal]; //TODO: this is hacky - fix parser?
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

module.exports={
    evaluate: evaluate
}
