"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateDarkPalette } from "@/lib/bg_color_generator";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  acceptRequestMutation,
  declineRequestMutation,
  getIncomingRequestsQuery,
  IncomingRequest,
} from "@/features/request ( notice )/hooks/use_sent_request";
function groupByDate(requests: IncomingRequest[]) {
  const groups: Record<string, IncomingRequest[]> = {};

  for (const req of requests) {
    const date = new Date(req.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    groups[label] = groups[label] ? [...groups[label], req] : [req];
  }

  return groups;
}

export const NoticeList = () => {
  const { data: requests, isLoading } = getIncomingRequestsQuery();
  const { mutate: acceptRequest, isPending: isAccepting } = acceptRequestMutation();
  const { mutate: declineRequest, isPending: isDeclining } = declineRequestMutation();

  const grouped = useMemo(() => groupByDate(requests ?? []), [requests]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-(--content-text-muted) size-5 animate-spin" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <p className="text-(--content-text) text-sm font-medium">You&apos;re all caught up</p>
        <p className="text-(--content-text-muted) text-xs">No new notices right now</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      {Object.entries(grouped).map(([label, items]) => (
        <div key={label}>
          <p className="text-(--content-text-muted) mb-2 text-[11px] tracking-wide uppercase">
            {label}
          </p>
          <div className="flex flex-col gap-2">
            {items.map((request) => (
              <NoticeCard
                key={request.oppUserId}
                request={request}
                onAccept={() =>
                  acceptRequest(
                    { oppUserId: request.oppUserId },
                    {
                      onSuccess: () => toast.success("Request accepted"),
                      onError: () => toast.error("Failed to accept request"),
                    }
                  )
                }
                onDecline={() =>
                  declineRequest(
                    { oppUserId: request.oppUserId },
                    {
                      onSuccess: () => toast.success("Request declined"),
                      onError: () => toast.error("Failed to decline request"),
                    }
                  )
                }
                isAccepting={isAccepting}
                isDeclining={isDeclining}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface NoticeCardProps {
  request: IncomingRequest;
  onAccept: () => void;
  onDecline: () => void;
  isAccepting: boolean;
  isDeclining: boolean;
}

const NoticeCard = ({ request, onAccept, onDecline, isAccepting, isDeclining }: NoticeCardProps) => {
  const colorHex = useMemo(() => generateDarkPalette(1), []);
  const isPending = request.status === "pending";

  return (
    <div
      className={cn(
        "bg-(--content-surface) border-(--content-border) flex items-center gap-3 rounded-xl border p-3",
        isPending && "border-(--border-accent) shadow-[0_0_0_3px_var(--bg-accent)]"
      )}
    >
      <Avatar className="size-9 shrink-0 rounded-full">
        <AvatarImage src={request.image} />
        <AvatarFallback style={{ backgroundColor: colorHex }} className="text-white">
          {request.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          <span className="font-medium">{request.name}</span>{" "}
          <span className="text-(--content-text-muted)">
            {isPending ? "wants to connect" : request.status === "accepted" ? "request accepted" : "request declined"}
          </span>
        </p>
        <p className="text-(--content-text-muted) text-xs">
          {new Date(request.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {isPending ? (
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-(--border-danger) text-(--text-danger) h-7 px-2 text-xs"
            disabled={isDeclining}
            onClick={onDecline}
          >
            <X className="mr-1 size-3.5" />
            Decline
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-(--border-success) text-(--text-success) h-7 px-2 text-xs"
            disabled={isAccepting}
            onClick={onAccept}
          >
            <Check className="mr-1 size-3.5" />
            Accept
          </Button>
        </div>
      ) : (
        <div className="shrink-0">
          {request.status === "accepted" ? (
            <Check className="text-(--text-success) size-4" />
          ) : (
            <X className="text-(--text-danger) size-4" />
          )}
        </div>
      )}
    </div>
  );
};