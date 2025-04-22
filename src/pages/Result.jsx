import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useSearchParams, useLocation } from 'react-router-dom'

const Result = () => {
  const imageRef = useRef(null);
  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [input, setInput] = useState('')
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const { 
    generateImage, 
    addToFavorites, 
    currentImage,
    setCurrentImage,
    credit,
    user,
    showLogin,
    setShowLogin
  } = useContext(AppContext)
  
  // Read prompt from URL query parameters
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl) {
      setInput(promptFromUrl);
    }
  }, [searchParams]);
  
  // Handle outside clicks for image menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imageRef.current && !imageRef.current.contains(event.target)) {
        setShowImageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle image load error
  const handleImageError = () => {
    console.error("Failed to load image");
    setError(true);
    toast.error("Failed to load the generated image");
  };
  
  // Check prompt in URL and auto-generate if possible
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryPrompt = searchParams.get("prompt");
    
    if (queryPrompt) {
      setInput(queryPrompt);
      
      // Auto-generate image if prompt is provided in URL
      if (user && credit > 0) {
        handleSubmit(null, queryPrompt);
      }
    }
  }, [location.search, user, credit]);

  const handleSubmit = async (e, promptOverride = null) => {
    if (e) e.preventDefault();
    
    if (loading) {
      toast.info("Please wait, an image is already being generated");
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      toast.warning("Please login to generate images");
      setShowLogin(true);
      return;
    }
    
    // Check if user has credits
    if (credit <= 0) {
      toast.error("You don't have enough credits to generate an image");
      return;
    }
    
    const finalPrompt = promptOverride || input;
    
    if (!finalPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(false);

    try {
      console.log(`Generating image for prompt: "${finalPrompt}"`);
      const imageUrl = await generateImage(finalPrompt);
      
      if (imageUrl) {
        console.log("Image generated successfully:", imageUrl.substring(0, 50) + "...");
        toast.success("Image generated successfully!");
        setIsImageLoaded(true);
        setImage(imageUrl);
        setCurrentImage({
          url: imageUrl,
          prompt: finalPrompt
        });
        
        // Save to local collection
        saveToCollection(finalPrompt, imageUrl);
      } else {
        console.log("Image generation failed or was cancelled");
        setError(true);
        toast.error("Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(true);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save generated image to local collection
  const saveToCollection = (prompt, imageUrl) => {
    try {
      // Get existing collection from localStorage
      const existingCollection = JSON.parse(localStorage.getItem("collection") || "[]");
      
      // Check if we're approaching localStorage limits (typically ~5MB)
      const estimatedSize = JSON.stringify(existingCollection).length;
      if (estimatedSize > 4000000) { // 4MB safety threshold
        // Remove oldest items if approaching limit
        while (existingCollection.length > 10) {
          existingCollection.shift();
        }
        toast.info("Some older images were removed from local storage due to size limits");
      }
      
      // Add new image to collection
      const newImage = {
        id: Date.now(),
        imageUrl,
        prompt,
        date: new Date().toISOString(),
      };
      
      const updatedCollection = [...existingCollection, newImage];
      localStorage.setItem("collection", JSON.stringify(updatedCollection));
    } catch (error) {
      console.error("Error saving to local collection:", error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.warning("Could not save to local storage - storage limit reached");
      }
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast.warning("Please login to save favorites");
      setShowLogin(true);
      return;
    }
    
    if (currentImage) {
      try {
        addToFavorites(currentImage);
        setShowImageMenu(false);
        toast.success("Added to favorites");
      } catch (err) {
        console.error("Error adding to favorites:", err);
        toast.error("Failed to add to favorites. Storage may be full.");
      }
    } else {
      toast.warning("No image available to add to favorites");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col min-h-screen pt-24 px-4 items-center"
    >
      <form onSubmit={handleSubmit} action="" className="w-full max-w-4xl flex flex-col items-center">
        <div className="relative" ref={imageRef}>
          <div className="relative group">
            <img 
              src={image} 
              alt="" 
              className="max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-md" 
              onError={handleImageError}
              onLoad={() => setIsImageLoaded(true)}
            />
            <span 
              className={`absolute bottom-0 left-0 h-1 bg-primary-500 rounded-b-lg
                ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}
            />
            
            <button 
              className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 p-1.5 rounded-full hover:bg-white dark:hover:bg-black/90 transition-colors z-10"
              onClick={() => setShowImageMenu(!showImageMenu)}
              aria-label="Image options"
            >
              <svg className="w-5 h-5 text-neutral-700 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {showImageMenu && (
              <div className="absolute top-12 right-2 bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-2 z-20">
                <div className="flex flex-col gap-1">
                  <button 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded text-sm whitespace-nowrap"
                    onClick={handleAddToFavorites}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add to Favorites
                  </button>
                  <a 
                    href={image} 
                    download="generated-image.png"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded text-sm whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <p className={!loading ? 'hidden' : 'text-center mt-2 text-neutral-600 dark:text-neutral-400'}>
            Generating your image...
          </p>
          
          {error && (
            <p className='text-center mt-2 text-red-500 dark:text-red-400'>
              Failed to generate image. Please try again.
            </p>
          )}
        </div>

        {!isImageLoaded ? (
          <div className="w-full mt-10">
            <div className="flex w-full max-w-xl mx-auto bg-white dark:bg-neutral-800 rounded-full overflow-hidden shadow-md">
              <div className="relative flex-1 flex items-center">
                <input 
                  onChange={e => setInput(e.target.value)} 
                  value={input}
                  type="text" 
                  placeholder="Describe what you want to generate"
                  className="w-full bg-transparent outline-none px-5 py-3 text-neutral-800 dark:text-neutral-100" 
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className={`bg-primary-600 hover:bg-primary-700 px-8 py-3 text-white font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            
            {user && credit !== undefined && (
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                <p>You have <span className="font-semibold text-primary-600 dark:text-primary-400">{credit}</span> credits remaining</p>
              </div>
            )}
            
            {input.length > 0 && (
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-xl mx-auto px-4">
                <p>
                  Tip: Be specific with details like style, colors, and composition for better results.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap justify-center mt-8">
            <button
              type="button"
              onClick={() => {setIsImageLoaded(false); setInput(''); setError(false);}}
              className="btn-secondary"
            >
              Create New Image
            </button>
          </div>
        )}
      </form>
    </motion.div>
  )
}

export default Result