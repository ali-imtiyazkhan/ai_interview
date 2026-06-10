import express from "express";
import { PreIntrerviewBody } from "./types";
import { getUsername } from "./controller/getuserName";
import axios from "axios";
const app = express();
app.use(express.json());

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


    console.log(filtereduserrepos)

    // First Difficult part -- scraping linkdin data





})


app.listen(3001, () => {
    console.log("Server is running on port 3000");
});