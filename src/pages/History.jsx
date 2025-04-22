import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

const History = () => {
  const { generationHistory, clearHistory, addToFavorites, setCurrentImage } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleViewImage = (image) => {
    setCurrentImage(image);
    setSelectedImage(image);
  };
  
  const handleAddToFavorites = (image) => {
    addToFavorites(image);
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto"
    >
      <div className="mb-8 flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Generation History</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Your recent AI image generations
          </p>
        </div>
        
        {generationHistory.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your generation history?")) {
                clearHistory();
              }
            }}
            className="mt-4 sm:mt-0 btn-secondary text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear History
          </button>
        )}
      </div>

      {generationHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full mb-4">
            <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">No generation history</h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mt-2">
            Your image generation history will appear here once you start creating images.
          </p>
          <Link 
            to="/result"
            className="btn-primary mt-6 inline-block"
          >
            Generate Images
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {generationHistory.map((item) => (
            <div
              key={item.id}
              className="card p-4 flex flex-col md:flex-row gap-4"
            >
              <div className="w-full md:w-1/4 lg:w-1/5 shrink-0">
                <img 
                  src={item.image} 
                  alt={item.prompt || 'Generated image'} 
                  className="w-full aspect-square object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleViewImage({
                    id: item.id,
                    url: item.image,
                    prompt: item.prompt
                  })}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-1">
                      {item.isVariation ? 'Variation of image' : 'Original generation'}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(item.date)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToFavorites({
                        id: item.id,
                        url: item.image,
                        prompt: item.prompt
                      })}
                      className="p-1.5 text-neutral-500 hover:text-accent-pink dark:text-neutral-400 dark:hover:text-accent-pink"
                      title="Add to favorites"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <a
                      href={item.image}
                      download
                      className="p-1.5 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400"
                      title="Download image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="mt-3">
                  {item.prompt && (
                    <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">Prompt:</span> {item.prompt}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/result?prompt=${encodeURIComponent(item.prompt)}`}
                    className="btn-secondary text-sm py-1.5 inline-block"
                  >
                    Use Prompt Again
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-4xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url}
              alt={selectedImage.prompt || 'Generated image'}
              className="max-h-[80vh] w-auto mx-auto rounded-lg shadow-lg"
            />
            
            {selectedImage.prompt && (
              <div className="mt-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-white text-sm md:text-base">
                  <span className="font-medium">Prompt:</span> {selectedImage.prompt}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default History; 