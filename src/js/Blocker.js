import {Block} from './Structs';

let block_number = 1;
let blocks = [];
let intput_vector = [];

const type_func = {'Program': (p) => makeBlockBody(p.body),
    'Call': (c) => makeBlockCall(c.callee),
    'Function': (f) => makeBlockFunction(f.body),
    'If': (_if) => makeBlockIf(_if.type, _if.test, _if.than, _if.else),
    'ElseIf': (_if) => makeBlockIf(_if.type, _if.test, _if.than, _if.else),
    'Assignment': (a) => createBlock([a], 'square', null)};

function clearBlocker() {
    block_number = 1;
    blocks = [];
    intput_vector = [];
}

function makeBlock(program) {
    if (program.type in type_func)
        type_func[program.type](program);
}

function makeBlockBody(body) {
    body.forEach((b) => makeBlock(b));
}

function makeBlockCall(callee) {
    for (let i = 0; i<intput_vector.length; i++){
        if (intput_vector[i].name === callee){
            if (intput_vector[i].value.type === 'Function') {
                makeBlock(intput_vector[i].value);
                break;
            }
        }
    }
}

function makeBlockFunction(body) {
    let lines = [];
    for (let i=0; i<body.length; i++){
        if (body[i].type !== 'If')
            lines.push(body[i]);
        else{
            createBlock(lines, 'square', [block_number+1]);
            lines = [];
            makeBlock(body[i]);
        }
    }
    if (lines !== []){
        createBlock(lines, 'square', ['END']);
    }
}

function makeBlockIf(type, test, than, _else) {
    createBlock([test], 'diamond', [['T', block_number+1], ['F', block_number+than.length+1]]);
    makeBlockBody(than);
    if (_else !== null)
        if (Array.isArray(_else))
            makeBlockBody(_else);
        else
            makeBlock(_else);
    if (type === 'If'){
        updateMergePoint();
        createBlock([], 'circle', [block_number+1]);
    }
}

function updateMergePoint() {
    for(let i=0; i<blocks.length; i++)
        if (blocks[i].arrows === null)
            blocks[i].arrows = [block_number];
}

function createBlock(lines, shape, arrows) {
    blocks.push(Block(block_number, lines, 'white', shape, arrows));
    block_number++;
}

function getBlocks() {
    return blocks;
}

function initIV(iv) {
    intput_vector = iv;
}

export {makeBlock, clearBlocker, getBlocks, initIV};