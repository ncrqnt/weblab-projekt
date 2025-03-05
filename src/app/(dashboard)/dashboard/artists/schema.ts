import { z } from "zod";


export const artistSchema =
    z.object({
        name: z.string().min(2, "Name is required"),
        profilePicture: z.string().url("Profile Picture has to be a valid URL").optional(),
    });