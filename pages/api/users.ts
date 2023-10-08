import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import bcrypt from 'bcrypt'

const userHandler = nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res) => {
        console.log(err);
        res.status(500).json({err});
    },
    onNoMatch: (req, res) => {
        res.status(501).send({error: `Method '${req.method}' not allowed!`});
    }
})
    .post(async (req, res) => {
        const { email, username, password } = req.body;
        const errors = [];

        let result = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length) errors.push(`The provided username is already in use.`);
        
        result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length) errors.push(`The provided email address is already in use.`);

        if(errors.length) return res.status(403).json({errors: errors});

        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(password, salt);

        const registerResult = await query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id', [email, username, hashedPassword]);
        const newUserId = registerResult.rows[0];

        return res.status(201).json({message: `User ${username} successfully registered. New user id: ${newUserId}.`});
    })


export default userHandler;