import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const aggregateReactions = (reactions: any[]) => {
  const map = new Map<string, { value: string; count: number; memberIds: string[] }>();

  reactions.forEach((r) => {
    if (!map.has(r.value)) {
      map.set(r.value, {
        value: r.value,
        count: 1,
        memberIds: [r.memberId],
      });
    } else {
      const entry = map.get(r.value)!;
      entry.count += 1;
      entry.memberIds.push(r.memberId);
    }
  });

  return Array.from(map.values());
};
