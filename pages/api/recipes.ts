import nextConnect, { NextConnect } from "next-connect";
import { query } from "../../lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Recipe, RecipeIngredient } from "@/lib/types";

type QueryParameter = string | number;

const recipeHandler: NextConnect<NextApiRequest, NextApiResponse> = nextConnect({
    onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
        res.status(500).json({err});
    },
    onNoMatch: (req, res) => {
        res.status(501).send({error: `Method '${req.method}' not allowed!`});
    }
})
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        // Extract all information from the request body
        const { name, description, course_id, serves, prep_time, cook_time, ingredients } = req.body as Recipe;
        const steps: string[] = req.body.steps;
        let queryArgs;

        try {

            // Create new recipe and retrieve new recipe id
            const result = await query("INSERT INTO recipes (name, description, course_id, serves, prep_time, cook_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [name, description, course_id, serves, prep_time, cook_time]);
            const newRecipe: { id: number} = result.rows[0];

            // Insert Recipe Ingredients
            if (ingredients.length) {
                queryArgs = getInsertIngredientQuery(newRecipe.id, ingredients);
                await query(queryArgs.queryString, queryArgs.parameters);
            }

            // Insert Recipe Steps
            if (steps.length) {
                queryArgs = getInsertStepsQuery(newRecipe.id, steps);
                await query(queryArgs.queryString, queryArgs.parameters);
            }
            
            // Send the response
            res.status(201).json({newRecipe, message: `Successfully created new recipe with id ${newRecipe.id}`});
        } catch (error) {
            console.log({error});
            res.status(400).json({error});
        }
        
    })
    .put(async (req: NextApiRequest, res: NextApiResponse) => {
        const { name, description, course_id, serves, prep_time, cook_time, ingredients } = req.body as Recipe;
        const id: number = req.body.id;
        const steps: string[] = req.body.steps;

        try {
            // Update recipe info
            let result = await query("UPDATE recipes SET name = $1, description = $2, course_id = $3, serves = $4, prep_time = $5, cook_time = $6 WHERE id = $7", [name, description, course_id, serves, prep_time, cook_time, id]);
            
            // Delete recipe ingredients and recipe steps
            await query("DELETE FROM recipes_ingredients WHERE recipe_id = $1", [id]);
            await query("DELETE FROM steps WHERE recipe_id = $1", [id]);
    
            // Insert new recipe ingredients and steps
            let queryArgs = getInsertIngredientQuery(id, ingredients);
            result = await query(queryArgs.queryString, queryArgs.parameters);
            queryArgs = getInsertStepsQuery(id, steps);
            result = await query(queryArgs.queryString, queryArgs.parameters);
    
            res.status(200).json({message: `Successfully updated recipe with id ${id}.`});
        } catch (error) {
            res.status(400).json({error});
        }

    })
    .delete(async (req: NextApiRequest, res: NextApiResponse) => {
        const { id } = req.body;

        try {
            await query("DELETE FROM recipes_ingredients WHERE recipe_id = $1", [id]);
            await query("DELETE FROM steps WHERE recipe_id = $1", [id]);
            await query("DELETE FROM recipes WHERE id = $1", [id]);
            res.status(200).send({message: `Successfully deleted recipe with id ${id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    });

export default recipeHandler;

/**
 * Create an insert query string for all recipe ingredients.
 * @param recipeId The recipe ID. Must be an integer.
 * @param ingredients The ingredients to add. Must be an array of objects with an id and amount property.
 * @returns An object with the properties 'queryString' (containing the postgres query string to insert all recipe ingredients) and 'parameters' (containing an array of all parameter values).
 * @example
 * getInsertIngredientQuery(1, [{id: 1, amount: 5}, {id: 2, amount: 3}]);
 * // returns:
 *  {
 *      queryString: "INSERT INTO recipes_ingredients (ingredient_id, recipe_id, amount) VALUES ($1, $2, $3), ($4, $5, $6)",
 *      parameters: [1, 1, 5, 2, 1, 3]
 *  }
 */
function getInsertIngredientQuery(recipeId: number, ingredients: RecipeIngredient[]) {
    // Create variables used to create querystrings
    let queryString: string, queryValues: string[], parameters: QueryParameter[];

    // Initialise querystring variables
    queryString = `INSERT INTO recipes_ingredients (ingredient_id, recipe_id, amount) VALUES `;
    queryValues = [];
    parameters = [];

    // Loop over recipe ingredients
    ingredients.forEach((ingredient: RecipeIngredient, index: number) => {
        const { id, amount } = ingredient;

        // Add parameters to array
        parameters = [
            ...parameters,
            id as number,
            recipeId,
            amount
        ];

        // Set up variables to be added to query string
        queryValues.push(`($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`);
    });

    // Add query variables to the query string and log the result
    queryString += queryValues.join(", ");
    return {
        queryString,
        parameters
    };
}

/**
 * Create an insert query string for all recipe steps.
 * @param recipeId The recipe ID. Must be an integer.
 * @param steps The steps to add. Must be an array of strings.
 * @returns An object with the properties 'queryString' (containing the postgres query string to insert all steps) and 'parameters' (containing an array of all parameter values).
 * @example
 * getInsertStepsQuery(1, ["Boil pasta", "Cook sauce", "Combine"]);
 * // returns:
 *  {
 *      queryString: "INSERT INTO steps (recipe_id, step_number, description) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)",
 *      parameters: [1, 1, 'Boil pasta', 1, 2, 'Cook sauce', 1, 3, 'Combine']
 *  }
 */
function getInsertStepsQuery(recipeId: number, steps: string[]) {
    // Create variables used to create querystrings
    let queryString: string, queryValues: string[], parameters: QueryParameter[];

    // Initialise query string variables
    queryString = "INSERT INTO steps (recipe_id, step_number, description) VALUES ";
    queryValues = [];
    parameters = [];

    // Loop over recipe steps
    steps.forEach((step: string, index: number) => {

        // Add parameters to array
        parameters = [
            ...parameters,
            recipeId,
            index + 1,
            step
        ];

        // Set up query variables
        queryValues.push(`($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`);
    });

    // Add variables to query string
    queryString += queryValues.join(", ");

    return {
        queryString,
        parameters
    }
}