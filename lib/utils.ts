import { CapitalizeOptions } from "./types";

/**
 * Takes a decimal number and returns the fraction of that number as a string.
 * @param decimal The decimal number to be turned into a fraction.
 * @returns The fraction of the given decimal number as a string.
 * 
 * @example toFraction(0.25) returns '1/4'
 * toFraction(4.5) returns '4 1/2'
 */
export function toFraction(decimal: number): string {

    // Define the return variable
    let fraction: string;
    const decimalString = decimal.toString();

    // If the decimal number provided is a whole number, return the whole number as a string
    if (!decimalString.includes(".")) return decimalString;

    // Separate the numbers before and after the decimal point
    const [ integerPart, fractionPart ] = decimalString.split(".");

    // Turn the fraction part into a fraction
    let denominator = 10 ** fractionPart.length;
    let numerator = parseInt(fractionPart)

    // Find the greatest comon divisor
    const divisor = gcd(denominator, numerator);

    // Simplify the fraction
    denominator /= divisor;
    numerator /= divisor;

    // Turn the fraction into a string
    fraction = `${parseInt(integerPart) ? integerPart + " " : ""}${numerator}/${denominator}`;

    // Return the fraction
    return fraction;
};

/**
 * Finds the greatest common divisor of 2 numbers using Euclid's algorithm. The order of the numbers provided doesn't matter but both numbers must be whole numbers.
 * @param a A whole number
 * @param b Another whole number
 * @returns The greatest common divisor of the two given whole numbers
 * @example 
 * gcd(10, 5) // returns 5
 * gcd(5, 10) // returns 5 as well
 * gcd(49, 21) // returns 7
 * @see https://en.wikipedia.org/wiki/Euclidean_algorithm
 */
function gcd(a: number, b: number): number {
    
    if (!b) return a;
    return gcd(b, a % b);
};

/**
 * Converts the value of an HTML form element to the desired type.
 * @param target The ChangeEvent target. Can be one of the following: input (text, number or checkbox), textarea, select.
 * @returns The value of the target typed as per input type. 
 * 
 * @example 
 * HTML:
 * <input type="number" value={value} onChange={changeHandler} />
 * 
 * JS:
 * const [ value, setValue ] = useState(0);
 * 
 * function changeHandler(e) {
 *     setValue(getTargetValue(e.target)); // Returns the value of the input element as a number.
 * }
 * 
 */
export function getTargetValue(target: EventTarget & (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)) {

    if (target.tagName === 'TEXTAREA') return target.value;
    if (target.tagName === 'SELECT') {
        if (target.dataset.type === 'number') {
            return Number(target.value)
        } else return target.value;
    }

    switch (target.type) {
        case 'text':
            return target.value.toString();
        case 'number':
            return Number(target.value);
        case 'checkbox':
            return Boolean((target as EventTarget & HTMLInputElement).checked);
        default:
            return target.value;
    }
};

/**
 * Capitalizes the first letter in a given string.
 * @param string The string to be capitalized.
 * @returns The input string with the first character capitalized.
 * @example
 * capitalize("hello world");
 * // returns:
 * "Hello world"
 */
export function capitalize(string: string, options?: CapitalizeOptions): string {

    const words = options?.all ? string.split(" ") : [string];
    const capitalized = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    
    return capitalized.join(" ");
};


export function getType(variable: any): string {

    switch (typeof variable) {
        case "string" || "bigint" || "number" || "boolean" || "undefined" || "function":
            return typeof variable;
        case "object":
            if (Array.isArray(variable)) {
                return "array";
            } else if (variable === null) {
                return "null";
            }
            return "object";
        default:
            return "unknown";
    }

}