
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

    // 
    let denominator = 10 ** fractionPart.length;
    let numerator = parseInt(fractionPart)

    const divisor = gcd(denominator, numerator);

    denominator /= divisor;
    numerator /= divisor;

    fraction = `${parseInt(integerPart) ? integerPart + " " : ""}${numerator}/${denominator}`;

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
 * 
 * How to set up the HTML element:
 * 1. Add a 'data-type' attribute to the element
 * 2. Set the value of the attribute to either 'string' or 'number'. The function currently only works for string and number values.
 * 3. Pass a reference to the HTML element to this function and it will return the value of the target element with the desired type.
 * @param target The ChangeEvent target. Can be one of the following: <input>, <textarea>, <select>. The target element must have a 'data-type' attribute set.
 * @returns The value of the target typed as per the data-type attribute.
 * 
 * @example 
 * HTML:
 * <input type="number" data-type="number" value={value} onChange={changeHandler} />
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

    switch (target.dataset.type) {
        case 'string':
            return target.value.toString();
        case 'number':
            return Number(target.value);
    }
};

export function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
};