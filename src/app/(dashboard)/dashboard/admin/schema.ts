import { z } from "zod";


export const userSchema = (edit: boolean) =>
    z.object({
    username: z.string().min(2, "Username is required"),
    password: edit ? z.string().optional() : z.string().min(8, "Password is required (at least 8 characters)"),
    password_confirmation: edit ? z.string().optional() : z.string().min(8, "Password is required (at least 8 characters)"),
    email: z.string().email("Email is required"),
    role: z.string({
        required_error: "Please select a role",
    }),
}).superRefine((val, ctx) => {
    if (!edit && val.password !== val.password_confirmation) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['password_confirmation'],
        })
    }
});