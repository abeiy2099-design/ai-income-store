import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Consulting from './pages/Consulting';
import ConsultationSuccess from './pages/ConsultationSuccess';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Products } from './pages/Products';
import { Success } from './pages/Success';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/products" element={<Products />} />
          <Route path="/success" element={<Success />} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/checkout/success" element={<Layout><CheckoutSuccess /></Layout>} />
          <Route path="/consulting" element={<Layout><Consulting /></Layout>} />
          <Route path="/consultation-success" element={<Layout><ConsultationSuccess /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;