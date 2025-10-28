import React, { useState } from 'react';
import './EquipmentsPage.css';

// --- Data for all equipment categories ---
// In a real app, you'd fetch this from your backend.
// We use placeholder images for now.
const equipmentData = [
    {
        name: 'CARDIO',
        imageUrl: 'https://via.placeholder.com/400x300.png?text=Cardio',
        subCategories: [
            { name: 'STAIR CLIMBER', imageUrl: 'https://via.placeholder.com/300x200.png?text=Stair+Climber' },
            { name: 'TREADMILL', imageUrl: 'https://via.placeholder.com/300x200.png?text=Treadmill' },
            { name: 'ELLIPTICAL TRAINER', imageUrl: 'https://via.placeholder.com/300x200.png?text=Elliptical' },
            { name: 'BIKES', imageUrl: 'https://via.placeholder.com/300x200.png?text=Bikes' },
            { name: 'ROWER', imageUrl: 'https://via.placeholder.com/300x200.png?text=Rower' },
            { name: 'NON-MOTORISED', imageUrl: 'https://via.placeholder.com/300x200.png?text=Non-Motorised' },
            { name: 'REHAB', imageUrl: 'https://via.placeholder.com/300x200.png?text=Rehab' },
        ]
    },
{
    name: 'STRENGTH',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Strength',
    subCategories: [
        { name: 'POWER RACK', imageUrl: 'https://via.placeholder.com/300x200.png?text=Power+Rack' },
        { name: 'PIN LOADED', imageUrl: 'https://via.placeholder.com/300x200.png?text=Pin+Loaded' },
        { name: 'PLATE LOADED', imageUrl: 'https://via.placeholder.com/300x200.png?text=Plate+Loaded' },
        { name: 'MULTI GYM', imageUrl: 'https://via.placeholder.com/300x200.png?text=Multi+Gym' },
        { name: 'SMITH & FUNCTIONAL TRAINER & CROSSOVER', imageUrl: 'https://via.placeholder.com/300x200.png?text=Functional+Trainer' },
        { name: 'CROSS FIT', imageUrl: 'https://via.placeholder.com/300x200.png?text=CrossFit' },
        { name: 'BENCHES & RACKS', imageUrl: 'https://via.placeholder.com/300x200.png?text=Benches+%26+Racks' },
        { name: 'PILATES', imageUrl: 'https://via.placeholder.com/300x200.png?text=Pilates' },
    ]
}
];

export default function EquipmentsPage() {
    const [mainCategory, setMainCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);

    // --- Handlers for navigation ---
    const handleMainCategoryClick = (categoryName) => {
        setMainCategory(categoryName);
        setSubCategory(null); // Reset sub-category when main one is clicked
    };

    const handleSubCategoryClick = (subCategoryName) => {
        setSubCategory(subCategoryName);
    };

    // This function handles the "Back" button logic
    const handleBackClick = () => {
        if (subCategory) {
            setSubCategory(null); // Go from product list to sub-categories
        } else if (mainCategory) {
            setMainCategory(null); // Go from sub-categories to main categories
        }
    };

    // --- Dynamic rendering logic ---

    // 1. Render Product List (if a sub-category is selected)
    const renderProductList = () => (
        <div className="product-list">
        {/* This is where you would fetch and display actual product items */}
        <p>Showing machines for {subCategory}.</p>
        <p>(Product 1, Product 2, Product 3, etc.)</p>
        </div>
    );

    // 2. Render Sub-Category Cards (if a main category is selected)
    const renderSubCategoryGrid = () => {
        const selected = equipmentData.find(c => c.name === mainCategory);
        return (
            <div className="category-grid">
            {selected.subCategories.map(sub => (
                <div key={sub.name} className="category-card" onClick={() => handleSubCategoryClick(sub.name)}>
                <img src={sub.imageUrl} alt={sub.name} />
                <h3>{sub.name}</h3>
                </div>
            ))}
            </div>
        );
    };

    // 3. Render Main Category Cards (default view)
    const renderMainCategoryGrid = () => (
        <div className="category-grid main-category-grid">
        {equipmentData.map(cat => (
            <div key={cat.name} className="category-card" onClick={() => handleMainCategoryClick(cat.name)}>
            <img src={cat.imageUrl} alt={cat.name} />
            <h3>{cat.name}</h3>
            </div>
        ))}
        </div>
    );

    // --- Main component return ---
    return (
        <main className="equipments-page-container">
        <div className="equipments-header">
        <h2>
        {/* Breadcrumb-style title */}
        {mainCategory ? `${mainCategory}` : 'All Equipment'}
        {subCategory ? ` / ${subCategory}` : ''}
        </h2>
        {/* Show Back button only when we are not on the main page */}
        {mainCategory && (
            <button onClick={handleBackClick} className="back-button">
            &larr; Back
            </button>
        )}
        </div>

        {/* This is the 3-stage rendering logic */}
        {subCategory ? renderProductList() : mainCategory ? renderSubCategoryGrid() : renderMainCategoryGrid()}
        </main>
    );
}
