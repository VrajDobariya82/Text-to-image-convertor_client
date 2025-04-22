import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites, removeFromFavorites, collections, addToCollection, createCollection } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  
  const handleAddToCollection = (collectionId) => {
    if (selectedImage) {
      addToCollection(collectionId, selectedImage);
      setSelectedImage(null);
      setShowCollectionModal(false);
    }
  };
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim() === '') return;
    
    const collectionId = createCollection(newCollectionName);
    if (selectedImage) {
      addToCollection(collectionId, selectedImage);
    }
    setNewCollectionName('');
    setShowCollectionModal(false);
    setSelectedImage(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">My Favorites</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Your collection of saved images
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full mb-4">
            <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">No favorite images yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mt-2">
            When you find an image you love, click the heart icon to save it to your favorites for easy access.
          </p>
          <Link 
            to="/result"
            className="btn-primary mt-6 inline-block"
          >
            Generate Images
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group card overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={image.url} 
                  alt={image.prompt || 'Generated image'} 
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-sm truncate max-w-[70%]">
                    {image.prompt ? image.prompt.substring(0, 50) + (image.prompt.length > 50 ? '...' : '') : 'Generated image'}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setSelectedImage(image);
                        setShowCollectionModal(true);
                      }}
                      className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromFavorites(image.id)}
                      className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl w-96 animate-scale-in">
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">Add to Collection</h3>
            
            {collections.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Choose an existing collection:</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {collections.map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => handleAddToCollection(collection.id)}
                      className="w-full text-left p-2 rounded border border-neutral-200 dark:border-neutral-700 
                        hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      {collection.name}
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                        ({collection.images.length} images)
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Or create a new collection:</p>
              <input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="input"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCollectionModal(false);
                  setSelectedImage(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCollection}
                className="btn-primary"
              >
                Create & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Favorites; 