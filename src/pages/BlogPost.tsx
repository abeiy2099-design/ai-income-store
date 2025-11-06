import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author: string;
  published_at: string;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2C2E83] mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Post Not Found
          </h2>
          <Link to="/blog" className="text-[#8A2BE2] hover:underline">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#2C2E83] hover:text-[#8A2BE2] font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#00D4FF]">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <span>•</span>
              <span>By {post.author}</span>
            </div>

            <h1 className="text-5xl font-bold text-[#2C2E83] mb-8 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {post.title}
            </h1>

            <div
              className="prose prose-lg max-w-none"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-[#2C2E83] mt-8 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-[#2C2E83] mt-6 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-[#2C2E83] mt-4 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
                      {children}
                    </ol>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-[#8A2BE2] hover:underline font-semibold">
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#00D4FF] pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-[#F5F5F7] px-2 py-1 rounded text-[#2C2E83] font-mono text-sm">
                      {children}
                    </code>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <div className="mt-12 bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ready to Start Your AI Business?
          </h3>
          <p className="mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get our free guide and start building your digital income stream today
          </p>
          <Link
            to="/"
            className="inline-block bg-[#FFC300] text-[#2C2E83] font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-200"
          >
            Get Free Guide
          </Link>
        </div>
      </div>
    </div>
  );
}