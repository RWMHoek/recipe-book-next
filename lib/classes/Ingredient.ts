class InvalidPropError extends Error {
    constructor (propName: string) {
        super(`The property '${propName}' is not allowed on objects of type Ingredient.`);
    }
}

class MissingPropError extends Error {

    constructor (...propNames: string[]) {
        let props: string;
        if (propNames.length > 1) {
            props = propNames.reduce((currentValue, previousValue, currentIndex) => {
                if (currentIndex === propNames.length - 1) {
                    return `${previousValue}, or ${currentValue}`;
                } else {
                    return `${previousValue}, ${currentValue}`;
                }
            })
        } else {
            props = propNames[0];
        }
        super(`Object is missing the '${props}' property.`);
    }
}

class InvalidTypeError extends TypeError{
    constructor (propName: string, propType: string) {
        super(`Cannot assign value of type '${propType}' to '${propName}'.`);
    }
}


class Ingredient {

    name: string = ""
    id?: number
    unit?: string
    unit_id?: number
    category?: string
    category_id?: number

    constructor (object: any) {
        if (Ingredient.isValid(object)) {
            this.name = object.name;
            this.id = object.id;
            this.unit = object.unit;
            this.unit_id = object.unit_id;
            this.category = object.category;
            this.category_id = object.category_id;
        } else {
            throw new Error("The ingredient initializer object must contain a name key, a unit or unit_id key, and a category or category_id key. An optional id key is allowed. All id keys must be numbers, all other keys must be strings.");
        }
    }

    static isValid(object: any): boolean {
        let errors: InvalidPropError[] = [];
        let result: boolean = true;
        const props: string[] = ["id", "name", "unit", "unit_id", "category", "category_id"];

        const keys: string[] = Object.keys(object)

        keys.forEach(key => {
            if (!props.includes(key)) {
                result = false;
                errors.push(new InvalidPropError(key));
            }
        });

        if (keys.includes("name")) {
            if (typeof object.name !== "string") {
                result = false;
                errors.push(new InvalidTypeError("name", typeof object.name));
            }
        } else {
            result = false;
            errors.push(new MissingPropError("name"));
        }

        if (!keys.includes("unit") && !keys.includes("unit_id")) {
            result = false;
            errors.push(new MissingPropError("unit", "unit_id"));
        }
        if (object.unit && typeof object.unit !== "string") result = false;
        if (object.unit_id && typeof object.unit_id !== "number") result = false;
            
        if (!keys.includes("category") && !keys.includes("category_id")){
            result = false;
        }
        if (object.unit && typeof object.category !== "string") result = false;
        if (object.unit && typeof object.category_id !== "number") result = false;

        return result;
    }
}

export default Ingredient;