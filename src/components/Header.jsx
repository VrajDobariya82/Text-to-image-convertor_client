import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()
  
  const onClickHandler = () => {
    if (user) {
      navigate('/result')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <motion.div 
      className='flex flex-col justify-center items-center text-center mt-36 mb-20 px-4'
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className='text-neutral-600 dark:text-neutral-300 inline-flex text-center items-center gap-2 
          bg-white dark:bg-neutral-800 px-6 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm'
      >
        <p className="text-sm font-medium">Best Text to Image Generator</p>
        <img src={assets.star_icon} alt="" className="w-4 h-4" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 2 }}
        className='text-4xl sm:text-7xl max-w-[300px] sm:max-w-[700px] font-bold 
          mx-auto mt-10 text-center leading-tight dark:text-neutral-100'
      >
        Turn Text to <span className='text-gradient'>Images</span>, in Seconds.
      </motion.h1>

      <motion.p 
        className='text-center max-w-xl mx-auto mt-6 text-neutral-600 dark:text-neutral-400'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash your creativity with AI. Turn your imagination
        into visual art in seconds - just type, and
        watch the magic happen.
      </motion.p>

      <motion.button 
        onClick={onClickHandler} 
        className='btn-primary mt-10 px-8 py-3 text-base sm:text-lg flex items-center gap-2'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}
      >
        Generate Images
        <img className='h-5' src={assets.star_group} alt="" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className='flex flex-wrap justify-center mt-16 gap-4'
      >
        {Array(6).fill('').map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="overflow-hidden rounded-lg shadow-md"
          >
            <img 
              className='h-16 sm:h-20 w-auto object-cover rounded-lg hover-scale' 
              src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} 
              alt={`Sample generated image ${index + 1}`} 
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className='mt-4 inline-flex items-center bg-neutral-50 dark:bg-neutral-800 px-4 py-2 rounded-full'
      >
        <span className="badge badge-primary mr-2">NEW</span>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>Generated images from Imagify</p>
      </motion.div>
    </motion.div>
  )
}

export default Header