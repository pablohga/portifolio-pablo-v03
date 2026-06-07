export interface About {
  _id?: string;
  title: string;
  description: string;
  projectsDelivered?: string;
  satisfiedClients?: string;
  experienceTime?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
