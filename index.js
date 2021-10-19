var fs = require("fs");
var path = require("path");
import { generate } from './src/ast2html';
import { parser } from "./src/html2ast";
var file = fs.readFileSync(path.resolve(__dirname, "./demo5.html"), {
    encode: "utf-8"
});
file = file.toString();
var ast = parser(file);
generate(ast);
console.log(ast.output);
