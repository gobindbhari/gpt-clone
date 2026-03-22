import { z } from "zod/v4";

export const webSearchSchema = z.object({
  query: z.string().min(1, "Query cannot be empty")
});

export const webSearchOutputSchema = z.array(z.string());
