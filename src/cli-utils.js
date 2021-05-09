/** @typedef {{command: string, params: Array<string>}} SingleCommand */

const { checkCompability } = require("./cli-formatter.js");

/**
 * Reads the arguments from the commandline, this program was launched with.
 * @returns {string} concatenated string of arguments, that were supplied to the application.
 */
const readCommandlineArgs = () => {
    const args = process.argv.splice(2).join(' ');
    return args;
};

/**
 * Reads the data, that was piped into our application over the commandline. 
 * @returns {string} the content that was piped into our application on the commandline.
 */
const readPipedData = async () => {
    const stdin = process.stdin;
    return new Promise((resolve, reject) => {
        let data = '';
        stdin.on('readable', () => {
            let chunk = stdin.read();
            if (chunk !== null) {
                data += chunk;
            }
        });
    
        stdin.on('end', () => {
            resolve(data);
        });

        setTimeout(() => {
            if(data === ''){
                stdin.destroy();
                resolve(data);
            }
        }, 100);
    });
};


/**
 * Splits the argument string on the space chars and seperates the arguments in command- and parameter-arguments.
 * Command-arguments start with '--' and describe an action that is to be performed and parameter-arguments,
 * which are descriptors for the previous command-argument (values/options/etc). These are always positional relative
 * to their command-argument.
 * @param {string} args - the untokenized concatenated string of arguments. 
 * @returns {Array<SingleCommand>} an array of command arguments, which are arguments beginning with '--' and following are all it's arguments.  
 */
const tokenizeArgs = (args) => {
    let words = args.split(' ');
    let result = words.reduce((coll, curr) => {
        if(curr.startsWith('--')){
            coll.unshift({command: curr.slice(2), paramList: []});
        } else if (coll.length > 0) {
            coll[0].paramList.push(curr);
        } else {
            coll.unshift({command: 'null', paramList: [curr]});
        }
        return coll;
    }, []);
    // result.params = result.paramList.join(' ');
    return result.reverse();
};


class ParameterError extends Error {};

/** @typedef {{type: any, validity: (param: any) => boolean, required: boolean}} ParameterDescription */
/** @typedef {{[command: string]: {help: string, syntax: string, parameter: ParameterDescription}}} CommandTemplate*/

class CLIProgram {
    /**
     * Creates the CLIProgram object, which can be used to interact with other callbacks from different command arguments.
     * @param {Array<CommandTemplate>} template 
     */
    constructor (template) {
        this.template = template;
        this.params = [];
        this.toExecute = [];
    }

    /**
     * Prints information about usage of this program on the console.
     */
    printHelp () {
        console.log(`Help:`);
        Reflect.ownKeys(this.template).forEach( (key) => {
            console.log(`--${key} - ${this.template[key].help}\n  Syntax: ${this.template[key].syntax}`);
        });
    }

    /**
     * Executes the already prepared callbacks.
     */
    startExecuting() {
        this.toExecute.forEach( (fun) => fun() );
    }

    /**
     * Verify one of the parameter of one command argument.
     * @param {string} command - the command argument.
     * @param {Array[any]} unsafeParams - unchecked, uncast parameter given to the command.
     * @returns {(parameterInstruction: ParameterDescription, i: number) => void}
     * @throws {ParameterError} An Error with some sort of missmatch between how parameter were expected, and how they are. 
     */
    verifyParameter(command, unsafeParams) {
        return (parameterInstruction, i) => {
            let typedParam = undefined;
            try{
                if(unsafeParams[i] !== undefined)
                    typedParam = (parameterInstruction.type) (unsafeParams[i]);
            } catch (err) {
                console.error(err);
                throw new ParameterError(`One of the parameter on '--${command}' could not be cast to the required type. Parameter: '${unsafeParams[i]}'`);
            }
            if(typedParam === undefined && parameterInstruction.required){
                throw new ParameterError(`There is a required parameter missing on '${command}'.\nSyntax: ${parameterInstruction.syntax}`);
            } else if (typedParam === undefined && !parameterInstruction.required) {
                this.params.push(null);
            } else if (typedParam !== undefined && !parameterInstruction.validity(typedParam)) {
                throw new ParameterError(`The given parameter on '--${command}': '${unsafeParams[i]}' failed the validity test.`);
            } else {
                this.params.push(typedParam);
            }
        };
    }
}

/**
 * Execute the Callbacks of the command Arguments, if they are as expected.
 * @param {Array<CommandTemplate>} argTemplate - A complete description of how the interface should work.
 * @param {Array<ParameterDescription>} argList - the tokenized arguments supplied to the program.
 * @returns {CLIProgram} Reference to the program and it's parameters.
 */
const executeArgList = (argTemplate, argList) => {
    let program = new CLIProgram(argTemplate);
    if (argList.map( (arg) => arg.command).filter( (command) => command === "help").length > 0) {
        program.printHelp();
        return program;
    }
    try{
        argList.forEach( (arg) => {
            let instructions = argTemplate[arg.command];
            program.params = [];
            if (instructions === undefined){
                throw new ParameterError(`The command '${arg.command}' is unknown.`);
            } else {
                instructions.parameter.forEach( program.verifyParameter(arg.command, arg.paramList) );
                program.toExecute.push(instructions.callback.bind(program, ...program.params));    
            }
        });
        program.startExecuting();    
    } catch(err) {
        console.error(err);
    }
    return program;
}

// console.log(tokenizeArgs('--test 1 2 3 --game --123 karl'));

module.exports = {
    readCommandlineArgs,
    readPipedData,
    tokenizeArgs,
    executeArgList,
    CLIProgram,
}