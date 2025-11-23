import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdmin } from "../../context/AdminContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdmin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Background images for dating app theme
  const backgroundImages = [
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(
          result.error ||
            "Invalid credentials. Use admin@datingapp.com / admin123"
        );
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentBg === index ? 1 : 0,
              scale: currentBg === index ? 1.1 : 1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-600/40 to-indigo-700/50"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 15}px`,
            }}
            animate={{
              y: [window.innerHeight, -100],
              rotate: [0, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200,
                damping: 10
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
              className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-full mb-6 shadow-2xl relative overflow-hidden cursor-pointer"
            >
              {/* Animated Background Pattern */}
              <motion.div 
                className="absolute inset-0"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)",
                    "linear-gradient(225deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    "linear-gradient(315deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Floating Dots */}
                <motion.div 
                  className="absolute top-2 right-3 w-3 h-3 bg-white/40 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0.8, 0.4],
                    x: [0, 2, 0],
                    y: [0, -1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute bottom-3 left-3 w-2 h-2 bg-white/30 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                    x: [0, -1, 0],
                    y: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div 
                  className="absolute top-4 left-1/2 w-1.5 h-1.5 bg-white/35 rounded-full"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.35, 0.9, 0.35],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </motion.div>
              
              {/* Main Logo Icon with Enhanced Animation */}
              <div className="relative z-10 flex items-center justify-center">
                <motion.svg 
                  width="44" 
                  height="44" 
                  viewBox="0 0 40 40" 
                  fill="none" 
                  className="text-white drop-shadow-2xl"
                  animate={{
                    y: [0, -2, 0],
                    filter: [
                      "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                      "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
                      "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Animated Heart Shape */}
                  <motion.path
                    d="M20 35C20 35 3.5 23.5 3.5 14C3.5 9 7.5 5 12.5 5C15.5 5 18 6.5 20 9C22 6.5 24.5 5 27.5 5C32.5 5 36.5 9 36.5 14C36.5 23.5 20 35 20 35Z"
                    fill="currentColor"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: 1,
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      pathLength: { duration: 2, ease: "easeInOut" },
                      opacity: { duration: 1 },
                      scale: { 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                  
                  {/* Animated Admin Crown with Sparkles */}
                  <motion.g
                    animate={{
                      y: [0, -1, 0],
                      rotate: [0, 2, 0, -2, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.path
                      d="M12 8L15 12L20 6L25 12L28 8L26 15H14L12 8Z"
                      fill="url(#crown-gradient)"
                      stroke="white"
                      strokeWidth="1"
                      className="drop-shadow-sm"
                      animate={{
                        fill: [
                          "url(#crown-gradient)",
                          "url(#crown-gradient-bright)",
                          "url(#crown-gradient)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Crown Jewels - Animated Sparkles */}
                    <motion.circle
                      cx="15"
                      cy="10"
                      r="0.8"
                      fill="#fff"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.circle
                      cx="20"
                      cy="8"
                      r="1"
                      fill="#fff"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.3, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    <motion.circle
                      cx="25"
                      cy="10"
                      r="0.8"
                      fill="#fff"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </motion.g>

                  {/* Enhanced Gradients */}
                  <defs>
                    <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffd700" />
                      <stop offset="50%" stopColor="#ffed4a" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <linearGradient id="crown-gradient-bright" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fff59d" />
                      <stop offset="50%" stopColor="#ffd700" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>

              {/* Animated Ring Pulses */}
              <motion.div 
                className="absolute inset-0 border-2 border-white/20 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.5, 0.2],
                  borderColor: [
                    "rgba(255,255,255,0.2)",
                    "rgba(255,192,203,0.4)",
                    "rgba(255,255,255,0.2)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div 
                className="absolute inset-0 border border-pink-300/30 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              {/* Enhanced Glow Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-purple-600/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl font-black text-white mb-2 tracking-tight"
            >
              <motion.span 
                className="bg-gradient-to-r from-pink-200 via-white to-purple-200 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Admin Portal
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-white/90 text-lg font-medium"
            >
              <motion.span
                animate={{
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Love Management Dashboard
              </motion.span>
            </motion.p>
          </div>

          {/* Login Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  placeholder="admin@datingapp.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Signing in...
                  </div>
                ) : (
                  "Sign In to Dashboard"
                )}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl"
            >
              <p className="text-blue-200 text-sm text-center mb-2 font-medium">
                Demo Credentials:
              </p>
              <p className="text-blue-100 text-xs text-center">
                Email: admin@datingapp.com
              </p>
              <p className="text-blue-100 text-xs text-center">
                Password: admin123
              </p>
            </motion.div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-white/60 hover:text-white text-sm transition-colors duration-300"
              >
                ← Back to Main Site
              </Link>
            </div>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-white/70 text-sm">Happy Users</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">5K+</div>
              <div className="text-white/70 text-sm">Matches Made</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-white/70 text-sm">Uptime</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
