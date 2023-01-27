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

            /* =================
            *  Insert New Recipe
            *  =================
            */

            // Create new recipe and retrieve new recipe id
            const result = await query("INSERT INTO recipes (name, description, course_id, serves, prep_time, cook_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [name, description, course_id, serves, prep_time, cook_time]);
            const newRecipe: { id: number} = result.rows[0];

            // Create variables used to create querystrings
            let queryString: string, queryValues: string[], parameters: QueryParameter[];

            /* =========================
            *  Insert Recipe Ingredients
            *  =========================
            */

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
                    newRecipe.id,
                    amount
                ];

                // Set up variables to be added to query string
                queryValues.push(`($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`);
            });

            // Add query variables to the query string and log the result
            queryString += queryValues.join(", ");
            console.log(queryString);

            // Run the query
            await query(queryString, parameters);

            /* ===================
            *  Insert Recipe Steps
            *  ===================
            */

            // Initialise query string variables
            queryString = "INSERT INTO steps (recipe_id, step_number, description) VALUES ";
            queryValues = [];
            parameters = [];

            // Loop over recipe steps
            steps.forEach((step: string, index: number) => {

                // Set up parameter array
                parameters = [
                    ...parameters,
                    newRecipe.id,
                    index + 1,
                    step
                ];

                // Set up query variables
                queryValues.push(`($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`);
            });

            // Add variables to query string
            queryString += queryValues.join(", ");
            
            // Run the query
            await query(queryString, parameters);
            
            // Send the response
            res.status(201).json({newRecipe, message: `Successfully created new recipe with id ${newRecipe.id}`});
        } catch (error) {
            console.log({error});
            res.status(400).json({error});
        }
        
    })
    .put(async (req: NextApiRequest, res: NextApiResponse) => {

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