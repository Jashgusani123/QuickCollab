"use client"
import { useAuthContext } from "@/context/auth.context";
import { UserButton } from "@/features/auth/components/user_button";
import { useCreateWorkspaceModel } from "@/features/workspace/store/use_create_workspace_model";
import { getAllworkspacesQuery } from "@/features/workspace/hooks/use_workspaces";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { user } = useAuthContext();
  const [open, setOpen] = useCreateWorkspaceModel();
  const router = useRouter();
  const { data: workspaces , isLoading} = getAllworkspacesQuery();

  useEffect(() => {

    if (isLoading || !workspaces) return;
      
    if (workspaces.length > 0) {
      router.replace(`/w/${workspaces[0]._id}`);
    } else {
      setOpen(true)
    }
  }, [user, setOpen , workspaces]);

  return <UserButton />;
}
