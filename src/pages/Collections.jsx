import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const { collections, deleteCollection, removeFromCollection } = useContext(AppContext);
  const navigate = useNavigate();
  const [openCollection, setOpenCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const handleCreateCollection = () => {
    if (newCollectionName.trim() === '') return;
    
    const collectionId = createCollection(newCollectionName);
    setNewCollectionName('');
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
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">My Collections</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Organize your generated images into collections
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <input
            type="text"
            placeholder="New collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="input max-w-[200px]"
          />
          <button
            onClick={handleCreateCollection}
            disabled={!newCollectionName.trim()}
            className={`btn-primary ${!newCollectionName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Create
          </button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full mb-4">
            <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">No collections yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mt-2">
            Create your first collection to organize your generated images by theme or project.
          </p>
          <button 
            onClick={() => navigate('/result')}
            className="btn-primary mt-6"
          >
            Generate Images
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {collections.map((collection) => (
            <div key={collection.id} className="card">
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => setOpenCollection(openCollection === collection.id ? null : collection.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{collection.name}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {collection.images.length} {collection.images.length === 1 ? 'image' : 'images'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {confirmDelete === collection.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCollection(collection.id);
                          setConfirmDelete(null);
                        }}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(null);
                        }}
                        className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(collection.id);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  
                  <svg 
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${openCollection === collection.id ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <AnimatePresence>
                {openCollection === collection.id && collection.images.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {collection.images.map((image) => (
                        <div key={image.id} className="group relative">
                          <img 
                            src={image.url} 
                            alt={image.prompt || 'Generated image'} 
                            className="w-full aspect-square object-cover rounded-lg shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => removeFromCollection(collection.id, image.id)}
                              className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Collections; 