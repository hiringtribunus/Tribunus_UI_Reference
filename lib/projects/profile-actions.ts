"use server";

import { revalidatePath } from "next/cache";
import { updateProfileSchema, ProjectProfile } from "./profile-types";
import { updateMockProjectProfile } from "@/lib/supabase/mock";
import { computeSetupStatus } from "./profile-defaults";
import { geocodeAddress } from "@/lib/maps/mock-geocode";

/**
 * Server action to update project profile
 * Handles validation, geocoding, and status computation
 */
export async function updateProjectProfile(formData: unknown): Promise<{
  profile: ProjectProfile | null;
  error: string | null;
}> {
  try {
    // Validate input with Zod
    const validated = updateProfileSchema.parse(formData);
    const { projectId, profileData } = validated;

    // Geocode if address exists and no coordinates
    if (profileData.overview.siteAddress && !profileData.location.lat) {
      try {
        const coords = await geocodeAddress(
          profileData.overview.siteAddress,
          profileData.overview.city,
          profileData.overview.province
        );

        if (coords) {
          profileData.location = {
            ...profileData.location,
            ...coords,
          };
        }
      } catch (geocodeError) {
        // Log but don't fail - save can still succeed without coordinates
        console.warn("Geocoding failed:", geocodeError);
      }
    }

    // Compute setup status based on required fields
    const setupStatus = computeSetupStatus(profileData);

    // Update mock storage
    const profile = await updateMockProjectProfile(
      projectId,
      profileData,
      setupStatus
    );

    // Revalidate relevant paths
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects");

    return { profile, error: null };
  } catch (error) {
    console.error("Failed to update profile:", error);

    if (error instanceof Error) {
      return { profile: null, error: error.message };
    }

    return { profile: null, error: "Failed to update profile. Please try again." };
  }
}
