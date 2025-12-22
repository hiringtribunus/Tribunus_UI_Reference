/**
 * Mock data store for development/testing
 * Replace with real Supabase calls once configured
 */

export interface MockProject {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

// In-memory data store
let mockProjects: MockProject[] = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Downtown Office Complex",
    address: "123 Main St, San Francisco, CA 94102",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    name: "Riverside Residential Development",
    address: "456 River Rd, Portland, OR 97201",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    name: "Tech Campus Expansion",
    address: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Simulates async delay for realistic feel
 */
function delay(ms: number = 50) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a UUID-like ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface MockQueryParams {
  q?: string;
  sort?: "updated_desc" | "created_desc" | "name_asc";
  limit?: number;
}

/**
 * Get all projects with optional search and sort
 */
export async function getMockProjects(
  params: MockQueryParams = {}
): Promise<MockProject[]> {
  await delay();

  let result = [...mockProjects];

  // Search filter
  if (params.q) {
    const query = params.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.address?.toLowerCase().includes(query)
    );
  }

  // Sort
  const sort = params.sort || "updated_desc";
  result.sort((a, b) => {
    switch (sort) {
      case "updated_desc":
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case "created_desc":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "name_asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Limit
  if (params.limit) {
    result = result.slice(0, params.limit);
  }

  return result;
}

/**
 * Get a single project by ID
 */
export async function getMockProjectById(
  id: string
): Promise<MockProject | null> {
  await delay();
  return mockProjects.find((p) => p.id === id) || null;
}

/**
 * Create a new project
 */
export async function createMockProject(input: {
  name: string;
  address?: string | null;
}): Promise<MockProject> {
  await delay();

  const now = new Date().toISOString();
  const newProject: MockProject = {
    id: generateId(),
    name: input.name,
    address: input.address || null,
    created_at: now,
    updated_at: now,
  };

  mockProjects.unshift(newProject);
  return newProject;
}

/**
 * Update a project's name
 */
export async function updateMockProject(
  id: string,
  updates: { name?: string; address?: string | null }
): Promise<MockProject | null> {
  await delay();

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  mockProjects[index] = {
    ...mockProjects[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return mockProjects[index];
}

/**
 * Delete a project
 */
export async function deleteMockProject(id: string): Promise<boolean> {
  await delay();

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return false;

  mockProjects.splice(index, 1);
  return true;
}

// ============================================================================
// Project Profiles Mock Storage
// ============================================================================

import { ProjectProfile, ProjectProfileData } from "@/lib/projects/profile-types";
import { createDefaultProfile } from "@/lib/projects/profile-defaults";

// In-memory profile storage (Map for O(1) lookup)
let mockProfiles: Map<string, ProjectProfile> = new Map();

/**
 * Get project profile by project ID
 * Auto-creates a default profile if one doesn't exist
 */
export async function getMockProjectProfile(
  projectId: string
): Promise<ProjectProfile | null> {
  await delay();

  // Auto-create if doesn't exist
  if (!mockProfiles.has(projectId)) {
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) return null;

    const defaultProfile = createDefaultProfile(
      projectId,
      project.name,
      project.address
    );
    mockProfiles.set(projectId, defaultProfile);
  }

  return mockProfiles.get(projectId) || null;
}

/**
 * Update project profile
 */
export async function updateMockProjectProfile(
  projectId: string,
  data: ProjectProfileData,
  setupStatus: "draft" | "complete"
): Promise<ProjectProfile> {
  await delay();

  const updated: ProjectProfile = {
    project_id: projectId,
    updated_at: new Date().toISOString(),
    setup_status: setupStatus,
    data,
  };

  mockProfiles.set(projectId, updated);
  return updated;
}
