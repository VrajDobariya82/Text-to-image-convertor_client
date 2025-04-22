import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext();
import { useNavigate } from "react-router-dom";

const AppContextProvider = (props) => {
  // User authentication and credits
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  
  // Image generation history
  const [generationHistory, setGenerationHistory] = useState([]);
  
  // Favorites
  const [favorites, setFavorites] = useState([]);
  
  // Image editing state
  const [currentImage, setCurrentImage] = useState(null);
  const [editingImage, setEditingImage] = useState(false);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  
  // Helper function to safely save to localStorage
  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      toast.warning("Storage limit reached. Some data may not be saved.");
      return false;
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    safeSetItem("darkMode", newDarkMode);
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Verify token and get user data
  const verifyUserSession = async () => {
    if (!token) return;
    
    try {
      console.log("Verifying user session...");
      const { data } = await axios.get(`${backendUrl}/api/users/verify`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (data.user) {
        console.log("User session verified, credits:", data.user.credits);
        setUser(data.user);
        
        // Explicitly set credits
        if (data.user.credits !== undefined) {
          setCredit(data.user.credits);
        } else {
          // Fallback - fetch credits separately
          fetchUserCredits();
        }
      }
    } catch (error) {
      console.error("Session verification error:", error);
      // Clear invalid token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
      }
    }
  };
  
  // Fetch user credits directly
  const fetchUserCredits = async () => {
    if (!token) return;
    
    try {
      console.log("Fetching user credits...");
      const { data } = await axios.get(`${backendUrl}/api/users/credits`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Credits received:", data.credits);
      setCredit(data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };
  
  // Load user data on mount if token exists
  useEffect(() => {
    if (token) {
      verifyUserSession();
      loadFavorites();
      loadHistory();
      
      // Also fetch credits directly
      fetchUserCredits();
    }
  }, [token]);
  
  // Fetch user favorites from API
  const loadFavorites = async () => {
    if (!token) return;
    
    try {
      console.log("Loading favorites with token:", token.substring(0, 10) + "...");
      const { data } = await axios.get(`${backendUrl}/api/users/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Favorites response:", data);
      
      if (data.favorites) {
        const formattedFavorites = data.favorites.map(fav => ({
          id: fav._id,
          url: fav.imageUrl,
          prompt: fav.prompt,
          date: fav.createdAt
        }));
        setFavorites(formattedFavorites);
        console.log(`Loaded ${formattedFavorites.length} favorites`);
      } else {
        console.log("No favorites found or invalid response format");
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    }
  };
  
  // Fetch user history from API
  const loadHistory = async () => {
    if (!token) return;
    
    try {
      console.log("Loading history with token:", token.substring(0, 10) + "...");
      const { data } = await axios.get(`${backendUrl}/api/users/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("History response:", data);
      
      if (data.history) {
        const formattedHistory = data.history.map(item => ({
          id: item._id,
          image: item.imageUrl,
          prompt: item.prompt,
          date: item.createdAt
        }));
        setGenerationHistory(formattedHistory);
        console.log(`Loaded ${formattedHistory.length} history items`);
      } else {
        console.log("No history found or invalid response format");
        setGenerationHistory([]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    }
  };

  // Generate new image
  const generateImage = async (prompt) => {
    if (!token) {
      toast.warning("Please log in to generate images");
      setShowLogin(true);
      return null;
    }

    if (credit <= 0) {
      toast.error("You don't have enough credits to generate images");
      navigate("/buy");
      return null;
    }
    
    try {
      setLoading(true);
      setCurrentImage(null);
      
      console.log("Sending request to:", `${backendUrl}/api/images/generate-image`);
      console.log("With token:", token.substring(0, 15) + "...");
      console.log("User credits:", credit);
      
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const { data } = await axios.post(
        `${backendUrl}/api/images/generate-image`,
        { prompt },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000, // 60 second timeout
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      console.log("Response received with status:", data ? "Success" : "Failed");

      if (data.imageUrl) {
        // Update credit balance
        if (data.user && data.user.credits !== undefined) {
          console.log("Credits updated:", data.user.credits);
          setCredit(data.user.credits);
        } else {
          // Fetch updated credits if not provided in response
          fetchUserCredits();
        }
        
        // Add to server history - only send minimal data
        const historyData = {
          imageUrl: data.imageUrl,
          prompt
        };
        
        try {
          await axios.post(
            `${backendUrl}/api/users/history`, 
            historyData,
            { 
              headers: { 
                Authorization: `Bearer ${token}` 
              } 
            }
          );
          
          // Refresh history list
          await loadHistory();
        } catch (historyError) {
          console.error("Error saving to history:", historyError);
          // Continue even if history saving fails
        }
        
        setCurrentImage({
          url: data.imageUrl,
          prompt
        });
        
        return data.imageUrl;
      } else {
        toast.error(data.message || "Failed to generate image");
        
        if (data.creditIssue) {
          navigate("/buy");
        }
        return null;
      }
    } catch (error) {
      console.error("Generate image error:", error);
      
      if (error.name === 'AbortError') {
        toast.error("Request timeout. The server took too long to respond.");
      } else if (error.response?.status === 413) {
        toast.error("The image data is too large to process. Please try a different prompt.");
      } else if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Server is taking too long to respond.");
      } else {
        toast.error(error.response?.data?.message || "Failed to generate image. Please try again.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Add to favorites
  const addToFavorites = async (image) => {
    if (!token) {
      toast.warning("Please log in to save favorites");
      setShowLogin(true);
      return;
    }
    
    try {
      console.log("Adding to favorites:", image);
      
      if (!image || !image.url || !image.prompt) {
        console.error("Invalid image data:", image);
        toast.error("Invalid image data. Cannot add to favorites.");
        return;
      }
      
      const { data } = await axios.post(
        `${backendUrl}/api/users/favorites`,
        { 
          imageUrl: image.url,
          prompt: image.prompt
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      console.log("Add to favorites response:", data);
      
      if (data.favorite) {
        // Refresh favorites
        await loadFavorites();
        toast.success("Added to favorites!");
      } else {
        toast.info(data.message);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      toast.error(error.response?.data?.message || "Failed to add to favorites");
    }
  };
  
  // Remove from favorites
  const removeFromFavorites = async (favoriteId) => {
    if (!token) {
      toast.warning("Please log in to manage favorites");
      setShowLogin(true);
      return;
    }
    
    try {
      console.log("Removing favorite with ID:", favoriteId);
      
      await axios.delete(
        `${backendUrl}/api/users/favorites/${favoriteId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      // Update state optimistically
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      toast.error(error.response?.data?.message || "Failed to remove from favorites");
    }
  };
  
  // Clear generation history
  const clearHistory = () => {
    toast.info("History is saved on the server and cannot be cleared at once");
  };
  
  const logout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    // Reset state
    setToken("");
    setUser(null);
    setCredit(0);
    setFavorites([]);
    setGenerationHistory([]);
    
    // Show success notification
    toast.success("Logged out successfully!");
    
    // Redirect to home page
    navigate("/");
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    verifyUserSession,
    fetchUserCredits,
    logout,
    generateImage,
    loading,
    // New features
    darkMode,
    toggleDarkMode,
    generationHistory,
    loadHistory,
    clearHistory,
    currentImage,
    setCurrentImage,
    editingImage,
    setEditingImage,
    favorites,
    loadFavorites,
    addToFavorites,
    removeFromFavorites
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
