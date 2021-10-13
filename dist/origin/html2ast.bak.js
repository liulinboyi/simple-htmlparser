"use strict";
var fs = require("fs");
var path = require("path");
var generate = require('./ast2html').generate;
var file = fs.readFileSync(path.resolve(__dirname, "./index1.html"), {
    encode: "utf-8"
});
file = file.toString();
function isEnd(index) {
    return file.length < index;
}
function lexer(item, stack, index, file) {
    if (item === "<") { // <
        index++;
        if (file.charAt(index) === "/") { // </
            index++;
            var tag = "";
            var cur = file.charAt(index);
            while (cur !== ">" && !isEnd(index)) { // </xx>
                tag += cur;
                index++;
                cur = file.charAt(index);
            }
            return {
                type: "node",
                tag: tag,
                index: index,
                closeTag: true
            };
        }
        else { // <
            var tag = "";
            var cur = file.charAt(index);
            while (cur !== " " && cur !== ">" && !isEnd(index)) {
                tag += cur;
                index++;
                cur = file.charAt(index);
            }
            cur = file.charAt(index);
            while (cur !== ">" && !isEnd(index)) {
                index++;
                cur = file.charAt(index);
            }
            if (file.charAt(index + 1) === "<") { // <xx></xx>
                index++;
            }
            return {
                type: "node",
                tag: tag,
                index: index,
                children: []
            };
        }
    }
    else if (item === ">") { // >
        index++;
        var content = "";
        var cur = file.charAt(index);
        while (cur !== "<" && !isEnd(index)) {
            content += cur;
            index++;
            cur = file.charAt(index);
        }
        return {
            type: "text",
            content: content,
            index: index
        };
    }
    else {
        var content = "";
        var cur = file.charAt(index);
        while (cur !== "<" && !isEnd(index)) {
            content += cur;
            index++;
            cur = file.charAt(index);
        }
        return {
            type: "text",
            content: content,
            index: index
        };
    }
}
function parser(file) {
    var index = 0;
    var root = {
        type: "root",
        children: []
    };
    var stack = [root];
    while (index < file.length) {
        var item = file.charAt(index);
        var token = lexer(item, stack, index, file);
        index = token.index;
        delete token.index;
        if (!token.closeTag) {
            // if (stack[stack.length - 1].children) {
            //     stack[stack.length - 1].children = []
            // }
            stack[stack.length - 1].children.push(token);
            if (token.type === "node") {
                stack.push(token);
            }
        }
        else {
            stack.pop();
        }
    }
    console.log(stack);
    return stack[0];
}
var ast = parser(file);
generate(ast);
console.log(ast.output);
