import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export function Form() {
    const navigate = useNavigate();
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!github || !linkedin) {
            console.log("There is an empty field. Please fill it.");
            toast.error("Please enter both LinkedIn and GitHub URLs");
            return;
        }

        try {
            console.log({
                linkedin,
                github,
            });

            const { data } = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
                linkedin,
                github,
            }, {
                headers: {
                    "content-type": "appliction/json"
                }
            }
            )
            console.log(data);

            toast.success("Interview started!");
            navigate("/interview");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center mb-10">
                Interview AI
            </h2>

            <form
                onSubmit={onSubmit}
                className="flex w-full justify-center items-center gap-4"
            >
                <Input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    type="text"
                    placeholder="Enter LinkedIn URL"
                />

                <Input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    type="text"
                    placeholder="Enter GitHub URL"
                />

                <Button type="submit" className="cursor-pointer ">
                    Start Interview
                </Button>
            </form>
        </div>
    );
}