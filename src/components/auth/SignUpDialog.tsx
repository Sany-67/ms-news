import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import SignUp from "./SignUp";
import { Button } from "../ui/button";

interface SignUpDialogProps {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SignUpDialog({
  trigger,
  defaultOpen = false,
}: SignUpDialogProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="default"
            size="sm"
            className="bg-white text-black hover:bg-white/90"
          >
            Sign Up
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <SignUp isDialog onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
