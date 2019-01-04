import assert from 'assert';
import {parse, getInputVector, clearInputVectot} from '../src/js/Parse';
import {parseCode} from '../src/js/code-analyzer';
import {clearBlocker, getBlocks, initIV, makeBlock} from '../src/js/Blocker';
import {clearColorBlocks, colorBlocks, getColorBlocks} from '../src/js/Color';

function test_Struct(test, result){
    clearAll();
    let parsedCode = parseCode(test);
    let program = parse(parsedCode);
    let input_vector = getInputVector();
    initIV(input_vector);
    makeBlock(program);
    colorBlocks(getBlocks(), input_vector);
    let blocks = getColorBlocks();
    assert.equal(JSON.stringify(blocks), JSON.stringify(result));
}

function clearAll() {
    clearInputVectot();
    clearBlocker();
    clearColorBlocks();
}

describe('make CFG', () => {
    it('should make CFG from first example', () => {
        test_Struct('function foo(x, y, z){\nlet a = x + 1;\nlet b = a + y;\nlet c = 0;\n\nif (b < z) {\nc = c + 5;\n} else if (b < z * 2) {\nc = c + x + 5;\n} else {\nc = c + z + 5;\n}\n\nreturn c;\n}\nfoo(1, 2 ,3)',
            [{'number': 1,'lines': ['a = (x + 1)','b = (a + y)','c = 0'],'color': 'green','shape': 'square','arrows': [2]},{'number': 2,'lines': ['b < z'],'color': 'green','shape': 'diamond','arrows': [['T',3],['F',4]]},{'number': 3,'lines': ['c = (c + 5)'],'color': 'black','shape': 'square','arrows': [7]},{'number': 4,'lines': ['b < (z * 2)'],'color': 'green','shape': 'diamond','arrows': [['T',5],['F',6]]},{'number': 5,'lines': ['c = ((c + x) + 5)'],'color': 'black','shape': 'square','arrows': [7]},{'number': 6,'lines': ['c = ((c + z) + 5)'],'color': 'green','shape': 'square','arrows': [7]},{'number': 7,'lines': [],'color': 'green','shape': 'oval','arrows': [8]},{'number': 8,'lines': ['return c'],'color': 'green','shape': 'square','arrows': ['END']}]);
    });

    it('should make CFG from first example with more lines', () => {
        test_Struct('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if (b < z) {c = c + 5;c = c + 5;} else if (b < z * 2) {c = c + x + 5;c = c + x + 5;} else {c = c + z + 5;c = c + z + 5;}return c;}foo(1, 2 ,3)',
            [{'number': 1,'lines': ['a = (x + 1)','b = (a + y)','c = 0'],'color': 'green','shape': 'square','arrows': [2]},{'number': 2,'lines': ['b < z'],'color': 'green','shape': 'diamond','arrows': [['T',3],['F',4]]},{'number': 3,'lines': ['c = (c + 5)','c = (c + 5)'],'color': 'black','shape': 'square','arrows': [7]},{'number': 4,'lines': ['b < (z * 2)'],'color': 'green','shape': 'diamond','arrows': [['T',5],['F',6]]},{'number': 5,'lines': ['c = ((c + x) + 5)','c = ((c + x) + 5)'],'color': 'black','shape': 'square','arrows': [7]},{'number': 6,'lines': ['c = ((c + z) + 5)','c = ((c + z) + 5)'],'color': 'green','shape': 'square','arrows': [7]},{'number': 7,'lines': [],'color': 'green','shape': 'oval','arrows': [8]},{'number': 8,'lines': ['return c'],'color': 'green','shape': 'square','arrows': ['END']}]);
    });

    it('should make CFG from second example', () => {
        test_Struct('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;while (a < z) {c = a + b;z = c * 2;a++;}return z;}foo(1, 2 ,3)',
            [{'number': 1,'lines': ['a = (x + 1)','b = (a + y)','c = 0'],'color': 'green','shape': 'square','arrows': [2]},{'number': 2,'lines': ['Null'],'color': 'green','shape': 'square','arrows': [3]},{'number': 3,'lines': ['a < z'],'color': 'green','shape': 'diamond','arrows': [['T',4],['F',5]]},{'number': 4,'lines': ['c = (a + b)','z = (c * 2)','a + a + 1'],'color': 'black','shape': 'square','arrows': [2]},{'number': 5,'lines': ['return z'],'color': 'green','shape': 'square','arrows': ['END']}]);
    });

    it('should make CFG from second example with more lines', () => {
        test_Struct('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;let str = \'\';while (a < z) {c = a + b;z = c * 2;str += \'!\';a++;}return z;}foo(1, 2 ,3)',
            [{'number': 1,'lines': ['a = (x + 1)','b = (a + y)','c = 0','str = '],'color': 'green','shape': 'square','arrows': [2]},{'number': 2,'lines': ['Null'],'color': 'green','shape': 'square','arrows': [3]},{'number': 3,'lines': ['a < z'],'color': 'green','shape': 'diamond','arrows': [['T',4],['F',5]]},{'number': 4,'lines': ['c = (a + b)','z = (c * 2)','str += !','a + a + 1'],'color': 'black','shape': 'square','arrows': [2]},{'number': 5,'lines': ['return z'],'color': 'green','shape': 'square','arrows': ['END']}]);
    });

    it('if without else', () => {
        test_Struct('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;if(a < z) {c = a + b;z = c * 2;str += \'!\';a++;}return z;}foo(1, 2 ,3)',
            [{'number': 1,'lines': ['a = (x + 1)','b = (a + y)','c = 0'],'color': 'green','shape': 'square','arrows': [2]},{'number': 2,'lines': ['a < z'],'color': 'green','shape': 'diamond','arrows': [['T',3],['F',4]]},{'number': 3,'lines': ['c = (a + b)','z = (c * 2)','str += !','a + a + 1'],'color': 'black','shape': 'square','arrows': [4]},{'number': 4,'lines': [],'color': 'green','shape': 'oval','arrows': [5]},{'number': 5,'lines': ['return z'],'color': 'green','shape': 'square','arrows': ['END']}]);
    });

    it('parse array', () => {
        test_Struct('function foo(x, y, z){let a = x + 1;let b = a + y;let c = 0;let f = [true];if(a < z) {c = a + b;z = c * 2;str += \'!\';a++;}return z;}foo(1, 2 ,3)\n',
            [{'number': 1,'lines': ['a = (x + 1)','b = (a + y)','c = 0','f = true'],'color': 'green','shape': 'square','arrows': [2]},{'number': 2,'lines': ['a < z'],'color': 'green','shape': 'diamond','arrows': [['T',3],['F',4]]},{'number': 3,'lines': ['c = (a + b)','z = (c * 2)','str += !','a + a + 1'],'color': 'black','shape': 'square','arrows': [4]},{'number': 4,'lines': [],'color': 'green','shape': 'oval','arrows': [5]},{'number': 5,'lines': ['return z'],'color': 'green','shape': 'square','arrows': ['END']}]);
    });

    it('eval array', () => {
        test_Struct();
    });
});
