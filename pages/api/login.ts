import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import bcrypt from 'bcrypt'

const loginHandler = nextConnect<NextApiRequest, NextApiResponse>({
    onError: (err, req, res) => {
        console.log(err);
        res.status(500).json({err});
    },
    onNoMatch: (req, res) => {
        res.status(501).send({error: `Method '${req.method}' not allowed!`});
    }
})
    .post(async (req, res) => {
        const {username, password} = req.body;
        const result = await query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({message: `No user with username ${username} exists!`});
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({message: `Invalid password!`});
        }

        res.status(200).json({user: {id: user.id, username: user.username, email: user.email}, message: `User successfully retrieved`});

    })


export default loginHandler;