import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import Pagination from './Pagination';
import './BlogPage.css';

const BlogPage = ({ blogs, itemsPerPage = 12 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-header-title">EXPLORE MORE ARTICLES</h1>
      </div>

      <div className="blog-grid">
        {currentBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            image={blog.image}
            title={blog.title}
            category={blog.category}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BlogPage;
