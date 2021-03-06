"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
function lexer(item, index, file) {
    var _a;
    function isEnd(index) {
        return file.length < index;
    }
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
            var attrs = [];
            if (cur === " ") {
                while (file.charAt(index) === " ") {
                    index++;
                }
                var key = "";
                var value = "";
                cur = file.charAt(index);
                while (cur !== ">" && !isEnd(index)) {
                    if (cur === " " && cur !== ">") {
                        while (file.charAt(index) === " ") {
                            index++;
                            cur = file.charAt(index);
                        }
                    }
                    if (cur !== "=" && cur !== ">") {
                        key += cur;
                    }
                    else if (cur === "=" && cur !== ">") {
                        index++;
                        cur = file.charAt(index);
                        while (cur !== " " && !isEnd(index) && cur !== ">") {
                            if (cur === '"') {
                                index++;
                                cur = file.charAt(index);
                            }
                            else {
                                value += cur;
                                index++;
                                cur = file.charAt(index);
                            }
                        }
                        attrs.push((_a = {},
                            _a[key] = value,
                            _a));
                        key = "";
                        value = "";
                        index--;
                    }
                    else if (cur === ">") {
                        break;
                    }
                    index++;
                    cur = file.charAt(index);
                }
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
                children: [],
                attrs: attrs
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
        var token = lexer(item, index, file);
        index = token.index;
        delete token.index;
        if (!token.closeTag) { // ???????????????
            stack[stack.length - 1].children.push(token); // ????????????children???
            if (token.type === "node") { // ???????????????????????????????????????
                stack.push(token);
            }
        }
        else { // ?????????????????????????????????
            stack.pop();
        }
    }
    console.log(stack);
    return stack[0];
}
exports.parser = parser;
