const fs = require("fs")
const path = require("path")
import {
    generate
} from './src/ast2html'
import {
    parser
} from "./src/html2ast"

let file = fs.readFileSync(path.resolve(__dirname, "./example/demo6.html"), {
    encode: "utf-8"
})
file = file.toString()


let ast = parser(file)
generate(ast)
console.log(ast.output)
