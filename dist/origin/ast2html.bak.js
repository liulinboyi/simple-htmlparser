"use strict";
var ast = {
    type: "root",
    children: [{
            type: "text",
            content: "\r\n"
        }, {
            type: "node",
            tag: "main",
            attrs: [{
                    name: "haha"
                }],
            level: 0,
            children: [{
                    type: "text",
                    content: "\r\n"
                }, {
                    type: "node",
                    tag: "div",
                    level: 1,
                    children: [{
                            type: "node",
                            tag: "span",
                            level: 2,
                            children: [{
                                    type: "node",
                                    tag: "a",
                                    attrs: [{
                                            id: "link",
                                            class: "link"
                                        }],
                                    level: 3,
                                }]
                        }, {
                            type: "node",
                            tag: "span",
                            level: 2,
                        }]
                },
                {
                    type: "text",
                    content: "\r\n"
                },
                {
                    type: "node",
                    tag: "div",
                    level: 1,
                    children: [{
                            type: "node",
                            tag: "span",
                            level: 2,
                            children: [{
                                    type: "node",
                                    tag: "a",
                                    children: [{
                                            type: "text",
                                            content: "小明"
                                        }],
                                    level: 3,
                                }]
                        }, {
                            type: "node",
                            tag: "span",
                            level: 2,
                        }]
                }, {
                    type: "text",
                    content: "\r\n"
                }
            ]
        }]
};
// let stack = [ast]
function process(ast, parent) {
    if (ast.children || ast.type === "root") {
        for (var _i = 0, _a = ast.children; _i < _a.length; _i++) {
            var item = _a[_i];
            item.parent = parent;
            process(item, item);
        }
    }
}
process(ast, null);
// let stack = []
// // 深度遍历
// function getAll(ast) {
//     if (ast.children) {
//         for (let item of ast.children) {
//             // stack.push(item)
//             getAll(item)
//             stack.push(item)
//         }
//     }
// }
// getAll(ast)
// stack.push(ast)
function generate(ast) {
    var stack = [];
    // 深度遍历
    function getAll(ast) {
        if (ast.children) {
            for (var _i = 0, _a = ast.children; _i < _a.length; _i++) {
                var item = _a[_i];
                // stack.push(item)
                getAll(item);
                stack.push(item);
            }
        }
    }
    getAll(ast);
    stack.push(ast);
    for (var index = 0; index < stack.length;) {
        if (stack[index].children) {
            if (stack[index].type === "node") {
                var aa = "";
                // let finds = []
                /*
                            for (let i of stack[index].children) {
                                finds.push(stack.indexOf(i))
                            }

                            for (let q of finds) {
                                aa = `${aa}${stack[q].output}`
                            }
                */
                for (var _i = 0, _a = stack[index].children; _i < _a.length; _i++) {
                    var q = _a[_i];
                    aa = "" + aa + q.output;
                }
                var attrs = [];
                if (stack[index].attrs) {
                    for (var _b = 0, _c = stack[index].attrs; _b < _c.length; _b++) {
                        var ll = _c[_b];
                        for (var _d = 0, _e = Object.keys(ll); _d < _e.length; _d++) {
                            var bb = _e[_d];
                            attrs.push(bb + "=\"" + ll[bb] + "\"");
                        }
                    }
                }
                stack[index].output = "<" + stack[index].tag + (attrs.length > 0 ? " " : '') + attrs.join(" ") + ">" + aa + "</" + stack[index].tag + ">";
            }
            else if (stack[index].type === "root") {
                var aa = "";
                for (var _f = 0, _g = stack[index].children; _f < _g.length; _f++) {
                    var q = _g[_f];
                    aa = "" + aa + q.output;
                }
                stack[index].output = aa;
            }
        }
        else {
            if (stack[index].type === "node") {
                var attrs = [];
                if (stack[index].attrs) {
                    for (var _h = 0, _j = stack[index].attrs; _h < _j.length; _h++) {
                        var ll = _j[_h];
                        for (var _k = 0, _l = Object.keys(ll); _k < _l.length; _k++) {
                            var bb = _l[_k];
                            attrs.push(bb + "=\"" + ll[bb] + "\"");
                        }
                    }
                }
                stack[index].output = "<" + stack[index].tag + (attrs.length > 0 ? " " : '') + attrs.join(" ") + "></" + stack[index].tag + ">";
            }
            else if (stack[index].type === "text") {
                stack[index].output = stack[index].content;
            }
        }
        index++;
    }
    return stack;
}
exports.generate = generate;
// generate(stack)
// console.log(stack[stack.length - 1].output)
// let stack = []
// // 广度遍历
// function levelOrder(ast) {
//     let queue = [];
//     queue.push(ast);
//     while (queue.length) {
//         let cur = queue.shift();
//         stack.push(cur)
//         if (cur.children)
//             queue.push(...cur.children)
//     }
// }
// levelOrder(ast)
