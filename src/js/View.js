function buildView(blocks) {
    let digraph = '';
    // make Arrows
    blocks.forEach((block) => digraph += buildBlockView(block));

    // shape nodes
    blocks.forEach((block) => digraph += block.number + ' [shape=' + block.shape + ', color=' + block.color + '];\n');

    // color nodes
    blocks.forEach((block) => digraph += block.number + ' [color=' + block.color + '];\n');
    blocks.forEach((block) => digraph += block.color === 'green'? block.number + '[style=filled];\n' : '');

    // make nodes labels
    blocks.forEach((block) => digraph += block.number + ' [label="' + block.number + '\n' + makeLabel(block.lines) + '"];\n');
    return digraph;
}

function makeLabel(lines) {
    let label = '';
    lines.forEach((line) => label += line + '\n');
    label.substr(0, label.length-2);
    return label;
}

function buildBlockView(block) {
    let block_arrows = '';
    block.arrows.forEach((arrow) => {
        Array.isArray(arrow)? block_arrows += makeArrowWithLabel(block.number, arrow[1], arrow[0]):
            block_arrows += makeArrow(block.number, arrow);
    });
    return block_arrows;
}

function makeArrowWithLabel(from, to, label) {
    let res = makeArrow(from, to);
    res = res.substr(0, res.length-2);
    res += '[label=' + label + '];';
    return res;
}

function makeArrow(from, to) {
    if (to === 'END')
        return '';
    return from + '->' + to + ';\n';
}
export {buildView};