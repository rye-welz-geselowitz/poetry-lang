function Program(es){
    this.es = es;
}

function Assign(x, e){
    this.x = x;
    this.e = e;
}

function Num(n){
    this.n = n;
}

function Ref(x){
    this.x = x;
}

function Operation(e1, e2, op){
    this.e1 = e1;
    this.e2 = e2;
    this.op = op;
}

module.exports = {
    Program: Program,
    Num: Num,
    Ref: Ref,
    Assign: Assign,
    Operation: Operation
}
