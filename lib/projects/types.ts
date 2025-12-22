import { z } from "zod";

/**
 * Project entity matching database schema
 */
export interface Project {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Query parameters for listing projects
 */
export interface ProjectsQueryParams {
  q?: string;
  sort?: "updated_desc" | "created_desc" | "name_asc";
  limit?: number;
}

/**
 * Zod schema for project name validation
 */
export const projectNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name must be less than 80 characters");

/**
 * Zod schema for project address validation
 */
export const projectAddressSchema = z
  .string()
  .trim()
  .max(200, "Address must be less than 200 characters")
  .nullable()
  .optional();

/**
 * Zod schema for creating a project
 */
export const createProjectSchema = z.object({
  name: projectNameSchema,
  address: projectAddressSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Zod schema for renaming a project
 */
export const renameProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
  name: projectNameSchema,
});

export type RenameProjectInput = z.infer<typeof renameProjectSchema>;

/**
 * Zod schema for deleting a project
 */
export const deleteProjectSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
