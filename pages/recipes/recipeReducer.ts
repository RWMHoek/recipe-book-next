import { Recipe } from ".";

export enum ACTION {
    CHANGE_INFO = 'change_info',
    ADD_INGREDIENT = 'add_ingredient',
    CHANGE_INGREDIENT = 'change_ingredient',
    DELETE_INGREDIENT = 'delete_ingredient',
    ADD_STEP = 'add_step',
    CHANGE_STEP = 'change_step',
    DELETE_STEP = 'delete_step'
}

interface Action {
    type: string,
    payload?: any
}

export const initialState: Recipe = {
    name: '',
    course: '',
    serves: 0,
    prep_time: 0,
    cook_time: 0,
    description: '',
    ingredients: [],
    steps: []
}

export default function reducer(state: Recipe, action: Action) {
    
    switch (action.type) {
        case ACTION.CHANGE_INFO:
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case ACTION.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [ ...state.ingredients, { ingredient_id: -1, amount: 0 } ]
            };
        case ACTION.CHANGE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.map((ingredient, index) => action.payload.index !== index ? ingredient : { ...ingredient, [action.payload.name]: action.payload.value })
            };
        case ACTION.DELETE_INGREDIENT:
            
            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient, index) => index !== action.payload.index)
            };
        case ACTION.ADD_STEP:
            const { index } = action.payload;
            return {
                ...state,
                steps: [
                    ...state.steps.slice(0, index),
                    "",
                    ...state.steps.slice(index)
                ]
            };
        case ACTION.CHANGE_STEP:
            return {
                ...state,
                steps: state.steps.map((step, index) => action.payload.index !== index ? step : action.payload.value)
            };
        case ACTION.DELETE_STEP:
            return {
                ...state,
                steps: state.steps.filter((step, index) => index !== action.payload.index)
            };
        default:
            return initialState;
    }
}