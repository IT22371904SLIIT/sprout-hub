import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar'
import { IoIosCreate } from "react-icons/io";
import Modal from 'react-modal';
import '../PostManagement/AllPostModern.css'; // Import the modern styling

Modal.setAppElement('#root'); // Important for accessibility

function AllAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem('userID');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter achievements based on title or description
    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievement?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievement deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievement.');
        }
      } catch (error) {
        console.error('Error deleting Achievement:', error);
      }
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="modern-container" style={{ background: '#F9FBE7' }}>
      <NavBar />
      <div className="modern-content" style={{ background: 'rgba(249, 251, 231, 0.7)' }}>
        <div className="search-container" style={{ marginTop: "-110px" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search achievements by title or description"
            value={searchQuery}
            onChange={handleSearch}
            style={{ 
              border: '1px solid #C5E1A5',
              color: '#8D6E63'
            }}
          />
          <button 
            className="create-button" 
            style={{ 
              background: '#4CAF50',
              ':hover': {
                background: '#388E3C'
              }
            }}
            onClick={() => (window.location.href = '/addAchievements')}
          >
            <IoIosCreate className="create-icon" />
            <span>Create</span>
          </button>
        </div>
        
        <div className="posts-grid">
          {filteredData.length === 0 ? (
            <div className="empty-state" style={{ color: '#8D6E63' }}>
              <div className="empty-icon"></div>
              <h3>No achievements found</h3>
              <p>Create a new achievement to share with the community</p>
              <button 
                className="primary-button" 
                style={{ 
                  background: '#4CAF50',
                  color: 'white',
                  ':hover': {
                    background: '#388E3C'
                  }
                }}
                onClick={() => (window.location.href = '/addAchievements')}
              >
                Create New Achievement
              </button>
            </div>
          ) : (
            filteredData.map((achievement) => (
              <div key={achievement.id} className="post-card" style={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #C5E1A5'
              }}>
                <div className="post-header">
                  <div className="user-info">
                    <div className="user-avatar" style={{ background: '#4CAF50' }}>
                      {achievement.postOwnerName?.charAt(0) || 'A'}
                    </div>
                    <div className="user-details">
                      <p className="username" style={{ color: '#8D6E63' }}>{achievement.postOwnerName || 'Anonymous'}</p>
                      <p className="post-date" style={{ color: '#A1887F' }}>{achievement.date}</p>
                    </div>
                  </div>
                  
                  {achievement.postOwnerID === userId && (
                    <div className="post-actions">
                      <button className="icon-button edit" style={{ color: '#4CAF50' }} onClick={() => (window.location.href = `/updateAchievements/${achievement.id}`)}>
                        <FaEdit />
                      </button>
                      <button className="icon-button delete" style={{ color: '#8D6E63' }} onClick={() => handleDelete(achievement.id)}>
                        <RiDeleteBin6Fill />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="post-content">
                  <h3 className="post-title" style={{ color: '#4CAF50' }}>{achievement.title}</h3>
                  <p className="post-description" style={{ color: '#8D6E63', whiteSpace: "pre-line" }}>{achievement.description}</p>
                  
                  {achievement.imageUrl && (
                    <div className="media-gallery single">
                      <div className="media-item" onClick={() => openModal(`http://localhost:8080/achievements/images/${achievement.imageUrl}`)}>
                        <img 
                          src={`http://localhost:8080/achievements/images/${achievement.imageUrl}`} 
                          alt="Achievement" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Modal for displaying full image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="media-modal"
        overlayClassName="media-modal-overlay"
        style={{
          overlay: {
            backgroundColor: 'rgba(249, 251, 231, 0.9)'
          },
          content: {
            border: '1px solid #C5E1A6'
          }
        }}
      >
        <button className="close-button" onClick={closeModal}>×</button>
        {selectedImage && (
          <img src={selectedImage} alt="Full Achievement" className="modal-media" />
        )}
      </Modal>
    </div>
  );
}

export default AllAchievements;
