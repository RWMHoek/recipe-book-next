import nextConnect, { NextConnect } from "next-connect";
import { query } from "./db";
import type { NextApiRequest, NextApiResponse } from "next";
import { Recipe, RecipeIngredient } from "../recipes";

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
        console.log(req.body);

        try {

            // Create new recipe and retrieve new recipe id
            const result = await query("INSERT INTO recipes (name, description, course_id, serves, prep_time, cook_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [name, description, course_id, serves, prep_time, cook_time]);
            const newRecipe: { id: number} = result.rows[0];

            // Insert Recipe Ingredients
            let queryArgs = getInsertIngredientQuery(newRecipe.id, ingredients);
            await query(queryArgs.queryString, queryArgs.parameters);

            // Insert Recipe Steps
            queryArgs = getInsertStepsQuery(newRecipe.id, steps);
            await query(queryArgs.queryString, queryArgs.parameters);
            
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

function getInsertIngredientQuery(recipeId: number, ingredients: RecipeIngredient[]) {
    // Create variables used to create querystrings
    let queryString: string, queryValues: string[], parameters: QueryParameter[];

    // Initialise querystring variables
    queryString = `INSERT INTO recipes_ingredients (ingredient_id, recipe_id, amount) VALUES `;
    queryValues = [];
    parameters = [];

    // Loop over recipe ingredients
    ingredients.forEach((ingredient: RecipeIngredient, index: number) => {
        const { ingredient_id, amount } = ingredient;

        // Set up parameter array
        parameters = [
            ...parameters,
            ingredient_id as number,
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

function getInsertStepsQuery(recipeId: number, steps: string[]) {
    // Create variables used to create querystrings
    let queryString: string, queryValues: string[], parameters: QueryParameter[];

    // Initialise query string variables
    queryString = "INSERT INTO steps (recipe_id, step_number, description) VALUES ";
    queryValues = [];
    parameters = [];

    // Loop over recipe steps
    steps.forEach((step: string, index: number) => {

        // Set up parameter array
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