"use client";

import { useAuthContext } from "@/context/auth.context";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use_create_workspace_model";
import { getAllworkspacesQuery } from "@/features/workspace/hooks/use_workspaces";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import QuickCollabTypingLoader from "@/components/quick_collab_typing_loader";

export default function Home() {
  const { user, loading: authLoading } = useAuthContext();
  const [open, setOpen] = useCreateWorkspaceModel();
  const router = useRouter();

  const {
    data: workspaces,
    isLoading: workspacesLoading,
  } = getAllworkspacesQuery({
    enabled: !!user, 
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || workspacesLoading || !workspaces) return;

    if (workspaces.length > 0) {
      router.replace(`/w/${workspaces[0]._id}`);
    } else {
      setOpen(true);
    }
  }, [user, workspacesLoading, workspaces, setOpen, router]);

  if (authLoading || workspacesLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <QuickCollabTypingLoader />
      </div>
    );
  }

  return null;
}
