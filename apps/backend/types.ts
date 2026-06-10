import z from "zod"

export const PreIntrerviewBody = z.object({
    linkdin: z.string(),
    github: z.string()
})