import { NextApiRequest } from "next"

export interface Unit {
    id: number,
    name: string,
    abbreviation: string
};

export interface Category {
    id: number,
    name: string,
    description: string
};

export interface Course {
    id: number,
    name: string
};

export interface Ingredient {
    id?: number,
    name: string,
    unit_id: number,
    unit?: string,
    category_id: number,
    category?: string
};

export interface RecipeIngredient {
    id: number,
    name?: string,
    unit?: string,
    amount: number
};

export interface Step {
    id: number,
    step_number: number,
    description: string
};

export interface Recipe {
    id?: number,
    name: string,
    description: string,
    course_id: number,
    course?: string,
    serves: number,
    prep_time: number,
    cook_time: number,
    ingredients: RecipeIngredient[],
    steps: string[]
};

export interface ShoppingListRecipe {
    id: number,
    name: string,
    serves: number
};

export interface ShoppingList {
    id: number,
    name: string,
    recipes: ShoppingListRecipe[],
    extraIngredients: RecipeIngredient[],
    totalIngredients: RecipeIngredient[]
};

export interface Action {
    type: string,
    payload?: any
}

export interface CapitalizeOptions {
    all?: boolean
}

export interface NextApiRequestWithUser extends NextApiRequest {
    logIn(user: any, arg1: (err: any) => void): unknown
    user: {
        id: number,
        username: string,
        email: string
    }
}

export interface Client {
    clientId: string,
    clientSecret: string,
    grants: string[]
}

export interface User {
    username: string
}

export interface Token {
    client: {
        id: string
    },
    user: {
        username: string
    }
}