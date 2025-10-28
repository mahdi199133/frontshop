import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { fetchBlogPostBySlug } from '../services/blogService';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) return;
            setLoading(true);
            const fetchedPost = await fetchBlogPostBySlug(slug);
            setPost(fetchedPost);
            setLoading(false);
        };
        loadPost();
    }, [slug]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">...در حال بارگذاری</div>;
    }

    if (!post) {
        return <div className="text-center py-20">پست یافت نشد. <Link to="/blog" className="text-indigo-600">بازگشت به وبلاگ</Link></div>;
    }

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <nav className="mb-8">
                    <Link to="/blog" className="text-indigo-600 hover:underline">&larr; بازگشت به وبلاگ</Link>
                </nav>
                <article>
                    <header className="mb-8">
                        <p className="text-gray-500">{post.category.name} &bull; {new Date(post.created_at).toLocaleDateString('fa-IR')}</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">{post.title}</h1>
                        <p className="text-lg text-gray-600 mt-4">نوشته شده توسط: {post.author}</p>
                    </header>
                    {post.image_url && (
                        <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover rounded-lg mb-8" />
                    )}
                    {/* Using dangerouslySetInnerHTML for blog content from a trusted source (CMS/Admin) */}
                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
