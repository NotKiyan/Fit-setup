import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EquipmentsPage.css';

// SVG Icons
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const mainCategories = [
    {
        name: 'Cardio',
        subcategories: ['Bikes', 'Elliptical', 'Stair Climber', 'Treadmill']
    },
{
    name: 'Strength',
    subcategories: ['Benches and Rack', 'CrossFit', 'MultiGym', 'Power Rack']
},
{
    name: 'Accessories',
    subcategories: ['Dumbbells', 'Plates and Weights', 'Ropes and Bands', 'Kettlebell', 'Mats']
}
];

const sortOptions = [
    { id: 'best-selling', label: 'Order by Best Selling' },
{ id: 'new', label: 'Order by New' },
{ id: 'price-high', label: 'Order by Price: Highest to Lowest' },
{ id: 'price-low', label: 'Order by Price: Lowest to Highest' },
];

export default function EquipmentProductsPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMainCategory, setSelectedMainCategory] = useState('Cardio');
    const [selectedSubcategory, setSelectedSubcategory] = useState('Bikes');
    const [sortBy, setSortBy] = useState('best-selling');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const sortRef = useRef(null);

    // Navigate to product detail page
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Get subcategories for selected main category
    const currentMainCategory = mainCategories.find(cat => cat.name === selectedMainCategory);
    const subcategories = currentMainCategory?.subcategories || [];

    // Update subcategory when main category changes
    const handleMainCategoryChange = (mainCat) => {
        setSelectedMainCategory(mainCat);
        const newSubcats = mainCategories.find(cat => cat.name === mainCat)?.subcategories || [];
        setSelectedSubcategory(newSubcats[0] || '');
    };

    // Sort products based on selection
    const getSortedProducts = (products) => {
        const sorted = [...products];
        switch (sortBy) {
            case 'best-selling':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'new':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'price-high':
                return sorted.sort((a, b) => b.finalPrice - a.finalPrice);
            case 'price-low':
                return sorted.sort((a, b) => a.finalPrice - b.finalPrice);
            default:
                return sorted;
        }
    };

    // Filter products based on search and category
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMainCategory = product.category === selectedMainCategory;
        const matchesSubcategory = !selectedSubcategory ||
            (product.subCategory && product.subCategory.toLowerCase() === selectedSubcategory.toLowerCase());
        return matchesSearch && matchesMainCategory && matchesSubcategory;
    });

    const sortedProducts = getSortedProducts(filteredProducts);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentSort = sortOptions.find(opt => opt.id === sortBy);

    return (
        <div className="equipments-page-container">
        {/* Header */}
        <div className="equipments-header">
        <button className="equipments-back-button">
        <span>← Products</span>
        </button>
        </div>

        <div className="equipments-main-content">
        {/* Left Sidebar */}
        <aside className="equipments-sidebar">
        <div className="equipments-category-section">
        <h3 className="equipments-sidebar-title">Categories</h3>
        <div className="equipments-categories-list">
        {mainCategories.map(mainCat => (
            <div key={mainCat.name} className="equipments-main-category-group">
            <button
            onClick={() => handleMainCategoryChange(mainCat.name)}
            className={`equipments-main-category-button ${selectedMainCategory === mainCat.name ? 'active' : ''}`}
            >
            {mainCat.name}
            </button>

            {selectedMainCategory === mainCat.name && (
                <div className="equipments-subcategories-list">
                {mainCat.subcategories.map(subCat => (
                    <button
                    key={subCat}
                    onClick={() => setSelectedSubcategory(subCat)}
                    className={`equipments-subcategory-item ${selectedSubcategory === subCat ? 'active' : ''}`}
                    >
                    {subCat}
                    </button>
                ))}
                </div>
            )}
            </div>
        ))}
        </div>
        </div>

        {/* Search Box in Sidebar */}
        <div className="equipments-search-section">
        <div className="equipments-search-box">
        <SearchIcon />
        <input
        type="text"
        placeholder={`Search - ${selectedSubcategory}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="equipments-search-input"
        />
        </div>
        </div>

        <button className="equipments-reset-button">Reset filters</button>
        </aside>

        {/* Right Content */}
        <section className="equipments-content-section">
        {/* Sort and Results Info */}
        <div className="equipments-top-bar">
        <div className="equipments-category-display">
        <h2 className="equipments-category-title">{selectedMainCategory}</h2>
        </div>

        <div className="equipments-sort-container" ref={sortRef}>
        <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className="equipments-sort-button"
        >
        <span>{currentSort?.label}</span>
        <ChevronDownIcon />
        </button>

        {showSortDropdown && (
            <div className="equipments-sort-dropdown">
            {sortOptions.map(option => (
                <button
                key={option.id}
                onClick={() => {
                    setSortBy(option.id);
                    setShowSortDropdown(false);
                }}
                className={`equipments-sort-option ${sortBy === option.id ? 'active' : ''}`}
                >
                {option.label}
                </button>
            ))}
            </div>
        )}
        </div>
        </div>

        {/* Products Grid */}
        {loading ? (
            <div className="equipments-no-results">
            <p>Loading products...</p>
            </div>
        ) : sortedProducts.length > 0 ? (
            <div className="equipments-products-grid">
            {sortedProducts.map(product => (
                <div
                key={product._id}
                className="equipments-product-card"
                onClick={() => handleProductClick(product._id)}
                style={{ cursor: 'pointer' }}
                >
                <div className="equipments-product-image-container">
                <img
                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500'}
                alt={product.name}
                className="equipments-product-image"
                />
                </div>
                <div className="equipments-product-info">
                <h3 className="equipments-product-name">{product.name}</h3>
                <p className="equipments-product-price">${product.finalPrice?.toLocaleString() || product.price?.toLocaleString()}</p>
                {product.discount > 0 && (
                    <p className="equipments-product-original-price">
                    <s>${product.price?.toLocaleString()}</s> ({product.discount}% off)
                    </p>
                )}
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="equipments-no-results">
            <p>No products found in this category.</p>
            </div>
        )}
        </section>
        </div>
        </div>
    );
}
