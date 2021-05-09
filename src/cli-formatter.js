/** @typedef {string} EffectCode */
/** @typedef {() => EffectCode} BasicEffectCodeFunction */
/** @typedef {(n: number) => EffectCode} NumberedEffectCodeFunction */
/** @typedef {(r: number, g: number, b: number) => EffectCode} RGBEffectCodeFunction */
/** @typedef {BasicEffectCodeFunction | NumberedEffectCodeFunction | RGBEffectCodeFunction} EffectCodeFunction */

const emptyArray = (size) => [...(new Array(size))];

/** @enum {BasicEffectCodeFunction} */
const NamedFontEffects = {
    RESET: () => "0",
    BOLD: () => "1",
    FAINT: () => "2",
    ITALIC: () => "3",
    UNDERLINE: () => "4",
    SLOW_BLINK: () => "5",
    RAPID_BLINK: () => "6",
    SWAP_COLOR: () => "7",
    CONCEAL: () => "8",
    CROSSOUT: () => "9",
    FRAKTUR: () => "20",
    DOUBLE_UNDERLINE: () => "21",
    NO_BOLD: () => "22",
    NO_ITALIC: () => "23",
    NO_UNDERLINE: () => "24",
    NO_BLINK: () => "25",
    NO_INVERSE: () => "27",
    NO_CONCEAL: () => "28",
    NO_CROSSOUT: () => "29",
    FG_4B_BLACK: () => "30",
    FG_4B_RED: () => "31",
    FG_4B_GREEN: () => "32",
    FG_4B_YELLOW: () => "33",
    FG_4B_BLUE: () => "34",
    FG_4B_MAGENTA: () => "35",
    FG_4B_CYAN: () => "36",
    FG_4B_WHITE: () => "37",
    FG_DEFAULT: () => "39",
    BG_4B_BLACK: () => "40",
    BG_4B_RED: () => "41",
    BG_4B_GREEN: () => "42",
    BG_4B_YELLOW: () => "43",
    BG_4B_BLUE: () => "44",
    BG_4B_MAGENTA: () => "45",
    BG_4B_CYAN: () => "46",
    BG_4B_WHITE: () => "47",
    BG_DEFAULT: () => "49",
    FRAMED: () => "51",
    ENCIRCLED: () => "52",
    OVERLINED: () => "53",
    NO_FRAMED: () => "54",
    NO_OVERLINED: () => "55",
    FG_4B_BRIGHT_BLACK: () => "90",
    FG_4B_BRIGHT_RED: () => "91",
    FG_4B_BRIGHT_GREEN: () => "92",
    FG_4B_BRIGHT_YELLOW: () => "93",
    FG_4B_BRIGHT_BLUE: () => "94",
    FG_4B_BRIGHT_MAGENTA: () => "95",
    FG_4B_BRIGHT_CYAN: () => "96",
    FG_4B_BRIGHT_WHITE: () => "97",
    BG_4B_BRIGHT_BLACK: () => "100",
    BG_4B_BRIGHT_RED: () => "101",
    BG_4B_BRIGHT_GREEN: () => "102",
    BG_4B_BRIGHT_YELLOW: () => "103",
    BG_4B_BRIGHT_BLUE: () => "104",
    BG_4B_BRIGHT_MAGENTA: () => "105",
    BG_4B_BRIGHT_CYAN: () => "106",
    BG_4B_BRIGHT_WHITE: () => "107",
}

/** @enum {BasicEffectCodeFunction} */
const BasicForegroundColors = {
    BLACK: NamedFontEffects.FG_4B_BLACK,
    RED: NamedFontEffects.FG_4B_RED,
    GREEN: NamedFontEffects.FG_4B_GREEN,
    YELLOW: NamedFontEffects.FG_4B_YELLOW,
    BLUE: NamedFontEffects.FG_4B_BLUE,
    MAGENTA: NamedFontEffects.FG_4B_MAGENTA,
    CYAN: NamedFontEffects.FG_4B_CYAN,
    WHITE: NamedFontEffects.FG_4B_WHITE,
};

/** @enum {BasicEffectCodeFunction} */
const BasicBackgroundColors = {
    BLACK: NamedFontEffects.BG_4B_BLACK,
    RED: NamedFontEffects.BG_4B_RED,
    GREEN: NamedFontEffects.BG_4B_GREEN,
    YELLOW: NamedFontEffects.BG_4B_YELLOW,
    BLUE: NamedFontEffects.BG_4B_BLUE,
    MAGENTA: NamedFontEffects.BG_4B_MAGENTA,
    CYAN: NamedFontEffects.BG_4B_CYAN,
    WHITE: NamedFontEffects.BG_4B_WHITE,
};

const FOREGROUND = "38";
const BACKGROUND = "48";

/**
 * Transforms a base10 integer into the individual hexadecimal RGB components and concatenates them to the neccassary effect code.  
 * @param {number} base10int - base 10 integer, that corresponds to the composed RGB hexadecimal number. 
 * @returns {EffectCode} the RGB effectcode component
 */
const transformIntToRGB = (base10int) => {
    const hex = Math.floor(base10int).toString(16);
    const normHex = hex.length > 6 ? hex.slice(hex.length - 6) : hex.padStart(6, '0');
    return `${normHex.slice(0, 2)};${normHex.slice(2, 4)};${normHex.slice(4, 6)}`;
};


/** @enum {NumberedEffectCodeFunction} */
const NumberedFontEffects = {
    ALTERNATE_FONT: (n) => `1${Math.floor(n % 10)}`,
    FG_8B_COLOR: (n) => `${FOREGROUND};5;${Math.floor(n % 256)}`,
    FG_RGB_COLOR: (n) => `${FOREGROUND};2;${transformIntToRGB(n)}`,
    BG_8B_COLOR: (n) => `${BACKGROUND};5;${Math.floor(n % 256)}`,
    BG_RGB_COLOR: (n) => `${BACKGROUND};2;${transformIntToRGB(n)}`,
};

/** @enum {RGBEffectCodeFunction} */
const RGBFontEffects = {
    FG_RGB_COLOR: (r, g, b) => `${FOREGROUND};5;${Math.floor(r % 256)};${Math.floor(g % 256)};${Math.floor(b % 256)}`,
    BG_RGB_COLOR: (r, g, b) => `${BACKGROUND};5;${Math.floor(r % 256)};${Math.floor(g % 256)};${Math.floor(b % 256)}`,
};

/**
 * Combines all the effect option functions in one handy enum like object. Does not include the BasicBackgroundColors
 * enum, because of naming conflicts with their equivilent BasicForegroundColors enum. 
 * @enum {EffectCodeFunction} 
 */
const FontEffects = {
    ...NamedFontEffects,
    ...NumberedFontEffects,
    ...RGBFontEffects,
    ...BasicForegroundColors,
};

/**
 * Formats a text with Font effects by wraping the string with the corrosponding ANSI-Escape sequence. 
 * @param {Array<EffectCode>} options - list of Font effects, that should be applied. 
 * @param {string} content - text, that shall be formated.
 * @returns {string} the formated text.
 */
const applyFormating = (options, content) => `\u{1b}[${options.join(';')}m${content}\u{1b}[0m`;

const example = () => {
    let AF = applyFormating;

    let formatting = [
        FontEffects.RED(), 
        FontEffects.BG_4B_WHITE(), 
        FontEffects.BOLD(),
        FontEffects.ITALIC(),
    ];
    
    let t1 = "Dies ist ein Beispiel Text.";
    let t2 = "Dies ist noch ein anderer Beispiel Text.";

    console.log(`${AF(formatting, t1)}\n${t2}`);
};

/**
 * Compiles a complete sample text, containing all the colors, that are part of the 256-color-mode. 
 * @param {NumberedEffectCodeFunction} groundFunction - either NumberedFontEffects.FG_8B_COLOR, depending which is to be tested.
 * @returns {string} a string containing samples of all the 8Bit color effects.  
 */
const print8BitColorTest = (groundFunction) => {
    let result = "";
    result += emptyArray(16).map( (v, i) => (`${applyFormating([groundFunction(i)], i.toString().padStart(3, '0'))}`)).join('  ') + "\n\n";
    emptyArray(6).forEach( (v, group) => {
        emptyArray(6).forEach( (v, column) => {
            let rowLine = "";
            emptyArray(6).forEach( (v, row) => {
                rowLine += `${applyFormating([groundFunction(16 + (6 * group) + (36 * row) + column)], (16 + (6 * group) + (36 * row) + column).toString().padStart(3, '0'))}  `;
            });
            result += rowLine + "\n";
        });
        result += "\n";
    });
    result += emptyArray(16).map( (v, i) => (`${applyFormating([groundFunction(i + 232)], (i + 232).toString().padStart(3, '0'))}`)).join('  ') + "\n";
    return result;
};

/**
 * This function can be used to check compability of your terminal, for most of the effects implemented.
 * @param {number} mode - int between [0 - 3] for: 
    - 0: named effects
    - 1: alternate fonts
    - 2: 8Bit Colors in foreground
    - 3: 8Bit Colors in background
 */
const checkCompability = (mode) => {
    let AF = applyFormating;
    let keyFormatting = [
        FontEffects.FG_4B_BRIGHT_BLACK(), 
        FontEffects.BG_4B_BLACK(), 
    ];
    let t1 = "Dies ist ein Satz, um Effekte zu vergleichen.";
    let result = "";

    if (mode === 0){
        Reflect.ownKeys(NamedFontEffects)
            .filter(key => !key.startsWith("NO_"))
            .forEach( (key) => result += (`${AF([NamedFontEffects[key]()], t1)} | ${AF(keyFormatting, key)}\n`) );
    } else if (mode === 1) {
        emptyArray(10).forEach( (v, i) => result += (`${AF([NumberedFontEffects.ALTERNATE_FONT(i)], t1)} | ${AF(keyFormatting, ` Font #${i} `)}\n`));
    } else if (mode === 2) {
        result = print8BitColorTest(NumberedFontEffects.FG_8B_COLOR);
    } else if (mode === 3) {
        result = print8BitColorTest(NumberedFontEffects.BG_8B_COLOR);
    }
    return result;
};


// example();
// console.log(compabilityChecks(1));

module.exports = {
    applyFormating,
    checkCompability,
    FontEffects,
    NamedFontEffects,
    NumberedFontEffects,
    RGBFontEffects,
    BasicForegroundColors,
    BasicBackgroundColors,
};

