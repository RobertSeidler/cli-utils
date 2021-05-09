const { 
    readCommandlineArgs, 
    readPipedData,
    tokenizeArgs,
    executeArgList,
    applyFormating, 
    checkCompability, 
    FontEffects, 
    BasicBackgroundColors,
    CLIProgram,
} = require('./main.js');

let argList = tokenizeArgs(readCommandlineArgs());
let argTemplate = {
    'test-compability': {
        help: `prints lots of sample effects, so you can check, whitch effects your terminal supports. Optionaly add mode [0-3], to only print a subset of the samples.\n\t0 - font effects, \n\t1 - alternate fonts, \n\t2 - foreground color, \n\t3 - background color.`,
        syntax: `--test-compability [number]`,
        parameter: [{type: Number, validity: (param) => (Number.isInteger(param) && 0 <= param <= 3), required: false}],
        callback: (...params) => {
            let mode = params[0];
            if(mode === null){
                [...(new Array(4))].forEach( (v, i) => console.log(checkCompability(i)));
            } else {
                console.log(checkCompability(mode));
            }
        }
    }
};

executeArgList(argTemplate, argList);

// argList.forEach( (arg) => {
//     if (arg.command === "test-compability"){
//         if (arg.params.length === 0){
//             [...(new Array(4))].forEach( (v, i) => console.log(checkCompability(i)));
//         } else if (arg.params.length >= 1 && Number.isInteger((Number)(arg.params[0])) && 0 <= (Number)(arg.params[0]) <= 3){
//             console.log(checkCompability((Number)(arg.params[0])));
//         }
//     } else if (arg.command === null) {
//         console.log("Missing Command-Argument '--command [value1] [value2] [...]'");
//     } else {
//         console.log(`Unknown Command-Argument: '${arg.command}'`);
//     }
// } )

// console.log();



 // readPipedData()
//     .then((data) => console.log(`this was piped:\n${data}\n`));
