import {Block} from './Structs';

let block_number = 1;
let blocks = [];
let input_vector = [];

const type_func = {'Program': (p) => p.body.forEach((b) => makeBlock(b)),
    'Call': (c) => makeBlockCall(c.callee),
    'Function': (f) => makeBlockFunction(f.body),
    'If': (_if) => makeBlockIf(_if.type, _if.test, _if.than, _if.else),
    'ElseIf': (_if) => makeBlockIf(_if.type, _if.test, _if.than, _if.else),
    'While': (_while) => makeBlockWhile(_while.test, _while.body)};

const makeLine = {'Let': (l) => l.name + ' = ' + l.init,
    'Return': (r) => 'return ' + r.argument,
    'Assignment': (a) => a.left + ' ' + a.op + ' ' + a.right};

function clearBlocker() {
    block_number = 1;
    blocks = [];
    input_vector = [];
}

function makeBlock(program) {
    type_func[program.type](program);
}

function makeBlockBody(body, end_point) {
    let lines = [];
    for (let i=0; i<body.length; i++){
        if (body[i].type !== 'If' && body[i].type !== 'While')
            lines.push(makeLine[body[i].type](body[i]));
        else{
            createBlock(lines, 'square', [block_number+1]);
            lines = [];
            makeBlock(body[i]);
        }
    }
    createBlock(lines, 'square', [end_point]);
}

function makeBlockCall(callee) {
    for (let i = input_vector.length - 1; i>=0; i--){
        if (input_vector[i].name === callee && input_vector[i].value.type === 'Function'){
            makeBlock(input_vector[i].value);
            break;
        }
    }
}

function makeBlockFunction(body) {
    makeBlockBody(body, 'END');
}

function makeBlockWhile(test, body){
    let nullBlock = block_number;
    createBlock(['Null'], 'square', [block_number+1]);
    let testBlock = block_number;
    createBlock([test], 'diamond', [['T', block_number+1], ['F', null]]);
    makeBlockBody(body, nullBlock);
    blocks.forEach((block) => {if (block.number === testBlock) {block.arrows[1][1] = block_number;}});
}

function makeBlockIf(type, test, than, _else) {
    let testBlock = block_number;
    createBlock([test], 'diamond', [['T', block_number+1], ['F', block_number+than.length+1]]);
    makeBlockBody(than, null);
    blocks.forEach((block) => {if (block.number === testBlock) {block.arrows[1][1] = block_number;}});
    if (_else !== null)
        if (Array.isArray(_else)){
            makeBlockBody(_else, null);
        }
        else
            makeBlock(_else);
    if (type === 'If'){
        updateMergePoint();
        createBlock([], 'oval', [block_number+1]);
    }
}

function updateMergePoint() {
    for(let i=0; i<blocks.length; i++)
        if (blocks[i].arrows === null || blocks[i].arrows[0] === null)
            blocks[i].arrows = [block_number];
}

function createBlock(lines, shape, arrows) {
    blocks.push(Block(block_number, lines, 'black', shape, arrows));
    block_number++;
}

function getBlocks() {
    return blocks;
}

function initIV(iv) {
    input_vector = iv;
}

export {makeBlock, clearBlocker, getBlocks, initIV};