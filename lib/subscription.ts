import { Category } from "@/models/category";
import { Project } from "@/models/project";
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from "@/types/subscription";

export async function checkSubscriptionLimits(userId: string, subscriptionTier: SubscriptionTier) {
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];
  
  // Check category limit
  const categoryCount = await Category.countDocuments({ userId });
  if (categoryCount >= limits.maxCategories) {
    throw new Error(`You have reached the maximum number of categories (${limits.maxCategories}) for your subscription tier.`);
  }

  // Check projects per category limit
  const categories = await Category.find({ userId });
  for (const category of categories) {
    const projectCount = await Project.countDocuments({ 
      userId, 
      category: category.id 
    });
    if (projectCount >= limits.maxProjectsPerCategory) {
      throw new Error(`You have reached the maximum number of projects (${limits.maxProjectsPerCategory}) for category "${category.name}".`);
    }
  }
}