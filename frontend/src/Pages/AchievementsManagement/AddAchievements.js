import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import '../PostManagement/AddNewPost.css'; // Import the CSS from AddNewPost

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      const maxFileSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
        method: 'POST',
        body: formData,
      });
      imageUrl = await uploadResponse.text();
    }

    const response = await fetch('http://localhost:8080/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, imageUrl }),
    });
    if (response.ok) {
      alert('Achievements added successfully!');
      window.location.href = '/myAchievements';
    } else {
      alert('Failed to add Achievements.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: '',
      postOwnerID: formData.postOwnerID,
      postOwnerName: formData.postOwnerName,
    });
    setImage(null);
    setImagePreview(null);
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
          <h1 className="form-title" style={{ color: '#4CAF50' }}>Add Achievement</h1>
          <p className="form-subtitle" style={{ color: '#8D6E63' }}>Share your accomplishments with the world</p>
          
          <form onSubmit={(e) => {
            handleSubmit(e);
            resetForm();
          }} className="modern-form">
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Upload Image</label>
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
                  handleImageChange(e);
                }}
              >
                {imagePreview ? (
                  <div className="media-preview-container">
                    <div className="media-preview-item">
                      <img className="media-preview" src={imagePreview} alt="Preview" />
                      <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <p>Drag & drop image here or <label className="file-label">
                      browse
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input-hidden"
                        required
                      />
                    </label></p>
                    <p className="upload-hint">Upload an image for your achievement (max 50MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Title</label>
              <input
                className="form-input"
                style={{
                  border: '1px solid #C5E1A5',
                  color: '#8D6E63'
                }}
                name="title"
                type="text"
                placeholder="Enter achievement title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E64' }}>Category</label>
              <select
                className="form-select"
                style={{
                  border: '1px solid #C5E1A5',
                  color: '#8D6E63'
                }}
                name="category"
                value={formData.category}
                onChange={handleChange}
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
                name="description"
                placeholder="Describe your achievement"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#8D6E63' }}>Date</label>
              <input
                className="form-input"
                style={{
                  border: '1px solid #C5E1A5',
                  color: '#8D6E63'
                }}
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="submit-button" style={{ 
              background: '#4CAF50',
              transition: 'background-color 0.3s ease',
              ':hover': {
                background: '#388E3C'
              }
            }}>
              <span className="button-text">Add Achievement</span>
              <span className="button-icon">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;
