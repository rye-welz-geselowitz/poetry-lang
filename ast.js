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

function Func(ps, es){
    this.ps = ps;
    this.es = es;
}

function Call(f, ps){
    this.f = f;
    this.ps = ps;
}

function If(e1, e2, e3){
    this.e1 = e1;
    this.e2 = e2;
    this.e3 = e3;
}

function Str(val){
    this.val=val;
}

module.exports = {
    Program: Program,
    Num: Num,
    Ref: Ref,
    Assign: Assign,
    Operation: Operation,
    Func: Func,
    If: If,
    Call: Call,
    Str: Str
}
