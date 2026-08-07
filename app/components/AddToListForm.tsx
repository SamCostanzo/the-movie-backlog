"use client";

import { useActionState } from "react";
import { addMovieToList } from "@/app/lib/actions";
import { List } from "@/app/generated/prisma/client";

export default function AddToListForm({ movieId, userLists }: { movieId: number; userLists: List[] }) {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await addMovieToList(formData);
  }, null);

  return (
    <div>
      <form action={formAction} className="flex gap-2 items-center">
        <input type="hidden" name="movieId" value={movieId} />
        <select name="listId" className="border-2 border-ink rounded-full text-sm px-4 py-2 bg-surface text-ink">
          {userLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isPending} className="bg-teal text-background rounded-full px-5 py-2 uppercase text-sm tracking-wider cursor-pointer">
          {isPending ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Feedback message */}
      {state?.error && <p className="text-brand text-sm mt-2">{state.error}</p>}
      {state?.success && <p className="text-teal text-sm mt-2">✓ Added to list!</p>}
    </div>
  );
}
