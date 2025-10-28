import React from 'react';
import BlogPage from '../components/BlogPage';
import { blogData } from '../data/blogData';

const BlogPageContainer = () => {
  return <BlogPage blogs={blogData} itemsPerPage={12} />;
};

export default BlogPageContainer;
