import {Var, Function, Program, Let, If, Assignment, Return, While, Call} from './Structs';

let input_vector = {};

// noinspection JSAnnotator
const type_func = {'Program': (pc) => Program('Program', parseBody(pc.body)),
    'FunctionDeclaration': (pc) => parseFunctionDeclaration(pc.id.name, pc.params, pc.body),
    'VariableDeclaration': (pc) => parseVariableDeclaration(pc.declarations),
    'IfStatement': (pc) => parseIfStatement('If', pc.test, pc.consequent, pc.alternate),
    'ElseIfStatement': (pc) => parseIfStatement('ElseIf', pc.test, pc.consequent, pc.alternate),
    'BlockStatement': (pc) => parseBody(pc.body),
    'CallExpression': (pc) => parseCallExpression(pc.callee.name, pc.arguments),
    'ExpressionStatement': (pc) => parse(pc.expression),
    'AssignmentExpression': (pc) => parseAssignmentExpression(pc.left, pc.operator, pc.right),
    'ReturnStatement': (pc) => parseReturnStatement(pc.argument),
    'WhileStatement': (pc) => parseWhileStatement(pc.test, pc.body)};

const sideType_func = {'Identifier': (s) => s.name,
    'Literal': (s) => {return s.value;},
    'BinaryExpression': (s) => {return '(' + parseBinaryExpression(s) + ')';},
    'MemberExpression': (s) => {return s.object.name + '[' + parseOneSide(s.property) + ']';},
    'ArrayExpression': (s) => parseArrayExpression(s.elements)};

function parse(parsecode) {
    if (parsecode.type in type_func) {
        return type_func[parsecode.type](parsecode);
    }
}

function parseBody(body) {
    let _body = [];
    body.forEach((b) => _body.push(parse(b)));
    return _body;
}

function parseFunctionDeclaration(name, params, body){
    let _params = [];
    params.forEach((p) => {_params.push(p.name);});
    let _body = parse(body);
    let func = Function('Function', _params, _body);
    input_vector.push(Var(name, func));
    return func;
}

function parseVariableDeclaration(declarations) {
    let _declarations = [];
    declarations.forEach((element) => _declarations.push(Let('Let', element.id.name,
        element.init === null? null : parseOneSide(element.init))));
    return _declarations;
}

function parseOneSide(side) {
    return sideType_func[side.type](side);
}

function parseBinaryExpression(binaryExpression) {
    return parseOneSide(binaryExpression.left) + ' ' +
        binaryExpression.operator + ' ' +
        parseOneSide(binaryExpression.right);
}

function parseArrayExpression(elements) {
    let _elements = [];
    elements.forEach((e) => _elements.push(parseOneSide(e)));
    return _elements;
}

function parseIfStatement(type, test, than, alternate){
    let _test = parseBinaryExpression(test);
    let _than = parse(than);
    let _else = null;
    if (alternate !== null) {
        if (alternate.type === 'IfStatement') {
            alternate.type = 'ElseIfStatement';
        }
        _else = parse(alternate);
    }
    return If(type, _test, _than, _else);
}

function parseAssignmentExpression(left, operator, right) {
    let _left = left.name;
    let _right = parseOneSide(right);
    return Assignment('Assignment', _left, operator, _right);
}

function parseReturnStatement(argument) {
    return Return('Return', parseOneSide(argument));
}

function parseWhileStatement(test, body) {
    let _test = parseBinaryExpression(test);
    let _body = parse(body);
    return While('While', _test, _body);
}

function clearInputVectot() {
    input_vector = [];
}

function getInputVector() {
    return input_vector;
}

function parseCallExpression(callee, args) {
    let _args = [];
    args.forEach((arg) => _args.push(parseOneSide(arg)));
    for (let i = 0; i<input_vector.length; i++){
        if (input_vector[i].name === callee){
            if (input_vector[i].value.type === 'Function') {
                insertToIV((input_vector[i].value.params), _args);
                break;
            }
        }
    }
    return Call('Call', callee, _args);
}

function insertToIV(params, args) {
    for (let i = 0; i<params.length; i++){
        input_vector.push(Var(params[i], args[i], false));
    }
}

export {getInputVector, parse, clearInputVectot};