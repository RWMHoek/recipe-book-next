import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "./db";
import nextConnect, { NextConnect } from "next-connect";


const ingredientHandler: NextConnect<NextApiRequest, NextApiResponse> = nextConnect({
    onError: (err, req, res, next) => {
        res.status(500).json({err});
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        res.status(501).send({error: `Method '${req.method}' not allowed!`});
    }
})
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        const { name, unit_id, category_id } = req.body;
        try {
            const result = await query("INSERT INTO ingredients (name, unit_id, category_id) VALUES ($1, $2, $3) RETURNING id", [name, unit_id, category_id]);
            const newIngredient = result.rows[0];
            res.status(201).json({newIngredient, message: `Successfully created new ingredient with id ${newIngredient.id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    })
    .put(async (req: NextApiRequest, res: NextApiResponse) => {
        const { name, unit_id, category_id, id} = req.body;
        try {
            await query("UPDATE ingredients SET name = $1, unit_id = $2, category_id = $3 WHERE id = $4", [name, unit_id, category_id, id]);
            res.status(200).send({message: `Successfully updated ingredient with id ${id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    })
    .delete(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await query("DELETE FROM ingredients WHERE id = $1", [req.body.id]);
            res.status(200).send({message: `Successfully deleted ingredient with id ${req.body.id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    });

export default ingredientHandler;