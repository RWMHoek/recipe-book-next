import nextConnect, { NextConnect } from "next-connect";
import { query } from "./db";
import type { NextApiRequest, NextApiResponse } from "next";
import { RecipeIngredient } from "../recipes";

const recipeHandler: NextConnect<NextApiRequest, NextApiResponse> = nextConnect({
    onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
        res.status(500).json({err});
    },
    onNoMatch: (req, res) => {
        res.status(501).send({error: `Method '${req.method}' not allowed!`});
    }
})
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        const { name, description, course, serves, prep_time, cook_time, ingredients, steps } = req.body;

        try {
            const result = await query("INSERT INTO recipes (name, description, course, serves, prep_time, cook_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [name, description, course, serves, prep_time, cook_time]);
            const newRecipe = result.rows[0];

            ingredients.foreach(async (ingredient: RecipeIngredient) => {
                const { ingredient_id, amount } = ingredient;
                await query("INSERT INTO recipes_ingredients (ingredient_id, recipe_id, amount) VALUES ($1, $2, $3)", [ingredient_id, newRecipe.id, amount]);
            });

            steps.foreach(async (step: string, index: number) => {
                await query("INSERT INTO steps (recipe_id, step_number, description) VALUES ($1, $2, $3)", [newRecipe.id, index + 1, step]);
            });

            res.status(201).json({newRecipe, message: `Successfully created new recipe with id ${newRecipe.id}`});
        } catch (error) {
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