/*220501001 Hatice Reyhan Caliskan 220501009 Betul Canol*/
let types = {
    input: 'INPUT',
    output: 'OUTPUT',
    and: 'AND',
    or: 'OR',
    not: 'NOT',
    nand: 'NAND',
    nor: 'NOR',
    xor: 'XOR',
    xnor: 'XNOR',
    buffer: 'BUFFER',
}
/* In this part we used boole operatşons for the code to be easier*/
let operations = {
    INPUT: '',
    OUTPUT: 'a',
    AND: '(a & b)',
    OR: '(a | b)',
    NOT: '(!a)',
    NAND: '(!(a & b))',
    NOR: '(!(a | b))',
    XOR: '(a ^ b)',
    XNOR: '(!(a ^ b))',
    BUFFER: 'a',
}
let nodeData = {};
let id = 0; /*Each object gets a unique identifier*/

/*Classes */
class Node{
    constructor(type, inp, out, x = 100, y = 100, w, h){
        this.id = Date.now() + id++;
        this.type = type;
        this.input = inp;
        this.output = out;
        this.x = x; this.y = y;
        this.h = h ?? (max(this.input, this.output) * 15) + 20;
        this.w = w ?? this.type.length * 10 + 30;
        this.outputNodes = new Array(out).fill(null);
        this.inputVal = new Array(this.input).fill(0);
        this.inputPos = evenlySpreadPoints(-this.w/2, -this.h/2, -this.w/2, this.h/2, this.input);
        this.outputPos = evenlySpreadPoints(this.w/2, -this.h/2, this.w/2, this.h/2, this.output);
        this.isCombinational = true;
        this.gateDelay = 10;
    }
    move(x, y){
        this.x = x;
        this.y = y;
    }
    setInput(val, index){
        this.inputVal[index] = val;
    }
    show(col){
        fill(col?? '#6faffc')
        rectMode(CENTER)
        rect(this.x, this.y, this.w, this.h)
        fill('#fff')
        textAlign(CENTER, CENTER)
        text(this.name != undefined? this.name.replace("_", "\n") : this.type.replace("_", "\n"), this.x, this.y)
        push();
        textAlign(RIGHT);
        textSize(10)
        for (let i = 0; i < this.outputPos.length; i++) {
            rect(this.x+this.outputPos[i].x, this.y+this.outputPos[i].y, 12, 10);
            if(this.outputNames?.[i]){
                text(this.outputNames[i], this.x+this.outputPos[i].x - 10, this.y+this.outputPos[i].y);
            }
        }
        textAlign(LEFT);
        for (let i = 0; i < this.inputPos.length; i++) {
            rect(this.x+this.inputPos[i].x, this.y+this.inputPos[i].y, 12, 10);
            if(this.inputNames?.[i]){
                text(this.inputNames[i], this.x+this.inputPos[i].x + 10, this.y+this.inputPos[i].y);
            }
        }
        pop();
        if(this.outputNodes){
            for (let i = 0; i < this.outputNodes.length; i++) {
                let out = this.outputNodes[i];
                if(!out) continue;
                line(this.x+this.outputPos[i].x, this.y+this.outputPos[i].y, out.node.x+out.node.inputPos[out.index].x, out.node.y+out.node.inputPos[out.index].y);
            }
        }
    }
}
class INPUT extends Node{
    constructor(x, y){
        super(types.input, 0, 1, x, y); /*0 input, 1 output*/
        this.state = false;
    }
    operate(){
        this.outputNodes[0]?.node.setInput(this.state? 1:0, this.outputNodes[0].index)
    }
    onclick(){
        this.state = !this.state;
    }
    show(){
        super.show(this.state? '#922' : '#f77ec1');
    }
}
class OUTPUT extends Node{
    constructor(x, y){
        super(types.output, 1, 0, x, y); /*1 input, 0 output*/
        this.state = false;
    }
    operate(){
        this.state = Boolean(this.inputVal[0])
    }
    show(){
        super.show(this.state? '#922' : '#f77ec1');
    }
}
class AND extends Node{
    constructor(x, y){
        super(types.and, 2, 1, x, y); /*2 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class OR extends Node{
    constructor(x, y) {
        super(types.or, 2, 1, x, y); /*2 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NOT extends Node{
    constructor(x, y) {
        super(types.not, 1, 1, x, y); /*1 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NAND extends Node{
    constructor(x, y) {
        super(types.nand, 2, 1, x, y); /*2 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class NOR extends Node{
    constructor(x, y) {
        super(types.nor, 2, 1, x, y); /*2 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class XOR extends Node{
    constructor(x, y) {
        super(types.xor, 2, 1, x, y); /*2 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class XNOR extends Node{
    constructor(x, y) {
        super(types.xnor, 2, 1, x, y); /*2 input, 1 output*/
    }
    operate(){
        let a = this.inputVal[0], b = this.inputVal[1];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay)
    }
}
class BUFFER extends Node {
    constructor(x, y) {
        super(types.buffer, 1, 1, x, y); /*1 input, 1 output*/
    }
    operate() {
        let a = this.inputVal[0];
        propagateOutput(this.outputNodes[0], eval(operations[this.type]), this.gateDelay);
    }
}

function evenlySpreadPoints(x1, y1, x2, y2, n){
    let dtx = abs(x1 - x2) / n;
    let dty = abs(y1 - y2) / n;
    let points = [];
    for(let i = 1; i <= n; i++){
        let obj = {
            x: x1 + (i * dtx) - (dtx / 2),
            y: y1 + (i * dty) - (dty / 2),
        }
        points.push(obj);
    }
    return points;
}

function propagateOutput(output, val, delay){
    if (!output) return;
    setTimeout(() => {
        output.node.setInput(val, output.index);
    }, delay);
}

function isInsideRect(cx, cy, w, h, x, y, tx = 0, ty = 0){
    return !(x-tx > cx+w/2 || x-tx < cx-w/2 || y-ty > cy+h/2 || y-ty < cy-h/2);
}