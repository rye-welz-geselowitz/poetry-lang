const utilities = require('./utilities');
const AST = require('./ast');


function evaluate(ast, rhyme, bindings = {}){    
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
        if(evaluateIfElse(ast.e1, rhyme, bindings)){
            return evaluateIfElse(ast.e2, rhyme, bindings);
        }
        else{
            return evaluateIfElse(ast.e3, rhyme, bindings);
        }
    }
    if(ast instanceof AST.Func){
        var f = function(...args){
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
        const f = evaluateRef(ast.f, rhyme, bindings);
        const ps =
            ast.ps.slice(0, f.numExpectedArguments).map( (p) => evaluate(new AST.Ref(p), rhyme, bindings))
        return f(ps);
    }
    // throw('I dont handle evalauting '+(ast.constructor.name)+' yet!');
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
