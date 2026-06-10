import express from "express";
import { PreIntrerviewBody } from "./types";
import { getUsername } from "./controller/getuserName";
import axios from "axios";
import { Prisma } from "./db";
const app = express();
app.use(express.json());
import cors from "cors"

app.use(cors())

app.post("/api.v1/pre-interview", async (req, res) => {

    const { success, data } = PreIntrerviewBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "incorrect body"
        });
        return
    }

    const githubUrl = data.github;
    const linkdinUrl = data.linkdin

    const githubUserName = getUsername(githubUrl);
    const linkdinUserName = getUsername(linkdinUrl)

    const userRepos = await axios.get(`https://api.github.com/users/${githubUserName}/repos`);
    const filtereduserrepos = userRepos.data.map((x: any) => ({
        description: x.description,
        name: x.name,
        fullname: x.full_name,
        starCount: x.stargazers_count
    }))


    const interView = await Prisma.interView.create({
        data: {
            githunMetaData: JSON.stringify(filtereduserrepos),
            status: "Pre",
            linkdinMataData: "",
            score: 0

        }
    })

    console.log(interView)

    res.status(201).json({
        message: "interview created successfully"
    })
})


app.listen(3001, () => {
    console.log("Server is running on port 3000");
});