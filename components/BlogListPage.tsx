import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { fetchBlogPosts } from '../services/blogService';

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <Link to={`/blog/${post.slug}`} className="block group">
        <div className="overflow-hidden rounded-lg">
            <img src={post.image_url || 'https://placehold.co/600x400/EEE/31343C?text=Blog'} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="mt-4">
            <p className="text-sm text-gray-500">{post.category.name} &bull; {new Date(post.created_at).toLocaleDateString('fa-IR')}</p>
            <h3 className="text-xl font-bold text-gray-900 mt-2 group-hover:text-indigo-600">{post.title}</h3>
            {/* A short snippet of the content could go here */}
        </div>
    </Link>
);

const BlogListPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const data = await fetchBlogPosts(page);
            setPosts(prev => [...prev, ...data.results]);
            setHasNextPage(data.next !== null);
            setLoading(false);
        };
        loadPosts();
    }, [page]);

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">وبلاگ</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {hasNextPage && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={loading}
                            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                        >
                            {loading ? 'در حال بارگذاری...' : 'پست‌های بیشتر'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListPage;
