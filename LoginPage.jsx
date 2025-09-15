/* import React, { useState } from 'react';   


import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [fields, setFields] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const API_BASE = 'http://localhost:5000';

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword((v) => !v);
  };

  const resetForm = () => {
    setFields({ email: '', password: '', name: '', confirmPassword: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password, name, confirmPassword } = fields;

    // Basic required fields validation
    if (!email.trim() || !password.trim() || (isSignup && !name.trim())) {
      setError('Please enter all required fields.');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        // Signup API call
        await axios.post(
          `${API_BASE}/auth/signup`,
          {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        // Auto login after signup
        const res = await axios.post(
          `${API_BASE}/auth/login`,
          {
            email: email.trim(),
            password: password.trim(),
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (onLogin) onLogin(res.data);
        navigate('/VideoPlayer');

        setIsSignup(false);
        resetForm();
        setIsAdmin(false);
      } else {
        // Login API call
        const res = await axios.post(
          `${API_BASE}/auth/login`,
          {
            email: email.trim(),
            password: password.trim(),
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (onLogin) onLogin(res.data);

        if (isAdmin) {
          if (res.data.role === 'admin') {
            navigate('/admin');
          } else {
            setError('Access denied. You are not an admin.');
          }
        } else {
          navigate('/projects');
        }
      }
    } catch (err) {
      if (!err.response) {
        setError('No server response.');
      } else if (err.response.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response.status === 400) {
        setError('Bad request. Please check your input.');
      } else if (err.response.status === 487) {
        setError('Invalid email or password.');
      } else if (err.response.status === 505) {
        setError('Server does not support the HTTP protocol version.');
      } else if (err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login/Signup failed. Please try again.');
      }
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(to_bottom_right,#1a1a2e,#c53030)] text-foreground">
      <div className="text-center absolute top-12">
        <div className="inline-flex items-center px-4 py-1 rounded-md bg-white shadow text-lg font-bold text-[#2C3E50]">
          CMS <span className="ml-1 text-red-600">—</span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold">CMS Surveillance Platform</h1>
        <p className="text-sm mt-2 text-gray-300">Secure access to CMS surveillance management system</p>
      </div>

      <Card className="w-full max-w-md mt-48">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isSignup ? 'Create your CMS account' : 'Welcome to CMS'}</CardTitle>
          <CardDescription>
            {isSignup ? 'Sign up to get started with CMS surveillance' : 'Sign in to your CMS surveillance account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={fields.name}
                  onChange={handleFieldChange}
                  required
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={fields.email}
                onChange={handleFieldChange}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={fields.password}
                onChange={handleFieldChange}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-[36px] text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleTogglePassword}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isSignup && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={handleFieldChange}
                  required
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center space-x-2">
                <input
                  id="isAdmin"
                  type="checkbox"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <label htmlFor="isAdmin" className="text-sm text-gray-300 select-none cursor-pointer">
                  Login as Admin
                </label>
              </div>
            )}

            {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

            <Button type="submit" className="w-full bg-[#2C3E50]" disabled={isLoading}>
              {isLoading ? (isSignup ? 'Signing up...' : 'Signing in...') : isSignup ? 'Sign Up' : 'Sign In to CMS'}
            </Button>

            <p className="text-sm text-center mt-4 text-gray-300">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => {
                      setIsSignup(false);
                      resetForm();
                      setIsAdmin(false);
                    }}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => {
                      setIsSignup(true);
                      resetForm();
                      setIsAdmin(false);
                    }}
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </form>
        </CardContent>
      </Card>

      <footer className="absolute bottom-6 text-xs text-gray-400 text-center">
        CMS Surveillance Management Platform <br />
        © {new Date().getFullYear()} CMS. All rights reserved
      </footer>
    </div>
  );
}
 */






//   // import React, { useState } from "react";
//   // import { Button } from "./ui/button";
//   // import { Input } from "./ui/input";
//   // import { Label } from "./ui/label";
//   // import {
//   //   Card,
//   //   CardContent,
//   //   CardDescription,
//   //   CardHeader,
//   //   CardTitle
//   // } from "./ui/card";
//   // import { Eye, EyeOff } from "lucide-react";

//   // export default function LoginPage({ onLogin }) {
//   //   const [email, setEmail] = useState("cook    @gmail.com");
//   //   const [password, setPassword] = useState("admin ");
//   //   const [isLoading, setIsLoading] = useState(false);
//   //   const [showPassword, setShowPassword] = useState(false);

//   //   const handleSubmit = async (e) => {
//   //     e.preventDefault();
//   //     setIsLoading(true);

//   //     setTimeout(() => {
//   //       const userData = {
//   //         name: "John Doe",
//   //         email,
//   //         role: "Admin"
//   //       };
//   //       onLogin(userData);
//   //       setIsLoading(false);
//   //     }, 1500);
//   //   };

//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(to_bottom_right,#1a1a2e,#c53030)] text-foreground">
//   //       <div className="text-center absolute top-12">
//   //         <div className="inline-flex items-center px-4 py-1 rounded-md bg-white shadow text-lg font-bold text-[#2C3E50]">
//   //           CMS <span className="ml-1 text-red-600">—</span>
//   //         </div>
//   //         <h1 className="mt-6 text-3xl font-semibold">CMS Surveillance Platform</h1>
//   //         <p className="text-sm mt-2 text-gray-300">
//   //           Secure access to CMS surveillance management system
//   //         </p>
//   //       </div>

//   //       <Card className="w-full max-w-md mt-48">
//   //         <CardHeader className="text-center">
//   //           <CardTitle className="text-xl">Welcome to CMS</CardTitle>
//   //           <CardDescription>
//   //             Sign in to your CMS surveillance account
//   //           </CardDescription>
//   //         </CardHeader>
//   //         <CardContent>
//   //           <form onSubmit={handleSubmit} className="space-y-4">
//   //             <div>
//   //               <Label htmlFor="email">Email</Label>
//   //               <Input
//   //                 id="email"
//   //                 type="email"
//   //                 value={email}
//   //                 onChange={(e) => setEmail(e.target.value)}
//   //                 required
//   //               />
//   //             </div>
//   //             <div className="relative">
//   //               <Label htmlFor="password">Password</Label>
//   //               <Input
//   //                 id="password"
//   //                 type={showPassword ? "text" : "password"}
//   //                 placeholder="Enter your password"
//   //                 value={password}
//   //                 onChange={(e) => setPassword(e.target.value)}
//   //                 required
//   //               />
//   //               <button
//   //                 type="button"
//   //                 className="absolute right-3 top-[36px] text-gray-500"
//   //                 onClick={() => setShowPassword(!showPassword)}
//   //               >
//   //                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   //               </button>
//   //             </div>
//   //             <Button type="submit" className="w-full bg-[#2C3E50]" disabled={isLoading}>
//   //               {isLoading ? "Signing in..." : "Sign In to CMS"}
//   //             </Button>
//   //           </form>
//   //           <div className="mt-4 text-center text-sm text-gray-500">
//   //             Demo credentials: Any email and password will work
//   //           </div>
//   //         </CardContent>
//   //       </Card>

//   //       <footer className="absolute bottom-6 text-xs text-gray-400">
//   //         CMS Surveillance Management Platform <br />
//   //         © 2024 CMS. All rights reserved
//   //       </footer>
//   //     </div>
//   //   );
//   // }

// // import React, { useState } from "react";
// // import { Button } from "./ui/button";
// // import { Input } from "./ui/input";
// // import { Label } from "./ui/label";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle
// // } from "./ui/card";
// // import { Eye, EyeOff } from "lucide-react";

// // export default function LoginPage({ onLogin }) {
// //   const [email, setEmail] = useState("cookieengineer25@gmail.com");
// //   const [password, setPassword] = useState("123");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     setError("");

// //     // Basic validation
// //     if (!email.trim() || !password.trim()) {
// //       setError("Please enter both email and password.");
// //       return;
// //     }

// //     setIsLoading(true);

// //     // Simulate login delay (replace with API call)
// //     setTimeout(() => {
// //       const userData = {
// //         name: "John Doe",
// //         email,
// //         role: "Admin"
// //       };

// //       // Save login to localStorage for persistence
// //       localStorage.setItem("cmsUser", JSON.stringify(userData));

// //       // Pass data to parent
// //       onLogin(userData);

// //       setIsLoading(false);
// //     }, 1500);
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(to_bottom_right,#1a1a2e,#c53030)] text-foreground">
// //       {/* Header */}
// //       <div className="text-center absolute top-12">
// //         <div className="inline-flex items-center px-4 py-1 rounded-md bg-white shadow text-lg font-bold text-[#2C3E50]">
// //           CMS <span className="ml-1 text-red-600">—</span>
// //         </div>
// //         <h1 className="mt-6 text-3xl font-semibold">CMS Surveillance Platform</h1>
// //         <p className="text-sm mt-2 text-gray-300">
// //           Secure access to CMS surveillance management system
// //         </p>
// //       </div>

// //       {/* Login Card */}
// //       <Card className="w-full max-w-md mt-48">
// //         <CardHeader className="text-center">
// //           <CardTitle className="text-xl">Welcome to CMS</CardTitle>
// //           <CardDescription>
// //             Sign in to your CMS surveillance account
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             {/* Email */}
// //             <div>
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 required
// //               />
// //             </div>

// //             {/* Password */}
// //             <div className="relative">
// //               <Label htmlFor="password">Password</Label>
// //               <Input
// //                 id="password"
// //                 type={showPassword ? "text" : "password"}
// //                 placeholder="Enter your password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 required
// //               />
// //               <button
// //                 type="button"
// //                 className="absolute right-3 top-[36px] text-gray-500"
// //                 onClick={() => setShowPassword(!showPassword)}
// //               >
// //                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //               </button>
// //             </div>

// //             {/* Error Message */}
// //             {error && (
// //               <p className="text-sm text-red-500">{error}</p>
// //             )}

// //             {/* Submit */}
// //             <Button
// //               type="submit"
// //               className="w-full bg-[#2C3E50]"
// //               disabled={isLoading}
// //             >
// //               {isLoading ? "Signing in..." : "Sign In to CMS"}
// //             </Button>
// //           </form>

// //           <div className="mt-4 text-center text-sm text-gray-500">
// //             Demo credentials: Any email and password will work
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Footer */}
// //       <footer className="absolute bottom-6 text-xs text-gray-400 text-center">
// //         CMS Surveillance Management Platform <br />
// //         © {new Date().getFullYear()} CMS. All rights reserved
// //       </footer>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from "./ui/card";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginPage({ onLogin }) {
//   // Toggle between backend mode and demo mode
//   const USE_BACKEND = false;

//   // Demo credentials (used only when USE_BACKEND = false)
//   const VALID_EMAIL = "admin@cms.com";
//   const VALID_PASSWORD = "12345";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim() || !password.trim()) {
//       setError("Please enter both email and password.");
//       return;
//     }

//     setIsLoading(true);

//     if (USE_BACKEND) {
//       // BACKEND MODE
//       try {
//         const res = await fetch("http://localhost:5000/api/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({ email, password })
//         });

//         const data = await res.json();

//         if (res.ok) {
//           localStorage.setItem("cmsUser", JSON.stringify(data.user));
//           onLogin(data.user);
//         } else {
//           setError(data.message || "Invalid email or password.");
//         }
//       } catch (err) {
//         setError("Server error. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       // DEMO MODE
//       setTimeout(() => {
//         if (email === VALID_EMAIL && password === VALID_PASSWORD) {
//           const userData = {
//             name: "Admin User",
//             email,
//             role: "Admin"
//           };
//           localStorage.setItem("cmsUser", JSON.stringify(userData));
//           onLogin(userData);
//         } else {
//           setError("Invalid email or password.");
//         }
//         setIsLoading(false);
//       }, 800);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(to_bottom_right,#1a1a2e,#c53030)] text-foreground">
//       {/* Header */}
//       <div className="text-center absolute top-12">
//         <div className="inline-flex items-center px-4 py-1 rounded-md bg-white shadow text-lg font-bold text-[#2C3E50]">
//           CMS <span className="ml-1 text-red-600">—</span>
//         </div>
//         <h1 className="mt-6 text-3xl font-semibold">CMS Surveillance Platform</h1>
//         <p className="text-sm mt-2 text-gray-300">
//           Secure access to CMS surveillance management system
//         </p>
//       </div>

//       {/* Login Card */}
//       <Card className="w-full max-w-md mt-48">
//         <CardHeader className="text-center">
//           <CardTitle className="text-xl">Welcome to CMS</CardTitle>
//           <CardDescription>
//             Sign in to your CMS surveillance account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email */}
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="relative">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-[36px] text-gray-500"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* Error Message */}
//             {error && <p className="text-sm text-red-500">{error}</p>}

//             {/* Submit */}
//             <Button
//               type="submit"
//               className="w-full bg-[#2C3E50]"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing in..." : "Sign In to CMS"}
//             </Button>
//           </form>

//           <div className="mt-4 text-center text-sm text-gray-500">
//             {USE_BACKEND
//               ? "Please use your registered credentials."
//               : `Demo credentials: ${VALID_EMAIL} / ${VALID_PASSWORD}`}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer */}
//       <footer className="absolute bottom-6 text-xs text-gray-400 text-center">
//         CMS Surveillance Management Platform <br />
//         © {new Date().getFullYear()} CMS. All rights reserved
//       </footer>
//     </div>
//   );
// }
      

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';

export default function LoginPage({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Start in signup mode if ?signup=1 in URL or from redirect state
  const [isSignup, setIsSignup] = useState(
    location.state?.signup || new URLSearchParams(location.search).get('signup') === '1'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const API_BASE = 'http://localhost:5000';

  // Focus email input (optional)
  useEffect(() => {
    if (isSignup) setError('');
  }, [isSignup]);

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword((v) => !v);
  };

  const resetForm = () => {
    setFields({ email: '', password: '', name: '', confirmPassword: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password, name, confirmPassword } = fields;

    if (!email.trim() || !password.trim()) {
      setError('Please enter all required fields.');
      return;
    }
    if (isSignup) {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        // Signup API call
        await axios.post(`${API_BASE}/auth/signup`, {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }, {headers: {'Content-Type': 'application/json'}});

        // Redirect to login page after signup with state
        alert('Signup successful! Please log in.');
        setIsSignup(false);
        resetForm();
        navigate('/', { replace: true }); // Redirect to login page
      } else {
        // Login API call
        const res = await axios.post(`${API_BASE}/auth/login`, {
          email: email.trim(),
          password: password.trim(),
        }, {headers: {'Content-Type': 'application/json'}});

        if (onLogin) onLogin(res.data);
        navigate('/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('No server response.');
      } else if (err.response.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response.status === 400) {
        setError('Bad request. Please check your input.');
      } else if (err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login/Signup failed. Please try again.');
      }
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(to_bottom_right,#1a1a2e,#c53030)] text-foreground">
      <div className="text-center absolute top-12">
        <div className="inline-flex items-center px-4 py-1 rounded-md bg-white shadow text-lg font-bold text-[#2C3E50]">
          CMS <span className="ml-1 text-red-600">—</span>
        </div>
        <h1 className="mt-6 text-3xl font-semibold">CMS Surveillance Platform</h1>
        <p className="text-sm mt-2 text-gray-300">
          Secure access to CMS surveillance management system
        </p>
      </div>
      <Card className="w-full max-w-md mt-48">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isSignup ? 'Create your CMS account' : 'Welcome to CMS'}</CardTitle>
          <CardDescription>
            {isSignup
              ? 'Sign up to get started with CMS surveillance'
              : 'Sign in to your CMS surveillance account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={fields.name}
                  onChange={handleFieldChange}
                  required
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={fields.email}
                onChange={handleFieldChange}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={fields.password}
                onChange={handleFieldChange}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-[36px] text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleTogglePassword}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isSignup && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={handleFieldChange}
                  required
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#2C3E50]" disabled={isLoading}>
              {isLoading
                ? isSignup
                  ? 'Signing up...'
                  : 'Signing in...'
                : isSignup
                ? 'Sign Up'
                : 'Sign In to CMS'}
            </Button>
            <p className="text-sm text-center mt-4 text-gray-300">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => {
                      setIsSignup(false);
                      resetForm();
                    }}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => {
                      setIsSignup(true);
                      resetForm();
                    }}
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </form>
        </CardContent>
      </Card>
      <footer className="absolute bottom-6 text-xs text-gray-400 text-center">
        CMS Surveillance Management Platform <br />
        © {new Date().getFullYear()} CMS. All rights reserved
      </footer>
    </div>
  );
}
