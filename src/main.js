const { readCommandlineArgs, readPipedData, tokenizeArgs, executeArgList, CLIProgram } = require("./cli-utils.js");
const { applyFormating, checkCompability, FontEffects, BasicBackgroundColors } = require("./cli-formatter.js");




module.exports = {
    readCommandlineArgs, 
    readPipedData,
    tokenizeArgs,
    executeArgList,
    applyFormating, 
    checkCompability, 
    FontEffects, 
    BasicBackgroundColors,
    CLIProgram,
};
