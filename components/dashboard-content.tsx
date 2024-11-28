"use client";

// ... (keep existing imports)

interface DashboardContentProps {
  userId: string;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  // ... (keep existing state declarations)

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchCategories(),
      fetchHero(),
      fetchSEO(),
      fetchAbout(),
      fetchContactSettings(),
    ]).finally(() => setIsLoading(false));
  }, [userId]); // Add userId to dependency array

  async function fetchProjects() {
    try {
      const res = await fetch(`/api/projects?userId=${userId}`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    }
  }

  // Update other fetch functions similarly to include userId
  // ... (rest of the component remains the same)
}