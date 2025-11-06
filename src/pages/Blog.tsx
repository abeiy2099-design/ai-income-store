import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, image_url, author, published_at, created_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
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
          <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2C2E83] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AI & Business Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Learn about AI tools, digital products, and strategies to grow your online business
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No blog posts yet. Check back soon for insights on AI and digital business!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#00D4FF] group"
              >
                {post.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] flex items-center justify-center">
                    <span className="text-6xl">📝</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>5 min read</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-[#2C2E83] mb-3 group-hover:text-[#8A2BE2] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {post.author}</span>
                    <span className="text-[#2C2E83] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}