import { PaginatedResponse } from '../types'; // Assuming posts will be paginated
// Forward-declare Post and Category types, will add to types.ts next
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  category: { name: string; slug: string; };
  content: string;
  image_url: string;
  created_at: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/blog';

export const fetchBlogPosts = async (page: number = 1): Promise<PaginatedResponse<BlogPost>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/?page=${page}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return { count: 0, next: null, previous: null, results: [] };
  }
};

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error);
    return null;
  }
};
