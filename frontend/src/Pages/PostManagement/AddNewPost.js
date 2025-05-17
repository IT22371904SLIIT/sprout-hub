import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css'; // the css file for the addnewpost part

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }
      
      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create a post.');
      window.location.reload();
    }
  };

  return (
    <div className="post-creation-page" style={{ background: '#F9FBE7' }}>
      <NavBar />
      <div className="post-creation-container" style={{ 
        marginTop: "80px",
        background: 'rgba(249, 251, 231, 0.7)'
      }}>
        <div className="post-form-card" style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #C5E1A5'
        }}>
          <h1 className="form-title" style={{ color: '#4CAF50' }}>Create New Post</h1>
          <p className="form-subtitle" style={{ color: '#8D6E63' }}>Share your thoughts with the world</p>
          
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
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
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
                  const files = Array.from(e.dataTransfer.files);
                  handleMediaChange({ target: { files } });
                }}
              >
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <p> Drag & drop your files here <label className="file-label">
                  browse
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleMediaChange}
                    className="file-input-hidden"
                  />
                </label></p>
                <p className="upload-hint">Upload up to 3 images or 1 video (max 30s, 50MB)</p>
              </div>
              
              {mediaPreviews.length > 0 && (
                <div className="media-preview-container">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="media-preview-item">
                      {preview.type.startsWith('video/') ? (
                        <video controls className="media-preview">
                          <source src={preview.url} type={preview.type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img className="media-preview" src={preview.url} alt={`Preview ${index}`} />
                      )}
                      <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={() => {
                          const newPreviews = [...mediaPreviews];
                          const newMedia = [...media];
                          newPreviews.splice(index, 1);
                          newMedia.splice(index, 1);
                          setMediaPreviews(newPreviews);
                          setMedia(newMedia);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button type="submit" className="submit-button" style={{ 
              background: '#4CAF50',
              transition: 'background-color 0.3s ease',
              ':hover': {
                background: '#388E3C'
              }
            }}>
              <span className="button-text">Publish Post</span>
              <span className="button-icon">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
