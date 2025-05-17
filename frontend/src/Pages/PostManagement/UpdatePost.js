import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css'; // Import the same CSS file used by AddNewPost

function UpdatePost() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [existingMedia, setExistingMedia] = useState([]); // Initialize as an empty array
  const [newMedia, setNewMedia] = useState([]); // New media files to upload
  const [loading, setLoading] = useState(true); // Add loading state
  const [isDragging, setIsDragging] = useState(false); // For drag and drop UI

  useEffect(() => {
    // Fetch the post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || ''); // Ensure title is not undefined
        setDescription(post.description || ''); // Ensure description is not undefined
        setCategory(post.category || ''); // Set category
        setExistingMedia(post.media || []); // Ensure media is an array
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl)); // Remove from UI
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer?.files || []);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    setNewMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category); // Include category in the update
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div className="post-creation-page" style={{ background: '#F9FBE6' }}>
      <NavBar />
      <div className="post-creation-container" style={{ 
        marginTop: "80px",
        background: 'rgba(249, 251, 231, 0.7)'
      }}>
        <div className="post-form-card" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #C5E1A5'
        }}>
          <h1 className="form-title" style={{ color: '#4CAF50' }}>Update Post</h1>
          <p className="form-subtitle" style={{ color: '#8D6E63' }}>Edit your content and share with the world</p>
          
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Title</label>
              <input
                className="form-input"
                style={{
                  border: '1px solid #C5E1A5',
                  color: '#8D6E63'
                }}
                type="text"
                placeholder="Enter your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Category</label>
              <select
                className="form-select"
                style={{
                  border: '1px solid #C5E1A5',
                  color: '#8D6E63'
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
      <option value="" disabled>Select Category</option>
                <option value="Street Food">Organic Fertilizer</option>
                <option value="One-Pot Meals">Inorganic Fertilizer</option>
                <option value="Meal Prep / Batch Cooking">Compost</option>
                <option value="Budget-Friendly">Manure</option>
                <option value="Kid-Friendly">Green Manure</option>
                <option value="Healthy Recipes">Biofertilizer</option>
                <option value="Comfort Food">Nitrogen Fertilizer</option>
                <option value="Traditional / Cultural Recipes">Phosphorus Fertilizer</option>
                <option value="Fusion Recipes">Potassium Fertilizer</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Description</label>
              <textarea
                className="form-textarea"
                style={{
                  border: '1px solid #C5E1A5',
                  color: '#8D6E63'
                }}
                placeholder="What's on your mind?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Media</label>
              {existingMedia.length > 0 && (
                <div className="media-preview-container" style={{ marginBottom: '20px' }}>
                  {existingMedia.map((mediaUrl, index) => (
                    <div key={index} className="media-preview-item">
                      {mediaUrl.endsWith('.mp4') ? (
                        <video controls className="media-preview">
                          <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img className="media-preview" src={`http://localhost:8080${mediaUrl}`} alt={`Media ${index}`} />
                      )}
                      <button
                        type="button"
                        className="remove-media-btn"
                        onClick={() => handleDeleteMedia(mediaUrl)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div 
                className={`media-drop-area ${isDragging ? 'dragging' : ''}`}
                style={{
                  border: `2px dashed ${isDragging ? '#4CAF50' : '#C5E1A5'}`,
                  background: isDragging ? 'rgba(197, 225, 165, 0.1)' : 'transparent'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleNewMediaChange(e);
                }}
              >
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <p>Drag & drop files here or <label className="file-label">
                  browse
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleNewMediaChange}
                    className="file-input-hidden"
                  />
                </label></p>
                <p className="upload-hint">Upload up to 3 images or 1 video (max 30s, 50MB)</p>
              </div>
            </div>
            
            <button type="submit" className="submit-button" style={{ 
              background: '#4CAF50',
              transition: 'background-color 0.3s ease',
              ':hover': {
                background: '#388E3C'
              }
            }}>
              <span className="button-text">Update Post</span>
              <span className="button-icon">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
