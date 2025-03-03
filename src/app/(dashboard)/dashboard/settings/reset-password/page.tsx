import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
      <Card>
          <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>
                  Please enter your new password below.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
                  <Label htmlFor="password">New password</Label>
                  <Input
                      type="password"
                      name="password"
                      placeholder="New password"
                      required
                  />
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      required
                  />
                  <SubmitButton formAction={resetPasswordAction}>
                      Reset password
                  </SubmitButton>
                  <FormMessage message={searchParams} />
              </form>
          </CardContent>
      </Card>
  );
}
