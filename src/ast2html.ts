
export function generate(ast: any) {

    let stack = []

    // 深度遍历
    function getAll(ast: any) {
        if (ast.children) {
            for (let item of ast.children) {
                // stack.push(item)
                getAll(item)
                stack.push(item)
            }
        }
    }
    getAll(ast)
    stack.push(ast)

    for (let index = 0; index < stack.length;) {
        if (stack[index].children) {
            if (stack[index].type === "node") {
                let aa = ""
                // let finds = []
                /*
                            for (let i of stack[index].children) {
                                finds.push(stack.indexOf(i))
                            }

                            for (let q of finds) {
                                aa = `${aa}${stack[q].output}`
                            }
                */
                for (let q of stack[index].children) {
                    aa = `${aa}${q.output}`
                }
                let attrs = []
                if (stack[index].attrs) {
                    for (let ll of stack[index].attrs) {
                        for (let bb of Object.keys(ll)) {
                            attrs.push(`${bb}="${ll[bb]}"`)
                        }
                    }
                }
                stack[index].output = `<${stack[index].tag}${attrs.length > 0 ? " " : ''}${attrs.join(" ")}>${aa}</${stack[index].tag}>`
            } else if (stack[index].type === "root") {
                let aa = ""
                for (let q of stack[index].children) {
                    aa = `${aa}${q.output}`
                }
                stack[index].output = aa
            }
        } else {
            if (stack[index].type === "node") {
                let attrs = []
                if (stack[index].attrs) {
                    for (let ll of stack[index].attrs) {
                        for (let bb of Object.keys(ll)) {
                            attrs.push(`${bb}="${ll[bb]}"`)
                        }
                    }
                }
                stack[index].output = `<${stack[index].tag}${attrs.length > 0 ? " " : ''}${attrs.join(" ")}></${stack[index].tag}>`
            } else if (stack[index].type === "text") {
                stack[index].output = stack[index].content
            } else if (stack[index].type === "comment") {
                stack[index].output = `<!--${stack[index].content}-->`
            }
        }
        index++
    }
    // return stack
}


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