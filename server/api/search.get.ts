import type { NominatimResult } from "~/lib/types";

import { searchSchema } from "~/lib/zod-schemas";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(defineCachedEventHandler(async (event) => {
  const result = await getValidatedQuery(event, searchSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "travel-log | travel@gmail.com",
      },
    });

    if (!response.ok) {
      return sendError(event, createError({
        status: 504,
        statusMessage: "Unable to reach search api",
      }));
    }
    const results = await response.json() as NominatimResult[];
    return results;
  }
  catch {
    return sendError(event, createError({
      status: 504,
      statusMessage: "Unable to reach search api",
    }));
  }
}, {
  maxAge: 60 * 60 * 24,
  name: "search-nominatim",
  async getKey(event) {
    const query = await getQuery(event);
    return query.q?.toString() || "";
  },
}));
