import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Login');
  const { 
    setShowLogin, 
    backendUrl, 
    setToken, 
    setUser, 
    setCredit, 
    verifyUserSession,
    fetchUserCredits,
    loadFavorites,
    loadHistory
  } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation - minimum 6 characters
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    // Name validation for signup
    if (state === 'Sign Up' && !name.trim()) {
      newErrors.name = "Name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if no errors
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Show validation errors
      if (errors.email) toast.error(errors.email);
      if (errors.password) toast.error(errors.password);
      if (errors.name) toast.error(errors.name);
      return;
    }

    setLoading(true);

    try {
      if (state === 'Login') {
        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });

        if (data.token) {
          // Store token in localStorage
          localStorage.setItem('token', data.token);
          
          // Update app context
          setToken(data.token);
          
          // Set user data, including credits
          if (data.user) {
            setUser(data.user);
            
            // Make sure credits are set properly
            if (data.user.credits !== undefined) {
              console.log("Setting credits to:", data.user.credits);
              setCredit(data.user.credits);
            } else {
              setCredit(20); // Set default credits if not provided
            }
          }
          
          // Close login modal
          setShowLogin(false);
          toast.success("Login successful! Welcome back.");
          
          // Verification will fetch user data including credits
          setTimeout(() => {
            verifyUserSession();
            if (fetchUserCredits) {
              fetchUserCredits();
            }
          }, 500);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/users/register`, {
          name,
          email,
          password,
        });

        if (data.token) {
          // Store token in localStorage
          localStorage.setItem('token', data.token);
          
          // Update app context
          setToken(data.token);
          
          // Set user data, including credits
          if (data.user) {
            setUser(data.user);
            
            // Make sure credits are set properly
            if (data.user.credits !== undefined) {
              console.log("Setting credits to:", data.user.credits);
              setCredit(data.user.credits);
            } else {
              setCredit(20); // Set default credits if not provided
            }
          }
          
          // Close login modal
          setShowLogin(false);
          toast.success("Account created successfully! Welcome to Imagify.");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])
  
  return (
    <div
      className='fixed top-0 left-0 right-0
     bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>

      <motion.form onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative bg-white dark:bg-neutral-800 p-10 rounded-xl text-slate-500 dark:text-neutral-300 shadow-lg'>
        <h1 className='text-center text-2xl text-neutral-700 dark:text-neutral-100 font-medium'>{state}</h1>
        <p className='text-sm dark:text-neutral-400'>Welcome back! please sign in to continue</p>

        {state !== 'Login' &&
          <div className='border dark:border-neutral-700 px-6 py-2 flex items-center gap-2 rounded-full mt-5 dark:bg-neutral-700/50'>
            <img src={assets.user_icon} alt="" />
            <input type="text" placeholder='Full Name' onChange={e => setName(e.target.value)} value={name} required className='outline-none text-sm bg-transparent dark:text-neutral-100' />
          </div>
        }

        <div className='border dark:border-neutral-700 px-6 py-2 flex items-center gap-2 rounded-full mt-4 dark:bg-neutral-700/50'>
          <img src={assets.email_icon} alt="" />
          <input type="email" placeholder='Email Id' onChange={e => setEmail(e.target.value)} value={email} required className='outline-none text-sm bg-transparent dark:text-neutral-100' />
        </div>

        <div className='border dark:border-neutral-700 px-6 py-2 flex items-center gap-2 rounded-full mt-4 dark:bg-neutral-700/50'>
          <img src={assets.lock_icon} alt="" />
          <input type="password" placeholder='Password (min 6 characters)' onChange={e => setPassword(e.target.value)} value={password} required className='outline-none text-sm bg-transparent dark:text-neutral-100' />
        </div>
        
        {state === 'Login' && 
          <p className='text-sm text-blue-600 dark:text-blue-400 my-4 cursor-pointer'>Forgot password?</p>
        }
        
        {state === 'Sign Up' && 
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>Password must be at least 6 characters long</p>
        }
        
        <button 
          type="submit" 
          disabled={loading}
          className={`bg-blue-600 w-full text-white py-2 rounded-full mt-4 hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading 
            ? (state === 'Login' ? 'Logging in...' : 'Creating account...') 
            : (state === 'Login' ? 'Login' : 'Create account')}
        </button>
        
        {state === 'Login' ?
          <p className='mt-5 text-center dark:text-neutral-300'>Don't have an account? <span className='text-blue-600 dark:text-blue-400 cursor-pointer' onClick={() => setState('Sign Up')}>Sign up</span></p> :
          <p className='mt-5 text-center dark:text-neutral-300'>Already have an account? <span className='text-blue-600 dark:text-blue-400 cursor-pointer' onClick={() => setState('Login')}>Login</span></p>
        }

        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />
      </motion.form>

    </div>
  )
}

export default Login