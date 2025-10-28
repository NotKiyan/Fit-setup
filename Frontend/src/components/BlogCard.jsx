import React, { useState } from 'react';
import './BlogCard.css';

const BlogCard = ({ image, title, category }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="blog-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="blog-card-image-container">
        <img
          src={image}
          alt={title}
          className={`blog-card-image ${isHovered ? 'hovered' : ''}`}
        />
        <div className={`blog-card-overlay ${isHovered ? 'visible' : ''}`}>
          <span className="read-more">Read More</span>
        </div>
      </div>
      <div className="blog-card-content">
        {category && <span className="blog-category">{category}</span>}
        <h3 className="blog-title">{title}</h3>
      </div>
    </div>
  );
};

export default BlogCard;
