function lexer(item: any, index: any, file: any) {

    function isEnd(index: number) {
        return file.length <= index
    }

    function isCommentEnd(hanlder: any, index: number) {
        let count = index;
        let target = "-->"
        let sour = ""
        while (count < index + 3) {
            sour += hanlder.charAt(count)
            count++
        }
        return target === sour
    }

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

            // if (isEnd(index)) {
            //     return {
            //         type: "EOF",
            //         index
            //     }
            // }

            return {
                type: "node",
                tag,
                index,
                closeTag: true
            }
        } else if (file.charAt(index) === "!") {
            index++
            let cur = file.charAt(index)
            let count = 2;
            while (count) { // <!--
                if (cur !== "-") {
                    console.assert("fail")
                }
                index++
                cur = file.charAt(index)
                count--
            }
            // -->结束
            let content = ""
            cur = file.charAt(index)
            let isCEnd = false

            while (!isEnd(index)) {
                isCEnd = isCommentEnd(file, index)
                if (isCEnd) {
                    break
                }
                content += cur
                index++
                cur = file.charAt(index)
            }
            if (isCEnd) { // -->
                index += 3
            }

            if (isEnd(index) && content === '') {
                return {
                    type: "EOF",
                    index
                }
            }
            return {
                type: "comment",
                content,
                index
            }

        } else { // <
            let tag = ""
            let cur = file.charAt(index)
            while (cur !== " " && cur !== ">" && !isEnd(index)) {
                tag += cur
                index++
                cur = file.charAt(index)
            }
            let attrs = []
            if (cur === " ") {
                while (file.charAt(index) === " ") {
                    index++
                }
                let key = ""
                let value = ""
                cur = file.charAt(index)
                while (cur !== ">" && !isEnd(index)) {
                    if (cur === " " && cur !== ">") {
                        while (file.charAt(index) === " ") {
                            index++
                            cur = file.charAt(index)
                        }
                    }
                    if (cur !== "=" && cur !== ">") {
                        key += cur
                    } else if (cur === "=" && cur !== ">") {
                        index++
                        cur = file.charAt(index)
                        while (cur !== " " && !isEnd(index) && cur !== ">") {
                            if (cur === '"') {
                                index++
                                cur = file.charAt(index)
                            } else {
                                value += cur
                                index++
                                cur = file.charAt(index)
                            }
                        }
                        attrs.push({
                            [key]: value
                        })
                        key = ""
                        value = ""
                        index--
                    } else if (cur === ">") {
                        break
                    }
                    index++
                    cur = file.charAt(index)
                }
            }
            cur = file.charAt(index)
            while (cur !== ">" && !isEnd(index)) {
                index++
                cur = file.charAt(index)
            }
            if (file.charAt(index + 1) === "<") { // <xx></xx>
                index++
            }
            // if (isEnd(index)) {
            //     return {
            //         type: "EOF",
            //         index
            //     }
            // }
            return {
                type: "node",
                tag,
                index,
                children: [],
                attrs
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
        if (isEnd(index) && content === '') {
            return {
                type: "EOF",
                index
            }
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
        if (isEnd(index) && content === '') {
            return {
                type: "EOF",
                index
            }
        }
        return {
            type: "text",
            content,
            index
        }
    }
}

export function parser(file: any) {
    let index = 0
    let root = {
        type: "root",
        children: []
    }
    let stack: any = [root]

    while (index < file.length) {
        let item = file.charAt(index)
        let token = lexer(item, index, file)
        index = token.index
        delete token.index
        if (token.type === "EOF") {
            return stack[0]
        }
        if (!token.closeTag) { // 非闭合标签
            stack[stack.length - 1].children.push(token) // 放入栈顶children处
            if (token.type === "node") { // 如果是标签节点，则放入栈中
                stack.push(token)
            }
        } else { // 闭合标签，栈顶标签出栈
            stack.pop()
        }
    }
    console.log(stack)
    return stack[0]
}