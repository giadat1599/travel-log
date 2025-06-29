import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().min(1, "You must enter a search term"),
});

export type SearchSchema = z.infer<typeof searchSchema>;
