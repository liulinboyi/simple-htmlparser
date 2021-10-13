function lexer(item, index, file) {
    var _a;
    function isEnd(index) {
        return file.length <= index;
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
            // if (isEnd(index)) {
            //     return {
            //         type: "EOF",
            //         index
            //     }
            // }
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
            // if (isEnd(index)) {
            //     return {
            //         type: "EOF",
            //         index
            //     }
            // }
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
        if (isEnd(index) && content === '') {
            return {
                type: "EOF",
                index: index
            };
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
        if (isEnd(index) && content === '') {
            return {
                type: "EOF",
                index: index
            };
        }
        return {
            type: "text",
            content: content,
            index: index
        };
    }
}
export function parser(file) {
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
        if (token.type === "EOF") {
            return stack[0];
        }
        if (!token.closeTag) { // 非闭合标签
            stack[stack.length - 1].children.push(token); // 放入栈顶children处
            if (token.type === "node") { // 如果是标签节点，则放入栈中
                stack.push(token);
            }
        }
        else { // 闭合标签，栈顶标签出栈
            stack.pop();
        }
    }
    console.log(stack);
    return stack[0];
}
