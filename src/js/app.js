import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {clearView, buildView} from './View';
import {getInputVector, clearInputVectot, parse} from './Parse';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        clearInputVectot();
        clearView();
        let program = parse(parsedCode);
        let input_vactor = getInputVector();
        buildView(input_vactor);
        $('#parsedCode').val(JSON.stringify(program, null, 2));
    });
});