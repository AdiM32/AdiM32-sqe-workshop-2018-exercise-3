import {Var} from './Structs';
import {evaluateTest} from './Evaluate';

let blocks = [];
let input_vector = [];

function colorBlocks(_blocks, _input_vector) {
    blocks = _blocks;
    input_vector = _input_vector;
    runOnGraphFrom(1);
}

function runOnGraphFrom(block_number) {
    if (block_number === 'END')
        return;
    for (let i=0; i<blocks.length; i++)
        if (blocks[i].number === block_number) {
            blocks[i].color = 'green';
            if (blocks[i].shape !=='diamond'){
                UpdateIV(blocks[i].lines);
                runOnGraphFrom(blocks[i].arrows[0]);
                break;
            }
            else {
                findNextBlock(blocks[i]);
            }
        }
}

function findNextBlock(block) {
    let res = evaluateTest(block.lines[0], input_vector);
    let true_arrow = block.arrows[0][0] === 'T'? 0 : 1;
    if (res)
        runOnGraphFrom(block.arrows[true_arrow][1]);
    else
        runOnGraphFrom(block.arrows[1 - true_arrow][1]);
}

function UpdateIV(lines) {
    lines.forEach((l) => {
        if (l.type === 'Let')
            input_vector.push(Var(l.name, l.init));
    });
}

function getColorBlocks(){
    return blocks;
}

function clearColorBlocks() {
    blocks = [];
    input_vector = [];
}

export {colorBlocks, getColorBlocks, clearColorBlocks};