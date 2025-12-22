import { z } from "zod";

import { SourceFormat, SourceKind } from "./types";

const titleSchema = z
  .string()
  .trim()
  .min(2, "Title must be at least 2 characters")
  .max(120, "Title must be at most 120 characters");

const optionalTextSchema = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  });

const dateSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === undefined || value === null) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  })
  .refine(
    (value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Date must be in YYYY-MM-DD format"
  );

export const tagsInputSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) return [] as string[];

    const tags = (Array.isArray(value) ? value : value.split(","))
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return tags;
  })
  .refine((tags) => tags.length <= 20, "You can add up to 20 tags")
  .refine(
    (tags) => tags.every((tag) => tag.length <= 32),
    "Each tag must be 32 characters or fewer"
  );

const baseMetadataSchema = z.object({
  kind: z.nativeEnum(SourceKind),
  title: titleSchema,
  publisher: optionalTextSchema,
  published_at: dateSchema,
  meeting_date: dateSchema,
  meeting_body: optionalTextSchema,
  agenda_item: optionalTextSchema,
  project_ref: optionalTextSchema,
  tags: tagsInputSchema,
  notes: optionalTextSchema,
});

const fileFieldsSchema = z.object({
  format: z.literal(SourceFormat.File),
  storage_path: z.string().trim().min(1, "File storage path is required"),
  mime_type: optionalTextSchema,
  file_size_bytes: z.number().int().nonnegative().optional().nullable(),
  url: z.null().optional(),
});

const urlFieldsSchema = z.object({
  format: z.literal(SourceFormat.Url),
  url: z.string().trim().url("Enter a valid URL"),
  storage_path: z.null().optional(),
  mime_type: z.null().optional(),
  file_size_bytes: z.null().optional(),
});

export const createSourceSchema = z.discriminatedUnion("format", [
  baseMetadataSchema.merge(urlFieldsSchema),
  baseMetadataSchema.merge(fileFieldsSchema),
]);

export type ValidatedCreateSource = z.infer<typeof createSourceSchema>;

const updateBaseSchema = z.object({
  id: z.string().min(1, "Source ID is required"),
  kind: z.nativeEnum(SourceKind).optional(),
  title: titleSchema.optional(),
  publisher: optionalTextSchema,
  published_at: dateSchema,
  meeting_date: dateSchema,
  meeting_body: optionalTextSchema,
  agenda_item: optionalTextSchema,
  project_ref: optionalTextSchema,
  tags: tagsInputSchema,
  notes: optionalTextSchema,
  status: z.enum(["active", "archived"]).optional(),
  ingestion: z.enum(["not_ingested", "queued", "done", "error"]).optional(),
});

const updateUrlFieldsSchema = z.object({
  format: z.literal(SourceFormat.Url),
  url: z.string().trim().url("Enter a valid URL").optional(),
  storage_path: z.null().optional(),
  mime_type: z.null().optional(),
  file_size_bytes: z.null().optional(),
});

const updateFileFieldsSchema = z.object({
  format: z.literal(SourceFormat.File),
  storage_path: z.string().trim().min(1, "File storage path is required").optional(),
  mime_type: optionalTextSchema,
  file_size_bytes: z.number().int().nonnegative().optional().nullable(),
  url: z.null().optional(),
});

const updateNeutralSchema = z.object({
  format: z.nativeEnum(SourceFormat).optional(),
  url: z.string().trim().url("Enter a valid URL").optional().nullable(),
  storage_path: z.string().trim().min(1, "File storage path is required").optional().nullable(),
  mime_type: optionalTextSchema,
  file_size_bytes: z.number().int().nonnegative().optional().nullable(),
});

export const updateSourceSchema = z.union([
  updateBaseSchema.merge(updateUrlFieldsSchema),
  updateBaseSchema.merge(updateFileFieldsSchema),
  updateBaseSchema.merge(updateNeutralSchema),
]);

export type ValidatedUpdateSource = z.infer<typeof updateSourceSchema>;
