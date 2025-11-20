import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AccessoriesPage.css';

// --- SVG Icons ---
const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46V19l4 2v-8.46L22 3"></polygon></svg>
);
const GridIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const SortIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line><polyline points="18 15 21 18 18 21"></polyline><polyline points="18 9 21 6 18 3"></polyline></svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);


// --- Mock Product Data (Add gender property) ---
const apparelProducts = [
    // Add a 'gender' property: 'men', 'women', or 'unisex'
    { id: 101, name: 'Performance T-Shirt', price: 29.99, category: 'T-shirts', gender: 'men', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1287&auto=format&fit=crop' },
{ id: 102, name: 'Training Tank Top', price: 24.99, category: 'Tank Tops', gender: 'men', image: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1287&auto=format&fit=crop' },
{ id: 103, name: 'Running Shorts (Men)', price: 34.99, category: 'Shorts', gender: 'men', image: 'https://images.unsplash.com/photo-1591115765324-41a7f20f5ce7?q=80&w=1287&auto=format&fit=crop' },
{ id: 104, name: 'High-Waist Leggings', price: 49.99, category: 'Leggings', gender: 'women', image: 'https://images.unsplash.com/photo-1616785449760-bf5ce36c747d?q=80&w=1287&auto=format&fit=crop' },
{ id: 105, name: 'Tech Fleece Joggers', price: 59.99, category: 'Joggers', gender: 'unisex', image: 'https://images.unsplash.com/photo-1551534408-16c9a1d34346?q=80&w=1287&auto=format&fit=crop' },
{ id: 106, name: 'Pullover Hoodie', price: 69.99, category: 'Hoodies', gender: 'unisex', image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=1287&auto=format&fit=crop' },
{ id: 107, name: 'Medium Support Sports Bra', price: 39.99, category: 'Sports Bras', gender: 'women', image: 'https://images.unsplash.com/photo-1606902965551-dce8359b8e6b?q=80&w=1287&auto=format&fit=crop' },
{ id: 108, name: 'Weightlifting Gloves', price: 19.99, category: 'Gym Gloves', gender: 'unisex', image: 'https://images.unsplash.com/photo-1600861194883-2ac7540c668c?q=80&w=1287&auto=format&fit=crop' },
{ id: 109, name: 'Breathable Mesh T-Shirt (Women)', price: 32.99, category: 'T-shirts', gender: 'women', image: 'https://images.unsplash.com/photo-1622055026040-7b3b3a033cb4?q=80&w=1287&auto=format&fit=crop' },
{ id: 110, name: 'Compression Leggings (Men)', price: 54.99, category: 'Leggings', gender: 'men', image: 'https://images.unsplash.com/photo-1614900705141-9d6c770d10b0?q=80&w=1287&auto=format&fit=crop' }, // Added Men's Leggings example
{ id: 111, name: 'Track Pants', price: 45.99, category: 'Joggers', gender: 'unisex', image: 'https://images.unsplash.com/photo-1624308801918-36065edf997a?q=80&w=1287&auto=format&fit=crop' },
{ id: 112, name: 'Zip-Up Sweatshirt', price: 65.99, category: 'Hoodies', gender: 'unisex', image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1372&auto=format&fit=crop' },
{ id: 113, name: 'Women\'s Workout Shorts', price: 30.99, category: 'Shorts', gender: 'women', image: 'https://images.unsplash.com/photo-1594759682736-aa576353395c?q=80&w=1287&auto=format&fit=crop' },
];

// --- Category Structure with Genders ---
const categoriesByGender = [
    {
        gender: 'Men',
        id: 'men',
        items: [
            { name: 'All Men\'s', id: 'men-all' },
            { name: 'T-shirts', id: 'men-t-shirts', actualCategory: 'T-shirts' },
            { name: 'Tank Tops', id: 'men-tank-tops', actualCategory: 'Tank Tops' },
            { name: 'Shorts', id: 'men-shorts', actualCategory: 'Shorts' },
            { name: 'Leggings', id: 'men-leggings', actualCategory: 'Leggings' },
            { name: 'Joggers', id: 'men-joggers', actualCategory: 'Joggers' },
            { name: 'Hoodies', id: 'men-hoodies', actualCategory: 'Hoodies' },
            { name: 'Gym Gloves', id: 'men-gloves', actualCategory: 'Gym Gloves' },
        ]
    },
{
    gender: 'Women',
    id: 'women',
    items: [
        { name: 'All Women\'s', id: 'women-all' },
        { name: 'T-shirts', id: 'women-t-shirts', actualCategory: 'T-shirts' },
        { name: 'Tank Tops', id: 'women-tank-tops', actualCategory: 'Tank Tops' },
        { name: 'Shorts', id: 'women-shorts', actualCategory: 'Shorts' },
        { name: 'Leggings', id: 'women-leggings', actualCategory: 'Leggings' },
        { name: 'Joggers', id: 'women-joggers', actualCategory: 'Joggers' },
        { name: 'Hoodies', id: 'women-hoodies', actualCategory: 'Hoodies' },
        { name: 'Sports Bras', id: 'women-sports-bras', actualCategory: 'Sports Bras' },
        { name: 'Gym Gloves', id: 'women-gloves', actualCategory: 'Gym Gloves' },
    ]
},
{
    gender: 'Unisex',
    id: 'unisex',
    items: [
        { name: 'All Unisex', id: 'unisex-all' },
        { name: 'T-shirts', id: 'unisex-t-shirts', actualCategory: 'T-shirts' },
        { name: 'Tank Tops', id: 'unisex-tank-tops', actualCategory: 'Tank Tops' },
        { name: 'Joggers', id: 'unisex-joggers', actualCategory: 'Joggers' },
        { name: 'Hoodies', id: 'unisex-hoodies', actualCategory: 'Hoodies' },
        { name: 'Gym Gloves', id: 'unisex-gloves', actualCategory: 'Gym Gloves' },
    ]
},
];

const allCategoryItems = categoriesByGender.flatMap(g => g.items);

// --- Sort Options ---
const sortOptions = [
    { id: 'recommended', name: 'Recommended' },
{ id: 'newest', name: 'New Arrivals' },
{ id: 'popular', name: 'Most Popular' },
{ id: 'priceHighLow', name: 'Price: High to Low' },
{ id: 'priceLowHigh', name: 'Price: Low to High' },
];


export default function AccessoriesPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('men-all');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const sortDropdownRef = useRef(null);

    // Filter Products
    const filteredProducts = apparelProducts.filter(product => {
        const selectedCat = allCategoryItems.find(item => item.id === selectedCategoryId);
        if (!selectedCat) return true;

        if (selectedCat.id.endsWith('-all')) {
            const gender = selectedCat.id.split('-')[0];
            // Include unisex items when viewing 'All Men's' or 'All Women's', but only unisex for 'All Unisex'
            return gender === 'unisex' ? product.gender === 'unisex' : (product.gender === gender || product.gender === 'unisex');
        } else {
            const gender = selectedCat.id.split('-')[0];
            // Include unisex items here too if the specific category matches
            return (product.gender === gender || (product.gender === 'unisex' && gender !== 'unisex')) && product.category === selectedCat.actualCategory;
        }
    }).sort((a, b) => {
        switch (selectedSort.id) {
            case 'priceLowHigh':
                return a.price - b.price;
            case 'priceHighLow':
                return b.price - a.price;
                // Add cases for 'newest', 'popular' based on actual data structure later
            case 'newest':
            case 'popular':
            case 'recommended':
            default:
                return 0; // Default: no specific sort or retain original order
        }
    });


    // Sort Dropdown Logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSortSelect = (option) => {
        setSelectedSort(option);
        setIsSortOpen(false);
        console.log("Sorting by:", option.id);
    };

    const selectedCategoryName = allCategoryItems.find(item => item.id === selectedCategoryId)?.name || 'Apparel';

    return (
        <div className="apparels-page-container">
        <aside className="apparel-sidebar">
        <h3><FilterIcon /> Categories</h3>
        <nav className="category-nav">
        {categoriesByGender.map(genderGroup => (
            <div key={genderGroup.id} className="gender-group">
            <h4>{genderGroup.gender}</h4>
            <ul className="subcategory-list">
            {genderGroup.items.map(item => (
                <li key={item.id}>
                <button
                className={`subcategory-link ${selectedCategoryId === item.id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(item.id)}
                >
                {item.name}
                </button>
                </li>
            ))}
            </ul>
            </div>
        ))}
        </nav>
        </aside>

        <main className="apparel-content">
        <div className="apparel-header">
        <h2>{selectedCategoryName}</h2>
        <div className="apparel-controls">
        <div className="sort-dropdown" ref={sortDropdownRef}>
        <button className="sort-trigger" onClick={() => setIsSortOpen(!isSortOpen)}>
        <SortIcon />
        <span>Sort: {selectedSort.name}</span>
        <ChevronDownIcon />
        </button>
        {isSortOpen && (
            <ul className="sort-options">
            {sortOptions.map(option => (
                <li key={option.id}>
                <button
                onClick={() => handleSortSelect(option)}
                className={selectedSort.id === option.id ? 'selected' : ''}
                >
                {option.name}
                {selectedSort.id === option.id && <span className="radio-dot"></span>}
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
        <button className="view-toggle active" aria-label="Grid view">
        <GridIcon />
        </button>
        </div>
        </div>

        <div className="product-grid">
        {filteredProducts.map(product => (
            <div className="product-card-apparel" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image-apparel" />
            <div className="product-info-apparel">
            <h4 className="product-name-apparel">{product.name}</h4>
            <p className="product-price-apparel">${product.price.toFixed(2)}</p>
            <button className="btn btn-primary add-to-cart-btn">Add to Cart</button>
            </div>
            </div>
        ))}
        {filteredProducts.length === 0 && <p>No products found matching your selection.</p>}
        </div>
        </main>
        </div>
    );
}
