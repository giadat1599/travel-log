import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { InsertLocationSchema } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocationSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "Location with this name already exists",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  const created = await insertLocation(result.data, slug, event.context.user.id);

  return created;
});
