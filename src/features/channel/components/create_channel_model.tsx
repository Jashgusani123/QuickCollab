"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateChannelModel } from "../store/use_create_channel_model";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { toast } from "sonner";
import { useCreateChannel } from "../hooks/use_create_channel";
import { useRouter } from "next/navigation";

export const CreateChannelModel = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModel();
  const [name, setName] = useState("");
  const workspaceId = useWorkspaceId();

  const { mutate: createChannel, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase(); 
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createChannel(
      { workspaceId, name },
      {
        onSuccess: (id:any) => {
          router.push(`/w/${workspaceId}/c/${id.data.channel._id}`)
          toast.success("Channel created");
          handleClose();
        },
        onError: (err:any) => {
          let message = "Failed to create channel";
          if(err.status === 409){
            message = "Channel name already exists in this workspace"
          }
          toast.error(message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />

          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
