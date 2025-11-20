// DietAnalysisForm.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import './DietAnalysisForm.css';

// This prop 'personalInfo' must be passed down from UserProfile.jsx
export default function DietAnalysisForm({ user, personalInfo }) {
    const [formData, setFormData] = useState({ reasons: [] }); // Default reasons to empty array
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/dietanalysis'; // New backend URL

    // --- This hook fetches saved data or pre-fills from personalInfo ---
    useEffect(() => {
        const fetchAnalysisData = async () => {
            if (!user?.token) return;
            setIsLoading(true);
            try {
                const response = await fetch(API_URL, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                if (response.status === 404) {
                    // No data found, so pre-fill from personalInfo
                    setFormData(prev => ({
                        ...prev,
                        username: `${personalInfo?.first_name || ''} ${personalInfo?.last_name || ''}`.trim(),
                                         mail: user?.email || '',
                                         height: personalInfo?.height || '',
                                         weight: personalInfo?.currentWeight || '',
                                         phone: personalInfo?.phone_number || ''
                    }));
                } else if (response.ok) {
                    const data = await response.json();
                    setFormData(data || { reasons: [] }); // Load saved data
                } else {
                    throw new Error('Failed to fetch diet analysis');
                }
            } catch (err) {
                setError(`Error loading data: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysisData();
    }, [user, personalInfo]); // Re-run if user or personalInfo changes

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === 'reasons') {
                setFormData(prev => ({
                    ...prev,
                    reasons: checked
                    ? [...(prev.reasons || []), value]
                    : (prev.reasons || []).filter(reason => reason !== value)
                }));
            } else {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
        } else if (type === 'radio') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.msg || `HTTP error! Status: ${response.status}`);
            }
            setSuccess(result.msg || 'Diet analysis saved successfully!');
        } catch (err) {
            setError(`Failed to save: ${err.message}`);
        }
    };

    if (isLoading) {
        return <div className="profile-section"><p>Loading form...</p></div>;
    }

    return (
        <div className="profile-section diet-analysis-form">
        <div className="section-header">
        <h3>Diet Analysis & Preferences</h3>
        <p>Help us understand your nutritional habits and goals.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="profile-form" onSubmit={handleSubmit}>
        <h4>Personal Details</h4>
        <div className="form-row">
        <div className="form-group">
        <label htmlFor="username">Name:</label>
        <input type="text" name="username" id="username" onChange={handleChange} value={formData.username || ''} required />
        </div>
        <div className="form-group">
        <label htmlFor="age">Age:</label>
        <input type="number" name="age" id="age" onChange={handleChange} value={formData.age || ''} required />
        </div>
        <div className="form-group">
        <label htmlFor="dob">Date of Birth:</label>
        <input type="date" name="dob" id="dob" onChange={handleChange} value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} required />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
        <label htmlFor="height">Height (cm):</label>
        <input type="number" name="height" id="height" onChange={handleChange} value={formData.height || ''} required />
        </div>
        <div className="form-group">
        <label htmlFor="weight">Weight (kg): </label>
        <input type="number" name="weight" id="weight" onChange={handleChange} value={formData.weight || ''} required />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
        <label htmlFor="phone">Phone number:</label>
        <input type="tel" name="phone" id="phone" onChange={handleChange} value={formData.phone || ''} />
        </div>
        <div className="form-group">
        <label htmlFor="mail">Email:</label>
        <input type="email" name="mail" id="mail" onChange={handleChange} value={formData.mail || ''} />
        </div>
        </div>

        <h4>Dietary Habits</h4>
        <div className="form-group radio-group-vertical">
        <p>Are you a Vegetarian?</p>
        <label>
        <input type="radio" name="dietType" value="vegetarian" onChange={handleChange} checked={formData.dietType === 'vegetarian'} /> Vegetarian
        </label>
        <label>
        <input type="radio" name="dietType" value="non-vegetarian" onChange={handleChange} checked={formData.dietType === 'non-vegetarian'} /> Non-Vegetarian
        </label>
        </div>
        <div className="form-group">
        <label htmlFor="allergies">Food Allergies or Intolerance:</label>
        <input type="text" name="allergies" id="allergies" onChange={handleChange} value={formData.allergies || ''} />
        </div>
        <div className="form-group">
        <label htmlFor="avoidedfood">What foods do you avoid:</label>
        <input type="text" name="avoidedfood" id="avoidedfood" onChange={handleChange} value={formData.avoidedfood || ''} />
        </div>
        <div className="form-group radio-group-vertical">
        <p>Do you drink alcohol?</p>
        <label>
        <input type="radio" name="alcohol" id="yesalcohol" value="yes" onChange={handleChange} checked={formData.alcohol === 'yes'} /> Yes
        </label>
        <label>
        <input type="radio" name="alcohol" id="noalcohol" value="no" onChange={handleChange} checked={formData.alcohol === 'no'} /> No
        </label>
        </div>
        <div className="form-group">
        <label htmlFor="special_diet">Are you on a special diet? (e.g., Gluten-free, vegan)</label>
        <input type="text" name="special_diet" id="special_diet" size="60" onChange={handleChange} value={formData.special_diet || ''} />
        </div>

        <h4>Exercise</h4>
        <div className="form-group radio-group-vertical">
        <p>Do you currently exercise?</p>
        <label>
        <input type="radio" name="exercise" value="yes" onChange={handleChange} checked={formData.exercise === 'yes'} /> Yes
        </label>
        <label>
        <input type="radio" name="exercise" value="no" onChange={handleChange} checked={formData.exercise === 'no'} /> No
        </label>
        </div>
        <div className="form-group">
        <label htmlFor="exerfreq">If yes, how many times a week?</label>
        <input type="number" name="exerfreq" id="exerfreq" onChange={handleChange} value={formData.exerfreq || ''} />
        </div>

        <h4>Goals</h4>
        <div className="form-group checkbox-group-vertical">
        <label>Why do you want to see a Dietitian?</label>
        {["Healthy meal planning", "Concern about weight gain", "Healthy weight loss", "Healthy weight gain", "Sports nutrition", "Stress eating", "Dining hall eating", "Hunger management", "Food allergies", "Gastrointestinal disorder", "Vegetarian/vegan"].map(reason => (
            <label key={reason}>
            <input
            type="checkbox"
            name="reasons"
            value={reason}
            onChange={handleChange}
            checked={formData.reasons?.includes(reason)}
            /> {reason}
            </label>
        ))}
        <label>
        Other: <input type="text" name="other_reason" size="30" onChange={handleChange} value={formData.other_reason || ''} />
        </label>
        </div>

        <h4>Additional Information</h4>
        <div className="form-group">
        <label htmlFor="addinfo">Please add any relevant nutritional health info (chronic disease, surgeries, etc.)</label>
        <textarea name="addinfo" id="addinfo" rows="4" onChange={handleChange} value={formData.addinfo || ''}></textarea>
        </div>

        <h4>Feedback</h4>
        <div className="form-group">
        <label htmlFor="feedback">Please give us your feedback</label>
        <textarea name="feedback" id="feedback" rows="5" onChange={handleChange} value={formData.feedback || ''}></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Submit Analysis</button>
        </form>
        </div>
    );
}
