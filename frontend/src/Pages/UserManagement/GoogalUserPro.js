import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaTools, FaTrash, FaBookOpen, FaLightbulb, FaTrophy } from 'react-icons/fa';
import './UserProfile.css'
import Pro from './img/img.png';
import NavBar from '../../Components/NavBar/NavBar';

export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user details');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

function GoogalUserPro() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID');
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            setLoading(true);
            fetchUserDetails(userId)
                .then((data) => setUserData(data))
                .finally(() => setLoading(false));
        }
    }, []);
    
    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        if (storedUserType === 'google') {
            const googleImage = localStorage.getItem('googleProfileImage');
            setGoogleProfileImage(googleImage);
        } else if (userId) {
            fetchUserDetails(userId).then((data) => {
                if (data && data.profilePicturePath) {
                    setUserProfileImage(`http://localhost:8080/uploads/profile/${data.profilePicturePath}`);
                }
            });
        }
    }, [userId]);
    
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            const userId = localStorage.getItem('userID');
            fetch(`http://localhost:8080/user/${userId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem('userID');
                        navigate('/'); // Redirect to home or login page
                    } else {
                        alert("Failed to delete profile.");
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    if (loading) {
        return (
            <div className="page-container" style={{ background: '#F9FBE7' }}>
                <NavBar />
                <div className="loading-container" style={{ color: '#8D6E63' }}>
                    <div className="loader" style={{ borderColor: '#C5E1A5', borderTopColor: '#4CAF50' }}></div>
                    <p>Loading profile information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ background: '#F9FBE7' }}>
            <NavBar />
            <div className="profile-container" style={{ background: 'rgba(249, 251, 231, 0.7)' }}>
                <div className="profile-header">
                    <h1 style={{ color: '#4CAF50' }}>My Google Profile</h1>
                    <p className="subtitle" style={{ color: '#8D6E63' }}>View and manage your Google account information</p>
                </div>
                
                {userData && userData.id === localStorage.getItem('userID') && (
                    <div className="profile-card" style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #C5E1A5'
                    }}>
                        <div className="profile-card-content">
                            <div className="profile-image-container" style={{ border: '3px solid #C5E1A5' }}>
                                {googleProfileImage ? (
                                    <img
                                        src={googleProfileImage}
                                        alt="Profile"
                                        className="profile-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = Pro;
                                        }}
                                    />
                                ) : (
                                    <div className="profile-image-placeholder">
                                        {userData.fullname ? userData.fullname.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            
                            <div className="profile-info">
                                <h2 className="profile-name" style={{ color: '#4CAF50' }}>{userData.fullname}</h2>
                                <p className="profile-bio" style={{ color: '#8D6E63' }}>{userData.bio || "No bio available"}</p>
                                
                                <div className="profile-details" style={{ color: '#8D6E63' }}>
                                    <div className="detail-item">
                                        <FaEnvelope className="detail-icon" />
                                        <span>{userData.email}</span>
                                    </div>
                                </div>
                                
                                <div className="profile-actions">
                                    <button 
                                        onClick={handleDelete} 
                                        className="btn-delete"
                                        style={{ 
                                            background: '#8D6E63',
                                            ':hover': { background: '#A1887F' }
                                        }}
                                    >
                                        <FaTrash /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="user-sections">
                    <h2 style={{ color: '#4CAF50' }}>My Dashboard</h2>
                    <div className="section-cards">
                        <div className="section-card" onClick={() => navigate('/myLearningPlan')} style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #C5E1A5',
                            ':hover': { borderColor: '#4CAF50' }
                        }}>
                            <div className="card-icon" style={{ color: '#4CAF50' }}>
                                <FaBookOpen />
                            </div>
                            <div className="card-content">
                                <h3 style={{ color: '#4CAF50' }}>Learning Plan</h3>
                                <p style={{ color: '#8D6E63' }}>View and manage your learning journey</p>
                            </div>
                        </div>
                        
                        <div className="section-card" onClick={() => navigate('/myAllPost')} style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #C5E1A5',
                            ':hover': { borderColor: '#4CAF50' }
                        }}>
                            <div className="card-icon" style={{ color: '#4CAF50' }}>
                                <FaLightbulb />
                            </div>
                            <div className="card-content">
                                <h3 style={{ color: '#4CAF50' }}>Skill Posts</h3>
                                <p style={{ color: '#8D6E63' }}>Browse your shared skills and knowledge</p>
                            </div>
                        </div>
                        
                        <div className="section-card" onClick={() => navigate('/myAchievements')} style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #C5E1A5',
                            ':hover': { borderColor: '#4CAF50' }
                        }}>
                            <div className="card-icon" style={{ color: '#4CAF50' }}>
                                <FaTrophy />
                            </div>
                            <div className="card-content">
                                <h3 style={{ color: '#4CAF50' }}>Achievements</h3>
                                <p style={{ color: '#8D6E63' }}>Celebrate your milestones and successes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogalUserPro;
