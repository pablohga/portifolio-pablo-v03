export interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  image: string;
  stars: number;
  text: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
