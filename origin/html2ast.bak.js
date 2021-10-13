const fs = require("fs")
const path = require("path")
const {
    generate
} = require('./ast2html')

let file = fs.readFileSync(path.resolve(__dirname, "./index1.html"), {
    encode: "utf-8"
})
file = file.toString()

function isEnd(index) {
    return file.length < index
}

function lexer(item, stack, index, file) {

    if (item === "<") { // <
        index++
        if (file.charAt(index) === "/") { // </
            index++
            let tag = ""
            let cur = file.charAt(index)
            while (cur !== ">" && !isEnd(index)) { // </xx>
                tag += cur
                index++
                cur = file.charAt(index)
            }

            return {
                type: "node",
                tag,
                index,
                closeTag: true
            }
        } else { // <
            let tag = ""
            let cur = file.charAt(index)
            while (cur !== " " && cur !== ">" && !isEnd(index)) {
                tag += cur
                index++
                cur = file.charAt(index)
            }
            cur = file.charAt(index)
            while (cur !== ">" && !isEnd(index)) {
                index++
                cur = file.charAt(index)
            }
            if (file.charAt(index + 1) === "<") { // <xx></xx>
                index++
            }
            return {
                type: "node",
                tag,
                index,
                children: []
            }
        }
    } else if (item === ">") { // >
        index++
        let content = ""
        let cur = file.charAt(index)
        while (cur !== "<" && !isEnd(index)) {
            content += cur
            index++
            cur = file.charAt(index)
        }
        return {
            type: "text",
            content,
            index
        }
    } else {
        let content = ""
        let cur = file.charAt(index)
        while (cur !== "<" && !isEnd(index)) {
            content += cur
            index++
            cur = file.charAt(index)
        }
        return {
            type: "text",
            content,
            index
        }
    }
}

function parser(file) {
    let index = 0
    let root = {
        type: "root",
        children: []
    }
    let stack = [root]

    while (index < file.length) {
        let item = file.charAt(index)
        let token = lexer(item, stack, index, file)
        index = token.index
        delete token.index
        if (!token.closeTag) {
            // if (stack[stack.length - 1].children) {
            //     stack[stack.length - 1].children = []
            // }
            stack[stack.length - 1].children.push(token)
            if (token.type === "node") {
                stack.push(token)
            }
        } else {
            stack.pop()
        }
    }
    console.log(stack)
    return stack[0]
}

let ast = parser(file)
generate(ast)
console.log(ast.output)