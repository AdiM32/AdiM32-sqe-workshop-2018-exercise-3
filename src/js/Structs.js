const buildStruct = (...keys) => ((...values) => keys.reduce((obj, key, i) => {obj[key] = values[i]; return obj;} , {}));

const Var = buildStruct('name', 'value');

const Program = buildStruct('type', 'body');
const Function = buildStruct('type', 'params', 'body');
const If = buildStruct('type', 'test', 'then', 'else');
const Call = buildStruct('type', 'callee', 'args');
const Assignment = buildStruct('type', 'left', 'op', 'right');
const Return = buildStruct('type', 'argument');
const While = buildStruct('type', 'test', 'body');
const Let = buildStruct('type', 'name', 'init');

const Line = buildStruct('string', 'color', 'tabs');


export {Var, Program, Function, If, Call, Assignment, Return, While, Line, Let};