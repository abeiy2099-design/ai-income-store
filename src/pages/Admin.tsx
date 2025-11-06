import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FileUpload from '../components/FileUpload';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  is_published: boolean;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'products' | 'blog'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    download_url: '',
    category: 'ebook',
    is_featured: false,
    is_active: true,
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    is_published: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchBlogPosts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchBlogPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, is_published')
      .order('created_at', { ascending: false });
    setBlogPosts(data || []);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
    };

    if (editingProduct) {
      await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert([productData]);
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      price: '',
      image_url: '',
      download_url: '',
      category: 'ebook',
      is_featured: false,
      is_active: true,
    });
    fetchProducts();
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      ...blogForm,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      published_at: blogForm.is_published ? new Date().toISOString() : null,
    };

    if (editingBlog) {
      await supabase
        .from('blog_posts')
        .update(blogData)
        .eq('id', editingBlog.id);
    } else {
      await supabase.from('blog_posts').insert([blogData]);
    }

    setShowBlogForm(false);
    setEditingBlog(null);
    setBlogForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      is_published: false,
    });
    fetchBlogPosts();
  };

  const deleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchBlogPosts();
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url || '',
      download_url: product.download_url || '',
      category: product.category,
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setShowProductForm(true);
  };

  const startEditBlog = async (post: BlogPost) => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', post.id)
      .single();

    if (data) {
      setEditingBlog(data);
      setBlogForm({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || '',
        image_url: data.image_url || '',
        is_published: data.is_published,
      });
      setShowBlogForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-[#2C2E83] mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Admin Dashboard
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package size={20} />
            Products
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            Blog Posts
          </button>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Products
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-[#00D4FF]">
                <h3 className="text-xl font-bold text-[#2C2E83] mb-6">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Title"
                      required
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      required
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    required
                    rows={4}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Cover Image URL (optional)"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  />
                  <FileUpload
                    label="Upload eBook File"
                    currentFile={productForm.download_url}
                    onUploadComplete={(url) => setProductForm({ ...productForm, download_url: url })}
                    accept=".pdf,.epub,.mobi"
                  />
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  >
                    <option value="ebook">eBook</option>
                    <option value="template">Template</option>
                    <option value="course">Course</option>
                    <option value="digital">Digital Product</option>
                  </select>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={productForm.is_featured}
                        onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span>Featured</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={productForm.is_active}
                        onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg"
                    >
                      {editingProduct ? 'Update' : 'Create'} Product
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="text-xl font-bold text-[#2C2E83] mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-[#8A2BE2] mb-3">${product.price}</p>
                  <div className="flex gap-2 mb-4">
                    {product.is_featured && (
                      <span className="bg-[#FFC300] text-[#2C2E83] text-xs font-bold px-2 py-1 rounded">Featured</span>
                    )}
                    {product.is_active && (
                      <span className="bg-[#00D4FF] text-[#2C2E83] text-xs font-bold px-2 py-1 rounded">Active</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditProduct(product)}
                      className="flex-1 bg-[#2C2E83] text-white py-2 px-4 rounded-lg hover:bg-[#8A2BE2] flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2C2E83]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Blog Posts
              </h2>
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setShowBlogForm(true);
                }}
                className="bg-gradient-to-r from-[#FFC300] to-[#FF8C00] text-[#2C2E83] font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add Blog Post
              </button>
            </div>

            {showBlogForm && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-[#00D4FF]">
                <h3 className="text-xl font-bold text-[#2C2E83] mb-6">
                  {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
                </h3>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post Title"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Slug (URL-friendly, leave blank to auto-generate)"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  />
                  <textarea
                    placeholder="Excerpt (short summary)"
                    rows={3}
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  />
                  <textarea
                    placeholder="Content (Markdown supported)"
                    required
                    rows={12}
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none font-mono text-sm"
                  />
                  <input
                    type="url"
                    placeholder="Featured Image URL"
                    value={blogForm.image_url}
                    onChange={(e) => setBlogForm({ ...blogForm, image_url: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#00D4FF] focus:outline-none"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={blogForm.is_published}
                      onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span>Published</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#2C2E83] to-[#8A2BE2] text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg"
                    >
                      {editingBlog ? 'Update' : 'Create'} Post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlogForm(false);
                        setEditingBlog(null);
                      }}
                      className="bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#2C2E83] mb-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      post.is_published ? 'bg-[#00D4FF] text-[#2C2E83]' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditBlog(post)}
                      className="bg-[#2C2E83] text-white py-2 px-4 rounded-lg hover:bg-[#8A2BE2] flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBlogPost(post.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}