import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearView, buildView} from './View';
import {getInputVector, clearInputVectot, parse} from './Parse';
import {clearBlocker, makeBlock, getBlocks, initIV} from './Blocker';
import {colorBlocks, clearColorBlocks, getColorBlocks} from './Color.js';
import Viz from 'viz.js';
import {Module,render} from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        clearAll();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let program = parse(parsedCode);
        let intput_vector = getInputVector();
        let blocks = makeAndColorBlocks(program, intput_vector);
        let dotGraph = 'digraph cfg { forcelabels=true\n {' + buildView(blocks) +'} }';
        let viz = new Viz({Module,render});
        viz.renderSVGElement(dotGraph)
            .then(function (element) {
                $('#color_CFG').innerHTML = '';
                $('#color_CFG').find('*').remove();
                $('#color_CFG').append(element);
            });
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