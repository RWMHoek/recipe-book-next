import type { NextApiResponse, NextApiRequest } from "next";
import { query } from "../../lib/db";
import nextConnect from "next-connect";

const ingredientHandler = nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res) => {
        console.log(err);
        res.status(500).json({err});
    },
    onNoMatch: (req, res) => {
        res.status(501).send({error: `Method '${req.method}' not allowed!`});
    }
})
    .post(async (req, res) => {
        const { name, unit_id, category_id } = req.body;
        try {
            const result = await query("INSERT INTO ingredients (name, unit_id, category_id) VALUES ($1, $2, $3) RETURNING id", [name, unit_id, category_id]);
            const newIngredient = result.rows[0];
            res.status(201).json({newIngredient, message: `Successfully created new ingredient with id ${newIngredient.id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    })
    .put(async (req, res) => {
        const { name, unit_id, category_id, id} = req.body;
        try {
            await query("UPDATE ingredients SET name = $1, unit_id = $2, category_id = $3 WHERE id = $4", [name, unit_id, category_id, id]);
            res.status(200).send({message: `Successfully updated ingredient with id ${id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    })
    .delete(async (req, res) => {
        try {
            await query("DELETE FROM ingredients WHERE id = $1", [req.body.id]);
            res.status(200).send({message: `Successfully deleted ingredient with id ${req.body.id}`});
        } catch (error) {
            res.status(400).json({error});
        }
    });

export default ingredientHandler;