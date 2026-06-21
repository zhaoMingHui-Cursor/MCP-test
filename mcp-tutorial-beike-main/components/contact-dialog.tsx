"use client";

import { useState } from "react";

import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setFormKey((key) => key + 1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">联系我们</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>联系表单</DialogTitle>
          <DialogDescription>
            填写以下信息，我们会尽快回复您。
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          key={formKey}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
