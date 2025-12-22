"use client";
import QuickCollabTypingLoader from "@/components/quick_collab_typing_loader";
import { Button } from "@/components/ui/button";
import { useJoinWorkspace } from "@/features/workspace/hooks/use_join_workspace";
import { useWorkspaceInfo } from "@/features/workspace/hooks/use_workspace_info";
import { getWorkspaceQuery } from "@/features/workspace/hooks/use_workspaces";
import { useWorkspaceId } from "@/hooks/use_workspace_id";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspace, isLoading } = useWorkspaceInfo(workspaceId);

  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  const handleJoin = (value: string) => {
    joinWorkspace(
      { workspaceId, joinCode: value },
      {
        onSuccess: () => {
          toast.success("Joined successfully!");
          router.replace(`/w/${workspaceId}`);
        },
        onError: (err: any) => {
          let message = "Something went wrong";
          if (err?.status === 409) {
            router.replace(`/w/${workspaceId}`);
            message = err.response.data.message;
          } else if (err?.response?.data?.message) {
            message = err.response.data.message;
          } else if (err?.message) {
            message = err.message;
          }
          toast.error(message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full items-center justify-center flex">
        {/* <Loader2 className="size-6 animate-spin text-muted-foreground" /> */}
        <QuickCollabTypingLoader />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-6 items-center justify-center p-4">
      <Image src="/hashtag.png" width={120} height={120} alt="Logo" />

      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">
            Join Workspace({workspace?.name})
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>

        <VerificationInput
          length={6}
          autoFocus
          validChars="a-zA-Z0-9"
          onComplete={handleJoin}
          classNames={{
            container: cn(
              "flex gap-x-3",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase w-12 h-14 rounded-md border border-neutral-300 flex items-center justify-center text-xl font-semibold bg-white text-neutral-700 shadow-sm",
            characterInactive:
              "bg-neutral-100 text-neutral-300 border-neutral-200",
            characterSelected: "border-black shadow-md text-black bg-white",
            characterFilled: "border-black bg-white text-black",
          }}
        />
      </div>

      <div>
        <Button size="lg" variant="outline" asChild disabled={isPending}>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
