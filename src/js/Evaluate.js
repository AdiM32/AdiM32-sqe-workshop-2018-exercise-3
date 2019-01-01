const char_to_keep = ['(', ')', '[', ']', '+', '-', '=', '<', '>', '*', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function evaluateTest(test, iv){
    let temp = '';

    for (let i = 0; i<test.length; i++){
        if (toKeep(test[i])){
            temp += test[i];
        }
        else if (test[i] === ' '){
            continue;
        }
        else {
            let j = findEndOfName(test, i);
            let val = getValue(test.substr(i, j-i), iv);
            val = fixVal(val);
            i = j - 1;
            temp += val;
        }
    }
    return eval(temp);
}

function fixVal(val) {
    let res = '';
    if (Array.isArray(val)){
        res += '[';
        val.forEach((e) => res += fixVal(e) + ', ');
        res = res.substr(0, res.length - 2) + ']';
    } else if (typeof val === 'string'){
        res += '"' + val + '"';
    } else
        res = val;
    return res;
}

function toKeep(char) {
    let index = char_to_keep.indexOf(char);
    return  index !== -1;
}

function findEndOfName(string, i) {
    let j = i + 1;
    let string_j = string[j];
    while (j < string.length && string_j !== ' ' && string_j !== ')' && string_j !== '[') {
        j++;
        string_j = string[j];
    }
    return j;
}

function getValue(name, iv) {
    for(let i = 0; i<iv.length; i++){
        if (iv[i].name === name){
            return iv[i].value;
        }
    }
}

export {evaluateTest};