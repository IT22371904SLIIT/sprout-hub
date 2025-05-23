import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import '../PostManagement/AllPostModern.css'; // Import the modern styling
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";

function AllLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchOwnerName, setSearchOwnerName] = useState('');
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        setPosts(response.data);
        setFilteredPosts(response.data); // Initially show all posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Ensure this runs only once on component mount

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Post deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id)); // Update the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchOwnerName(value);
    setFilteredPosts(
      posts.filter((post) =>
        post.postOwnerName.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const renderPostByTemplate = (post) => {
    console.log('Rendering post:', post); // Debugging: Log the post object
    if (!post.templateID) { // Use the correct field name
      console.warn('Missing templateID for post:', post); // Warn if templateID is missing
      return <div className="template template-default">Invalid template ID</div>;
    }

    switch (post.templateID) { // Use the correct field name
      case 1:
        return (
          <div className="template_dis template-1" style={{ color: '#8D6E63', borderColor: '#C5E1A5' }}>
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ color: '#4CAF50' }}>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post'>
                  <FaEdit
                    style={{ color: '#4CAF50' }}
                    onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                  <RiDeleteBin6Fill
                    style={{ color: '#8D6E63' }}
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon' />
                </div>
              )}
            </div>
            <p className='template_title'>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description'>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>
        );
      case 2:
        return (
          <div className="template_dis template-2" style={{ color: '#8D6E63', borderColor: '#C5E1A5' }}>
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ color: '#4CAF50' }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post'>
                  <FaEdit
                    style={{ color: '#4CAF50' }}
                    onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                  <RiDeleteBin6Fill
                    style={{ color: '#8D6E63' }}
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon' />
                </div>
              )}
            </div>
            <p className='template_title'>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description'>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            <div className='preview_part'>
              <div className='preview_part_sub'>
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                    className="iframe_preview"
                  />
                )}
              </div>
              <div className='preview_part_sub'>
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    className="iframe_preview"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="template_dis template-3" style={{ color: '#8D6E63', borderColor: '#C5E1A5' }}>
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ color: '#4CAF50' }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post'>
                  <FaEdit
                    style={{ color: '#4CAF50' }}
                    onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                  <RiDeleteBin6Fill
                    style={{ color: '#8D6E63' }}
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon' />
                </div>
              )}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
            <p className='template_title'>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description'>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
          </div>
        );
      default:
        console.warn('Unknown templateID:', post.templateID); // Warn if templateID is unexpected
        return (
          <div className="template template-default">
            <p>Unknown template ID: {post.templateID}</p>
          </div>
        );
    }
  };

  return (
    <div className="modern-container" style={{ background: '#F9FBE7' }}>
      <NavBar />
      <div className="modern-content" style={{ background: 'rgba(249, 251, 231, 0.7)' }}>
        <div className="search-container" style={{ marginTop: "80px" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by owner name"
            value={searchOwnerName}
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
            onClick={() => (window.location.href = '/addLearningPlan')}
          >
            <IoIosCreate className="create-icon" />
            <span>Create Learning Plan</span>
          </button>
        </div>
        <div className='post_card_continer'>
          {filteredPosts.length === 0 ? (
            <div className="empty-state" style={{ color: '#8D6E63' }}>
              <div className="empty-icon"></div>
              <h3>No learning plans found</h3>
              <p>Create a new learning plan to share with the community</p>
              <button 
                className="primary-button"
                style={{ 
                  background: '#4CAF50',
                  color: 'white',
                  ':hover': {
                    background: '#388E3C'
                  }
                }}
                onClick={() => (window.location.href = '/addLearningPlan')}
              >
                Create Learning Plan
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className='post_card_new' style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #C5E1A5'
              }}>
                {renderPostByTemplate(post)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AllLearningPlan;