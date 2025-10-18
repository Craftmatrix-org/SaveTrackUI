import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const CreateAccount = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>Create</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create an Account</AlertDialogTitle>
          <AlertDialogDescription>
            Lets create an account
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Label>Label</Label>
        <Input />
        <Label>Description</Label>
        <Textarea />

        <Label>Initial Value</Label>
        <Input />

        <Label>Is it Credit?</Label>
        <Input />

        <Label>Limit</Label>
        <Input />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
