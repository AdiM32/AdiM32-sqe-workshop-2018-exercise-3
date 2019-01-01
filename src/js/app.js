import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearView, buildView} from './View';
import {getInputVector, clearInputVectot, parse} from './Parse';
import {clearBlocker, makeBlock, getBlocks, initIV} from './Blocker';
import {colorBlocks, clearColorBlocks, getColorBlocks} from './Color.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        clearAll();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let program = parse(parsedCode);
        let intput_vector = getInputVector();
        let blocks = makeAndColorBlocks(program, intput_vector);
        buildView(blocks);
        $('#parsedCode').val(JSON.stringify(program, null, 2));
    });
});

function clearAll() {
    clearInputVectot();
    clearView();
    clearBlocker();
    clearColorBlocks();
}

function makeAndColorBlocks(program, intput_vector){
    initIV(intput_vector);
    makeBlock(program);
    colorBlocks(getBlocks(), intput_vector);
    return getColorBlocks();
}