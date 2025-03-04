'use client';

import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserItem } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserId } from "@/hooks/useUserId";
import { userSchema } from "@/app/(dashboard)/dashboard/admin/schema";
import { createUser, updateUser } from "@/app/(dashboard)/dashboard/admin/actions";

const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "User", value: "user" },
];

export default function UserForm({ user, edit, setOpen }: { user?: UserItem, edit: boolean, setOpen: (open: boolean) => void }) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { userId, loading: userLoading } = useUserId();

    useEffect(() => {
        if (!userLoading) {
            setLoading(false);
        }
    }, [userLoading]);

    const form = useForm<z.infer<ReturnType<typeof userSchema>>>({
        resolver: zodResolver(userSchema(edit)),
        defaultValues: {
            username: user?.name || "",
            password: "",
            password_confirmation: "",
            email: user?.email || "",
            role: user?.role.value ?? "user",
        },
    });

    async function onSubmit(values: z.infer<ReturnType<typeof userSchema>>) {
        try {
            setLoading(true);
            if (!userId) throw new Error("User not authenticated!");

            if (edit && user) {
                if (user.inAuth) {
                    const { error: authError } = await updateUser(user, values);

                    if (authError) throw new Error(authError.message);
                }

                if (user.name !== values.username || user.role.value !== values.role) {
                    const { error } = await supabase.from('users').update({
                        user_name: values.username || user.name,
                        role: values.role || user.role.value,
                    }).eq('id', user.id).single();

                    if (error) throw new Error(error.message);
                }

                toast.success("User updated successfully!");
            } else {
                const { data, error: authError } = await createUser(values);

                if (authError) throw new Error(authError.message);

                const { error } = await supabase.from('users').insert({
                    id: data!.user!.id,
                    user_name: values.username,
                    role: values.role,
                    created_by: userId,
                });

                if (error) throw new Error(error.message);

                toast.success("User added successfully");
            }
            router.refresh();
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "An error occurred!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4">
                <FormField
                    control={ form.control }
                    name="username"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>User Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter a user name"
                                    required
                                    disabled={ loading }
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="email"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>E-Mail</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    disabled={ loading }
                                    placeholder="Enter an email address"
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="password"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter a password"
                                    required
                                    disabled={ loading }
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="password_confirmation"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm password"
                                    required
                                    disabled={ loading }
                                    { ...field }
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="role"
                    render={ ({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Role</FormLabel>

                            <Select
                                onValueChange={ (value) => field.onChange(value) }
                                disabled={ loading }
                                { ...field }

                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    { roleOptions.map((role) => (
                                        <SelectItem key={ role.value } value={ role.value }>{ role.label }</SelectItem>
                                    )) }
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />

                {/* Submit Button */ }
                <Button disabled={ loading } type="submit" className="w-full">
                    { edit ? "Save" : "Create" }
                </Button>
            </form>
        </Form>
    );

}