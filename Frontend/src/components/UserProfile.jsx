import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { Link } from 'react-router-dom'; // Added Link
import './UserProfile.css'; //

// --- COPIED FROM LAYOUT.JSX ---
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);
// Copied UserIcon from Layout - can reuse the one below if identical
// const UserIconLayout = () => (...)
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

// User Dropdown Component (Copied from Layout.jsx)
const UserDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle cases where user might be null briefly during logout transition
    const username = user?.email?.split('@')[0] || 'User';
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Use Profile's UserIcon
    const ProfileUserIcon = UserIcon;

    return (
        <div className="user-dropdown" ref={dropdownRef}>
        <button className="user-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <ProfileUserIcon />
        <span className="user-greeting">Hi, {capitalizedUsername}</span>
        <ChevronDownIcon />
        </button>
        {isOpen && (
            <div className="user-dropdown-menu">
            <div className="user-dropdown-header">
            <ProfileUserIcon />
            <div className="user-dropdown-header-info">
            <span>Hi, {capitalizedUsername}</span>
            </div>
            </div>
            <ul className="user-dropdown-list">
            {/* Link directly to profile sections or keep as full page links? */}
            <li><Link to="/profile" onClick={() => { /* setActiveSection('orders'); */ setIsOpen(false); }}>Order History</Link></li>
            <li><Link to="/profile" onClick={() => { /* setActiveSection('wishlist'); */ setIsOpen(false); }}>Favorites Lists</Link></li>
            <li><Link to="/profile" onClick={() => { /* setActiveSection('shipping'); */ setIsOpen(false); }}>Address Book</Link></li>
            {/* <li><a href="#communications">Communications</a></li> */}
            <li><Link to="/profile" onClick={() => { /* setActiveSection('details'); */ setIsOpen(false); }}>Account Information</Link></li>
            {/* <li><a href="#returns">Return Request</a></li> */}
            <li><button onClick={() => { onLogout(); setIsOpen(false); }} className="dropdown-signout">Sign Out</button></li>
            </ul>
            </div>
        )}
        </div>
    );
};
// --- END COPIED FROM LAYOUT.JSX ---


// --- Helper Components (SVG Icons for Profile Page) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const DumbbellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6M18 6l-6 6M6 18l6-6M12 12l6 6M12 12l-6-6M21 12h-2M5 12H3M12 21v-2M12 5V3"/></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

// --- Helper: Options from Doc ---
// ... (options remain the same)
const equipmentUseOptions = ["GYM", "ACCESSORY", "BODY WEIGHTS (NO EQUIPMENT)", "HOME GYM"];
const freeWeightOptions = ["Dumbbell", "Kettlebell", "Barbell", "Ez bar", "Plate", "Band", "Battle ropes"];
const machineOptions = ["Cable Machine", "Dip/chin machine", "Lat pulldown machine", "Long pull machine", "Seated row machine", "T bar row machine", "Bench press", "Pec deck machine", "Chest press machine", "Decline bench press machine", "Incline press machine", "Shoulder press machine", "Lateral raise machine"];
const benchRackOptions = ["Bench and rack"];
const cardioOptions = ["Cardio"];
const workoutFrequencyOptions = [2, 3, 4, 5, 6];
const mainGoalOptions = ["Start weight training", "Gain Muscle", "Lose Weight", "Target Specific Areas", "Create a healthy Habit", "Boost athletic performance"];
const workoutPrioritiesOptions = ["Lose fat", "Lean legs", "Round hips", "Gain muscle", "Strength", "Flexibility", "Stamina", "Defined abs", "Agility", "Reducing body fat", "Gaining weight", "Muscular arms", "Broad shoulders", "Bulk up", "Slim arms", "Burn belly and side fat", "Endurance", "Body balance", "Toned body"];
const injuryAreasOptions = ["Neck", "Shoulders", "Back", "Elbows", "Wrists", "Hips", "Knees", "Ankles"];
const trainingExperienceOptions = ["Never", "Less than 1 year", "1-3 years", "More than 3 years"];


// --- Accept setUser prop ---
export default function ProfilePage({ user, setUser, setIsProfileVisible }) { // Added setUser
    // --- State Variables ---
    const [activeSection, setActiveSection] = useState('details');
    const [successMessage, setSuccessMessage] = useState('');
    const [apiError, setApiError] = useState('');
    const headerRef = useRef(null); // Ref for header scroll effect

    // Account details state
    // ... (state variables remain the same)
    const [accountDetails, setAccountDetails] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
    });
    const [address, setAddress] = useState({
        street: '',
        city: '',
        zip_code: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [personalInfo, setPersonalInfo] = useState({
        gender: '',
        equipmentUse: [],
        equipmentSelect: { freeWeights: [], machines: [], benchRack: [], cardio: [] },
        workoutFrequency: '',
        mainGoal: '',
        workoutPriorities: [],
        height: '',
        currentWeight: '',
        targetWeight: '',
        hasInjuries: '',
        injuredAreas: [],
        trainingExperience: '',
        wantsHomeGym: '',
        roomSpecs: { width: '', height: '', depth: '' },
    });
    // --- Mock Data (Keep or remove as needed) ---
    const orders = [ /* ... mock orders ... */ ];
    const wishlist = [ /* ... mock wishlist ... */ ];
    const workoutPlans = [ /* ... mock plans ... */ ];

    // --- API Base URL ---
    const API_BASE_URL = 'http://localhost:5000/api/users'; // Adjust if needed

    // --- Fetch initial profile data ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.token) return;
            setApiError('');
            try {
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await response.json();
                setAccountDetails({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    phone_number: data.phone_number || '',
                });
                setAddress({
                    street: data.shipping_address?.street || '',
                    city: data.shipping_address?.city || '',
                    zip_code: data.shipping_address?.zip_code || '',
                });
                // TODO: Fetch personalInfo data here when backend is ready
                // setPersonalInfo(data.personalInfo || { ...initialPersonalInfoState });
            } catch (err) {
                setApiError(`Error fetching profile: ${err.message}`);
                console.error("Fetch profile error:", err);
            }
        };
        fetchProfile();
    }, [user]); // Re-fetch if user object changes

    // --- Handlers ---
    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleAccountDetailsChange = (e) => {
        setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // --- NEW: Personal Info Change Handler ---
    const handlePersonalInfoChange = (e) => {
        const { name, value, type, checked } = e.target;

        setPersonalInfo(prev => {
            // Handle checkboxes (multiple selections like priorities, equipment use)
            if (type === 'checkbox') {
                const currentValues = prev[name] || [];
                if (checked) {
                    return { ...prev, [name]: [...currentValues, value] };
                } else {
                    return { ...prev, [name]: currentValues.filter(item => item !== value) };
                }
            }
            // Handle nested equipment selections
            if (name.startsWith('equipmentSelect.')) {
                const group = name.split('.')[1]; // e.g., 'freeWeights'
                const equipment = value;
                const currentGroupValues = prev.equipmentSelect[group] || [];
                let newGroupValues;
                if (checked) {
                    newGroupValues = [...currentGroupValues, equipment];
                } else {
                    newGroupValues = currentGroupValues.filter(item => item !== equipment);
                }
                return { ...prev, equipmentSelect: { ...prev.equipmentSelect, [group]: newGroupValues } };
            }
            // Handle nested room specs
            if (name.startsWith('roomSpecs.')) {
                const spec = name.split('.')[1]; // 'width', 'height', or 'depth'
                return { ...prev, roomSpecs: { ...prev.roomSpecs, [spec]: value } };
            }
            // Handle regular inputs, radios, selects
            return { ...prev, [name]: value };
        });
    };

    // --- API Submission Handlers ---
    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        setApiError('');
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    first_name: accountDetails.first_name,
                    last_name: accountDetails.last_name,
                    phone_number: accountDetails.phone_number,
                    // Keep existing address if only updating details
                    shipping_address: {
                        street: address.street,
                        city: address.city,
                        zip_code: address.zip_code
                    }
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! status: ${response.status}`);
            }
            // Update state with potentially corrected data from backend
            setAccountDetails({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                phone_number: data.phone_number || '',
            });
            setAddress(data.shipping_address || { street: '', city: '', zip_code: '' });
            showSuccess('Account details updated successfully!');
        } catch (err) {
            setApiError(`Error updating details: ${err.message}`);
            console.error("Update details error:", err);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        setApiError('');
        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    // Keep existing details if only updating address
                    first_name: accountDetails.first_name,
                    last_name: accountDetails.last_name,
                    phone_number: accountDetails.phone_number,
                    shipping_address: { // Send the address object
                        street: address.street,
                        city: address.city,
                        zip_code: address.zip_code
                        // Add state/country if needed
                    }
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! status: ${response.status}`);
            }
            // Update state with potentially corrected data from backend
            setAccountDetails({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                phone_number: data.phone_number || '',
            });
            setAddress(data.shipping_address || { street: '', city: '', zip_code: '' });
            showSuccess('Shipping address updated successfully!');
        } catch (err) {
            setApiError(`Error updating address: ${err.message}`);
            console.error("Update address error:", err);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement API call to a separate /api/users/change-password endpoint
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setApiError('New passwords do not match!');
            return;
        }
        setApiError('');
        console.log("Submitting password change:", passwordData); // Placeholder
        showSuccess('Password updated successfully!'); // Assume success for now
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    };

    // --- NEW: Personal Info Submit Handler ---
    const handlePersonalInfoSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement API call to save personalInfo to backend
        // e.g., PUT /api/users/profile/personal
        setApiError('');
        console.log("Saving Personal Info:", personalInfo); // Placeholder
        showSuccess('Personal information saved!'); // Assume success for now
    };

    // Get user initials for avatar
    const getInitials = () => {
        const first = accountDetails.first_name || '';
        const last = accountDetails.last_name || '';
        return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || (user?.email[0] || '?').toUpperCase();
    };


    // --- Render Section Logic ---
    const renderSection = () => {
        switch (activeSection) {
            case 'details':
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>Account Details</h3>
                    <p>Manage your personal information and settings.</p>
                    </div>
                    {apiError && <div className="error-message">{apiError}</div>}
                    <form className="profile-form" onSubmit={handleDetailsSubmit}>
                    <div className="form-row">
                    <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                    type="text"
                    id="first_name"
                    name="first_name" // Added name attribute
                    value={accountDetails.first_name}
                    onChange={handleAccountDetailsChange} // Use specific handler
                    />
                    </div>
                    <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                    type="text"
                    id="last_name"
                    name="last_name" // Added name attribute
                    value={accountDetails.last_name}
                    onChange={handleAccountDetailsChange} // Use specific handler
                    />
                    </div>
                    </div>
                    <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={user?.email || ''} readOnly disabled />
                    <small className="form-hint">Email cannot be changed</small>
                    </div>
                    <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <input
                    type="tel"
                    id="phone_number"
                    name="phone_number" // Added name attribute
                    value={accountDetails.phone_number}
                    onChange={handleAccountDetailsChange} // Use specific handler
                    />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                    </div>
                );

                // --- NEW: Personal Information Section ---
                case 'personalInfo':
                    return (
                        <div className="profile-section">
                        <div className="section-header">
                        <h3>Personal Information</h3>
                        <p>Help us tailor your experience.</p>
                        </div>
                        {apiError && <div className="error-message">{apiError}</div>}
                        <form className="profile-form personal-info-form" onSubmit={handlePersonalInfoSubmit}>

                        {/* --- Q1: Gender --- */}
                        <div className="form-group">
                        <label>Gender</label>
                        <div className="radio-group">
                        <label>
                        <input type="radio" name="gender" value="male" checked={personalInfo.gender === 'male'} onChange={handlePersonalInfoChange} /> Male
                        </label>
                        <label>
                        <input type="radio" name="gender" value="female" checked={personalInfo.gender === 'female'} onChange={handlePersonalInfoChange} /> Female
                        </label>
                        </div>
                        </div>

                        {/* --- Q2: Equipment Use --- */}
                        <div className="form-group">
                        <label>What equipment can you use?</label>
                        <div className="checkbox-group-columns"> {/* Apply column layout */}
                        {equipmentUseOptions.map(option => (
                            <label key={option}>
                            <input
                            type="checkbox"
                            name="equipmentUse"
                            value={option}
                            checked={personalInfo.equipmentUse.includes(option)}
                            onChange={handlePersonalInfoChange}
                            /> {option}
                            </label>
                        ))}
                        </div>
                        </div>

                        {/* --- Q3: Select Equipment (Conditional) --- */}
                        {(personalInfo.equipmentUse.includes("GYM") || personalInfo.equipmentUse.includes("HOME GYM")) && (
                            <div className="form-group equipment-selection">
                            <label>Select Your Available Equipment</label>
                            <div className="equipment-subgroup">
                            <h4>Free Weights</h4>
                            <div className="checkbox-group-columns">
                            {freeWeightOptions.map(option => (
                                <label key={option}>
                                <input type="checkbox" name="equipmentSelect.freeWeights" value={option} checked={personalInfo.equipmentSelect.freeWeights.includes(option)} onChange={handlePersonalInfoChange} /> {option}
                                </label>
                            ))}
                            </div>
                            </div>
                            <div className="equipment-subgroup">
                            <h4>Machines</h4>
                            <div className="checkbox-group-columns checkbox-group-scroll"> {/* Add scroll */}
                            {machineOptions.map(option => (
                                <label key={option}>
                                <input type="checkbox" name="equipmentSelect.machines" value={option} checked={personalInfo.equipmentSelect.machines.includes(option)} onChange={handlePersonalInfoChange} /> {option}
                                </label>
                            ))}
                            </div>
                            </div>
                            <div className="equipment-subgroup">
                            <h4>Benches & Racks</h4>
                            <div className="checkbox-group-columns">
                            {benchRackOptions.map(option => (
                                <label key={option}>
                                <input type="checkbox" name="equipmentSelect.benchRack" value={option} checked={personalInfo.equipmentSelect.benchRack.includes(option)} onChange={handlePersonalInfoChange} /> {option}
                                </label>
                            ))}
                            </div>
                            </div>
                            <div className="equipment-subgroup">
                            <h4>Cardio</h4>
                            <div className="checkbox-group-columns">
                            {cardioOptions.map(option => (
                                <label key={option}>
                                <input type="checkbox" name="equipmentSelect.cardio" value={option} checked={personalInfo.equipmentSelect.cardio.includes(option)} onChange={handlePersonalInfoChange} /> {option}
                                </label>
                            ))}
                            </div>
                            </div>
                            {/* Add more groups like Cardio etc. */}
                            </div>
                        )}

                        {/* --- Q4: Workout Frequency --- */}
                        <div className="form-group">
                        <label htmlFor="workoutFrequency">How often do you work out per week?</label>
                        <select id="workoutFrequency" name="workoutFrequency" value={personalInfo.workoutFrequency} onChange={handlePersonalInfoChange}>
                        <option value="">Select frequency...</option>
                        {workoutFrequencyOptions.map(num => <option key={num} value={num}>{num} times</option>)}
                        </select>
                        </div>

                        {/* --- Q5: Main Goal --- */}
                        <div className="form-group">
                        <label>What is your main goal?</label>
                        <select name="mainGoal" value={personalInfo.mainGoal} onChange={handlePersonalInfoChange}>
                        <option value="">Select goal...</option>
                        {mainGoalOptions.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                        </select>
                        </div>

                        {/* --- Q6: Workout Priorities --- */}
                        <div className="form-group">
                        <label>What are your priorities in workouts? (Select multiple)</label>
                        <div className="checkbox-group-columns checkbox-group-scroll"> {/* Apply scroll */}
                        {workoutPrioritiesOptions.map(priority => (
                            <label key={priority}>
                            <input type="checkbox" name="workoutPriorities" value={priority} checked={personalInfo.workoutPriorities.includes(priority)} onChange={handlePersonalInfoChange} /> {priority}
                            </label>
                        ))}
                        </div>
                        </div>

                        {/* --- Q7, 8, 9: Height, Weights --- */}
                        <div className="form-row">
                        <div className="form-group">
                        <label htmlFor="height">Height (cm)</label>
                        <input type="number" id="height" name="height" value={personalInfo.height} onChange={handlePersonalInfoChange} placeholder="e.g., 175" />
                        </div>
                        <div className="form-group">
                        <label htmlFor="currentWeight">Current Weight (kg)</label>
                        <input type="number" id="currentWeight" name="currentWeight" value={personalInfo.currentWeight} onChange={handlePersonalInfoChange} placeholder="e.g., 70" />
                        </div>
                        </div>
                        <div className="form-group">
                        <label htmlFor="targetWeight">Target Weight (kg)</label>
                        <input type="number" id="targetWeight" name="targetWeight" value={personalInfo.targetWeight} onChange={handlePersonalInfoChange} placeholder="e.g., 65" />
                        </div>

                        {/* --- Q10: Injuries --- */}
                        <div className="form-group">
                        <label>Do you have any injuries?</label>
                        <div className="radio-group">
                        <label><input type="radio" name="hasInjuries" value="yes" checked={personalInfo.hasInjuries === 'yes'} onChange={handlePersonalInfoChange} /> Yes</label>
                        <label><input type="radio" name="hasInjuries" value="no" checked={personalInfo.hasInjuries === 'no'} onChange={handlePersonalInfoChange} /> No</label>
                        </div>
                        </div>
                        {personalInfo.hasInjuries === 'yes' && (
                            <div className="form-group">
                            <label>Select injured areas (if any):</label>
                            <div className="checkbox-group-columns">
                            {injuryAreasOptions.map(area => (
                                <label key={area}>
                                <input type="checkbox" name="injuredAreas" value={area} checked={personalInfo.injuredAreas.includes(area)} onChange={handlePersonalInfoChange} /> {area}
                                </label>
                            ))}
                            </div>
                            </div>
                        )}

                        {/* --- Q11: Training Experience --- */}
                        <div className="form-group">
                        <label>How long have you done regular weight training?</label>
                        <select name="trainingExperience" value={personalInfo.trainingExperience} onChange={handlePersonalInfoChange}>
                        <option value="">Select experience...</option>
                        {trainingExperienceOptions.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                        </select>
                        </div>

                        {/* --- Q12: Home Gym Interest --- */}
                        <div className="form-group">
                        <label>Are you looking for a home gym setup?</label>
                        <div className="radio-group">
                        <label><input type="radio" name="wantsHomeGym" value="yes" checked={personalInfo.wantsHomeGym === 'yes'} onChange={handlePersonalInfoChange} /> Yes</label>
                        <label><input type="radio" name="wantsHomeGym" value="no" checked={personalInfo.wantsHomeGym === 'no'} onChange={handlePersonalInfoChange} /> No</label>
                        </div>
                        </div>

                        {/* --- Q13: Room Specs (Conditional) --- */}
                        {personalInfo.wantsHomeGym === 'yes' && (
                            <div className="form-group">
                            <label>Room Specifications (approx. in meters)</label>
                            <div className="form-row">
                            <input type="number" name="roomSpecs.width" value={personalInfo.roomSpecs.width} onChange={handlePersonalInfoChange} placeholder="Width (m)" />
                            <input type="number" name="roomSpecs.height" value={personalInfo.roomSpecs.height} onChange={handlePersonalInfoChange} placeholder="Height (m)" />
                            </div>
                            <div className="form-group" style={{marginTop: '15px'}}> {/* Add margin */}
                            <input type="number" name="roomSpecs.depth" value={personalInfo.roomSpecs.depth} onChange={handlePersonalInfoChange} placeholder="Depth (m)" />
                            </div>
                            </div>
                        )}


                        <button type="submit" className="btn btn-primary">Save Personal Info</button>
                        </form>
                        </div>
                    );


                    case 'orders':
                        return <div>Orders section coming soon...</div>;
                    case 'wishlist':
                        return <div>Wishlist section coming soon...</div>;
                    case 'plans':
                        return <div>Workout plans coming soon...</div>;


                    case 'shipping':
                        return (
                            <div className="profile-section">
                            <div className="section-header">
                            <h3>Shipping Address</h3>
                            <p>Manage your delivery information.</p>
                            </div>
                            {apiError && <div className="error-message">{apiError}</div>}
                            <form className="profile-form" onSubmit={handleAddressSubmit}>
                            <div className="form-group">
                            <label htmlFor="street">Street Address</label>
                            <input
                            type="text"
                            id="street"
                            name="street" // Use name matching state key
                            value={address.street}
                            onChange={handleAddressChange} // Use specific handler
                            required
                            />
                            </div>
                            <div className="form-row">
                            <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                            type="text"
                            id="city"
                            name="city" // Use name matching state key
                            value={address.city}
                            onChange={handleAddressChange} // Use specific handler
                            required
                            />
                            </div>
                            {/* You'll need state and country fields if you add them to the form */}
                            <div className="form-group">
                            <label htmlFor="zip_code">ZIP Code</label>
                            <input
                            type="text"
                            id="zip_code"
                            name="zip_code" // Use name matching state key
                            value={address.zip_code}
                            onChange={handleAddressChange} // Use specific handler
                            required
                            />
                            </div>
                            </div>
                            {/* Add State/Country inputs here if needed */}
                            <button type="submit" className="btn btn-primary">Update Address</button>
                            </form>
                            </div>
                        );

                        case 'security':
                            return (
                                <div className="profile-section">
                                <div className="section-header">
                                <h3>Security</h3>
                                <p>Change your password to keep your account secure.</p>
                                </div>
                                {apiError && <div className="error-message">{apiError}</div>}
                                <form className="profile-form" onSubmit={handlePasswordSubmit}>
                                <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword" // Add name attribute
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange} // Use specific handler
                                required
                                />
                                </div>
                                <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                type="password"
                                id="newPassword"
                                name="newPassword" // Add name attribute
                                placeholder="••••••••"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange} // Use specific handler
                                required
                                />
                                <small className="form-hint">Must be at least 8 characters</small>
                                </div>
                                <div className="form-group">
                                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword" // Add name attribute
                                placeholder="••••••••"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange} // Use specific handler
                                required
                                />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Password</button>
                                </form>
                                </div>
                            );


                            default:
                                return null;
        }
    };

    return (
        // Overlay removed for full page display - integrate back if needed as modal
        // <div className="profile-overlay">
        <div className="profile-container"> {/* Changed class */}

        {/* Close button might need repositioning or removal for full page */}
        {/* <button className="close-btn profile-close-btn" onClick={() => setIsProfileVisible(false)}>
        <XIcon/>
        </button> */}

        {successMessage && (
            <div className="success-toast">
            <CheckCircleIcon />
            <span>{successMessage}</span>
            </div>
        )}

        <div className="profile-sidebar">
        <div className="profile-user">
        <div className="profile-avatar">{getInitials()}</div>
        <h4>{accountDetails.first_name || 'User'} {accountDetails.last_name}</h4>
        <p>{user?.email}</p>
        </div>
        <nav className="profile-nav">
        <a className={activeSection === 'details' ? 'active' : ''} onClick={() => setActiveSection('details')}>
        <UserIcon /> <span>Account Details</span>
        </a>
        {/* --- NEW Sidebar Link --- */}
        <a className={activeSection === 'personalInfo' ? 'active' : ''} onClick={() => setActiveSection('personalInfo')}>
        <ClipboardIcon /> <span>Personal Information</span>
        </a>
        <a className={activeSection === 'orders' ? 'active' : ''} onClick={() => setActiveSection('orders')}>
        <PackageIcon/> <span>Order History</span>
        </a>
        <a className={activeSection === 'wishlist' ? 'active' : ''} onClick={() => setActiveSection('wishlist')}>
        <HeartIcon/> <span>My Wishlist</span>
        </a>
        {/* <a className={activeSection === 'plans' ? 'active' : ''} onClick={() => setActiveSection('plans')}>
        <DumbbellIcon/> <span>Workout Plans</span>
        </a> */}
        <a className={activeSection === 'shipping' ? 'active' : ''} onClick={() => setActiveSection('shipping')}>
        <TruckIcon/> <span>Shipping</span>
        </a>
        <a className={activeSection === 'security' ? 'active' : ''} onClick={() => setActiveSection('security')}>
        <ShieldIcon/> <span>Security</span>
        </a>
        </nav>
        </div>

        <div className="profile-content">
        {renderSection()}
        </div>
        </div>
        // </div>
    );
}
