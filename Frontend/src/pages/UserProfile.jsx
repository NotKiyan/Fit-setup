import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import TrainingLog from '../components/TrainingLog.jsx';
import ProgressAnalytics from '../components/ProgressAnalytics.jsx';
import DietAnalysisForm from '../components/DietAnalysisForm.jsx';
import DietTracker from '../components/DietTracker.jsx';

// --- SVG Icons ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const DumbbellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6M18 6l-6 6M6 18l6-6M12 12l6 6M12 12l-6-6M21 12h-2M5 12H3M12 21v-2M12 5V3"/></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2 2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const MinusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const BotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M12 12v.01"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const XSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const BarChart2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
// --- Helper: Options ---
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


export default function ProfilePage({ user, setUser }) {
    // --- State Variables ---
    const [activeSection, setActiveSection] = useState('details');
    const [successMessage, setSuccessMessage] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [accountDetails, setAccountDetails] = useState({ first_name: '', last_name: '', phone_number: '' });
    const [address, setAddress] = useState({ street: '', city: '', zip_code: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

    // **MODIFIED** Added new state for Personal Info editing
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
    const [originalPersonalInfo, setOriginalPersonalInfo] = useState(null); // For cancellation
    const [personalInfo, setPersonalInfo] = useState({
        gender: '', equipmentUse: [], equipmentSelect: { freeWeights: [], machines: [], benchRack: [], cardio: [] },
        workoutFrequency: '', mainGoal: '', workoutPriorities: [], height: '', currentWeight: '', targetWeight: '',
        hasInjuries: '', injuredAreas: [], trainingExperience: '', wantsHomeGym: '', roomSpecs: { width: '', height: '', depth: '' },
    });

    // --- Training Plan State ---
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'view', 'edit'
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentPlanName, setCurrentPlanName] = useState('');
    const [currentPlanExercises, setCurrentPlanExercises] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [isSavingPlan, setIsSavingPlan] = useState(false);
    const [isLoadingExercises, setIsLoadingExercises] = useState(false);

    // --- Mock Data ---
    const orders = [];
    const wishlist = [];

    // --- API Base URLs ---
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const USER_API_BASE_URL = `${API_BASE}/users`;
    const EXERCISE_API_BASE_URL = `${API_BASE}/exercises`;
    const PLAN_API_BASE_URL = `${API_BASE}/trainingplans`;

    const navigate = useNavigate();

    // --- Fetch initial profile, plans, exercises (Optimized) ---
    useEffect(() => {
        let isMounted = true;
        const fetchAllData = async () => {
            if (!user?.token) { navigate('/login'); return; }
            if (!isMounted) return;
            setApiError('');
            setIsLoadingData(true);
            setIsLoadingExercises(true);

            try {
                // --- OPTIMIZATION: Run fetches in parallel ---
                const headers = { 'Authorization': `Bearer ${user.token}` };
                const [profileResponse, plansResponse, exercisesResponse] = await Promise.all([
                    fetch(`${USER_API_BASE_URL}/profile`, { headers }),
                                                                                              fetch(`${PLAN_API_BASE_URL}`, { headers }),
                                                                                              fetch(`${EXERCISE_API_BASE_URL}`) // No auth assumed
                ]);
                // --- END OPTIMIZATION ---

                // --- 1. Process Profile Response ---
                if (!profileResponse.ok) {
                    if (profileResponse.status === 401 || profileResponse.status === 403) {
                        console.error("Auth error fetching profile, logging out.");
                        localStorage.removeItem('token'); localStorage.removeItem('userEmail'); localStorage.removeItem('userRole');
                        if (isMounted) setUser(null);
                        navigate('/login'); return;
                    }
                    throw new Error(`Profile fetch failed: ${profileResponse.statusText}`);
                }
                const profileData = await profileResponse.json();
                if (!isMounted) return;

                setAccountDetails({ first_name: profileData.first_name || '', last_name: profileData.last_name || '', phone_number: profileData.phone_number || '' });
                setAddress({ street: profileData.shipping_address?.street || '', city: profileData.shipping_address?.city || '', zip_code: profileData.shipping_address?.zip_code || '' });

                const pi = profileData.personalInfo || {};
                // **NEW** Create a clean data object for both original and editable state
                const pi_data = {
                    gender: pi.gender || '', equipmentUse: Array.isArray(pi.equipmentUse) ? pi.equipmentUse : [],
              equipmentSelect: { freeWeights: Array.isArray(pi.equipmentSelect?.freeWeights) ? pi.equipmentSelect.freeWeights : [], machines: Array.isArray(pi.equipmentSelect?.machines) ? pi.equipmentSelect.machines : [], benchRack: Array.isArray(pi.equipmentSelect?.benchRack) ? pi.equipmentSelect.benchRack : [], cardio: Array.isArray(pi.equipmentSelect?.cardio) ? pi.equipmentSelect.cardio : [] },
              workoutFrequency: pi.workoutFrequency || '', mainGoal: pi.mainGoal || '', workoutPriorities: Array.isArray(pi.workoutPriorities) ? pi.workoutPriorities : [],
              height: pi.height || '', currentWeight: pi.currentWeight || '', targetWeight: pi.targetWeight || '', hasInjuries: pi.hasInjuries || '',
              injuredAreas: Array.isArray(pi.injuredAreas) ? pi.injuredAreas : [], trainingExperience: pi.trainingExperience || '', wantsHomeGym: pi.wantsHomeGym || '',
              roomSpecs: { width: pi.roomSpecs?.width || '', height: pi.roomSpecs?.height || '', depth: pi.roomSpecs?.depth || '' },
                };
                setPersonalInfo(pi_data);
                setOriginalPersonalInfo(pi_data); // **NEW** Save the original copy

                // --- 2. Process Training Plans Response ---
                if (!plansResponse.ok && plansResponse.status !== 404) {
                    throw new Error(`Plans fetch failed: ${plansResponse.statusText}`);
                }
                const plansData = plansResponse.status === 404 ? [] : await plansResponse.json();
                if (isMounted) setTrainingPlans(Array.isArray(plansData) ? plansData : []);

                // --- 3. Process All Exercises Response ---
                if (!exercisesResponse.ok) {
                    throw new Error(`Exercises fetch failed: ${exercisesResponse.statusText}`);
                }
                const exercisesData = await exercisesResponse.json();
                if (isMounted) {
                    const exercises = Array.isArray(exercisesData) ? exercisesData : [];
                    const formattedExercises = exercises.map(ex => ({...ex, id: ex.id || ex._id})).filter(ex => ex.id && ex.name);
                    setAllExercises(formattedExercises);
                    setAvailableExercises(formattedExercises);
                }

            } catch (err) {
                if (isMounted) setApiError(`Error loading data: ${err.message}`);
                console.error("Fetch data error:", err);
            } finally {
                if (isMounted) {
                    setIsLoadingData(false);
                    setIsLoadingExercises(false);
                }
            }
        };

        fetchAllData();
        return () => { isMounted = false; };

    }, [user, setUser, navigate]);


    // --- Update Available Exercises ---
    useEffect(() => {
        setAvailableExercises(
            allExercises.filter(ex => !currentPlanExercises.some(planEx => planEx.exerciseId === ex.id))
        );
    }, [currentPlanExercises, allExercises]);


    // --- Handlers ---
    const showSuccess = (message) => { setSuccessMessage(message); setTimeout(() => setSuccessMessage(''), 3000); };
    const handleAccountDetailsChange = (e) => { setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value }); };
    const handleAddressChange = (e) => { setAddress({ ...address, [e.target.name]: e.target.value }); };
    const handlePasswordChange = (e) => { setPasswordData({ ...passwordData, [e.target.name]: e.target.value }); };

    // --- Corrected Personal Info Change Handler ---
    const handlePersonalInfoChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPersonalInfo(prev => {
            if (type === 'checkbox' && !name.startsWith('equipmentSelect.')) {
                const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
                const newValues = checked ? [...currentValues, value] : currentValues.filter(item => item !== value);
                return { ...prev, [name]: newValues };
            }
            if (name.startsWith('equipmentSelect.')) {
                const group = name.split('.')[1];
                const equipment = value;
                const currentGroupValues = Array.isArray(prev.equipmentSelect[group]) ? prev.equipmentSelect[group] : [];
                const newGroupValues = checked ? [...currentGroupValues, equipment] : currentGroupValues.filter(item => item !== equipment);
                return { ...prev, equipmentSelect: { ...prev.equipmentSelect, [group]: newGroupValues } };
            }
            if (name.startsWith('roomSpecs.')) {
                const spec = name.split('.')[1];
                return { ...prev, roomSpecs: { ...prev.roomSpecs, [spec]: value } };
            }
            if (type !== 'checkbox') { return { ...prev, [name]: value }; }
            return prev;
        });
    };

    // --- Training Plan Handlers (Unchanged) ---
    const handleStartCreatePlan = () => {
        const manualPlans = trainingPlans.filter(p => !p.isAIPlan);
        if (manualPlans.length >= 2) { setApiError("Max 2 manual plans allowed."); setTimeout(() => setApiError(''), 3000); return; }
        setCurrentPlanName(`My Plan ${manualPlans.length + 1}`);
        setCurrentPlanExercises([]);
        setAvailableExercises(allExercises);
        setSelectedPlan(null);
        setViewMode('create');
        setActiveSection('trainingPlans');
    };

    const handleCancelCreateOrEdit = () => {
        setViewMode('list');
        setSelectedPlan(null);
        setCurrentPlanExercises([]);
        setCurrentPlanName('');
        setApiError('');
    };

    const handleAddExercise = (exerciseToAdd) => {
        if (!exerciseToAdd.id || !exerciseToAdd.name) { console.error("Exercise missing ID or Name:", exerciseToAdd); setApiError("Cannot add exercise: invalid data."); setTimeout(() => setApiError(''), 3000); return; }
        const exerciseWithDetails = { exerciseId: exerciseToAdd.id, name: exerciseToAdd.name, reps: '', time: '', category: exerciseToAdd.category || 'Unknown' };
        if (!currentPlanExercises.some(ex => ex.exerciseId === exerciseWithDetails.exerciseId)) { setCurrentPlanExercises(prev => [...prev, exerciseWithDetails]); }
    };

    const handleRemoveExercise = (exerciseToRemove) => {
        setCurrentPlanExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseToRemove.exerciseId));
    };

    const handleRepTimeChange = (exerciseId, field, value) => { setCurrentPlanExercises(prev => prev.map(ex => ex.exerciseId === exerciseId ? { ...ex, [field]: value } : ex )); };

    const handleSavePlan = async () => {
        if (!user?.token) return;
        if (currentPlanExercises.length === 0) { setApiError("Add at least one exercise."); setTimeout(() => setApiError(''), 3000); return; }
        setApiError(''); setIsSavingPlan(true);
        const planDataToSend = {
            planName: currentPlanName || 'My Training Plan',
            isAIPlan: false,
            exercises: currentPlanExercises.map(ex => ({
                exerciseId: ex.exerciseId,
                name: ex.name,
                reps: ex.reps,
                time: ex.time
            }))
        };
        try {
            const response = await fetch(`${PLAN_API_BASE_URL}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }, body: JSON.stringify(planDataToSend) });
            const savedPlan = await response.json();
            if (!response.ok) { if (response.status === 401 || response.status === 403) {setUser(null); navigate('/login');} throw new Error(savedPlan.msg || `Save failed: ${response.statusText}`); }
            setTrainingPlans(prev => [...prev, savedPlan]);
            setViewMode('list');
            setCurrentPlanExercises([]); setCurrentPlanName('');
            showSuccess('Plan saved!');
        } catch (err) { setApiError(`Error saving plan: ${err.message}`); console.error("Save plan error:", err); }
        finally { setIsSavingPlan(false); }
    };

    const handleViewPlan = (planToView) => {
        setSelectedPlan(planToView);
        setViewMode('view');
        setActiveSection('trainingPlans');
    };

    const handleEditPlan = (planToEdit) => {
        setSelectedPlan(planToEdit);
        setCurrentPlanName(planToEdit.planName || '');
        const editableExercises = planToEdit.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            name: ex.name || 'Unknown Exercise',
            reps: ex.reps || '',
            time: ex.time || '',
        }));
        setCurrentPlanExercises(editableExercises);
        setAvailableExercises(allExercises.filter(ex => !editableExercises.some(pEx => pEx.exerciseId === ex.id)));
        setViewMode('edit');
        setActiveSection('trainingPlans');
    };

    const handleUpdatePlan = async () => {
        if (!user?.token || !selectedPlan?._id) return;
        if (currentPlanExercises.length === 0) { setApiError("Add at least one exercise."); setTimeout(() => setApiError(''), 3000); return; }
        setApiError(''); setIsSavingPlan(true);
        const planDataToSend = {
            planName: currentPlanName || selectedPlan.planName,
            isAIPlan: selectedPlan.isAIPlan,
            exercises: currentPlanExercises.map(ex => ({
                exerciseId: ex.exerciseId, name: ex.name, reps: ex.reps, time: ex.time
            }))
        };
        try {
            const response = await fetch(`${PLAN_API_BASE_URL}/${selectedPlan._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(planDataToSend),
            });
            const updatedPlan = await response.json();
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {setUser(null); navigate('/login');}
                throw new Error(updatedPlan.msg || `Update failed: ${response.statusText}`);
            }
            setTrainingPlans(prev => prev.map(p => p._id === updatedPlan._id ? updatedPlan : p));
            setViewMode('list');
            setSelectedPlan(null); setCurrentPlanExercises([]); setCurrentPlanName('');
            showSuccess('Plan updated successfully!');
        } catch (err) {
            setApiError(`Error updating plan: ${err.message}`); console.error("Update plan error:", err);
        } finally {
            setIsSavingPlan(false);
        }
    };

    const handleDeletePlan = async (planToDelete) => {
        if (!window.confirm(`Are you sure you want to delete "${planToDelete.planName || 'this plan'}"?`)) {
            return;
        }
        if (!user?.token || !planToDelete?._id) return;
        setApiError('');
        setIsLoadingData(true);
        try {
            const response = await fetch(`${PLAN_API_BASE_URL}/${planToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {setUser(null); navigate('/login'); return;}
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.msg || `Delete failed: ${response.statusText}`);
            }
            setTrainingPlans(prev => prev.filter(p => p._id !== planToDelete._id));
            showSuccess('Plan deleted successfully!');
            if (selectedPlan?._id === planToDelete._id) {
                setViewMode('list');
                setSelectedPlan(null);
            }
        } catch (err) {
            setApiError(`Error deleting plan: ${err.message}`); console.error("Delete plan error:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleAICreatePlan = () => { alert("AI Plan generation coming soon!"); };
    // --- END Training Plan Handlers ---


    // --- API Submission Handlers (Account, Address, Password) ---
    const handleDetailsSubmit = async (e) => {
        e.preventDefault(); if (!user?.token) return; setApiError('');
        try {
            const response = await fetch(`${USER_API_BASE_URL}/profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }, body: JSON.stringify({ first_name: accountDetails.first_name, last_name: accountDetails.last_name, phone_number: accountDetails.phone_number, shipping_address: address }) });
            const data = await response.json();
            if (!response.ok) { if (response.status === 401 || response.status === 403) {setUser(null); navigate('/login');} throw new Error(data.msg || `HTTP error! ${response.status}`); }
            setAccountDetails({ first_name: data.first_name || '', last_name: data.last_name || '', phone_number: data.phone_number || '' });
            setAddress(data.shipping_address || { street: '', city: '', zip_code: '' }); showSuccess('Details updated!');
        } catch (err) { setApiError(`Update error: ${err.message}`); console.error("Update details error:", err); }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault(); if (!user?.token) return; setApiError('');
        try {
            const response = await fetch(`${USER_API_BASE_URL}/profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }, body: JSON.stringify({ first_name: accountDetails.first_name, last_name: accountDetails.last_name, phone_number: accountDetails.phone_number, shipping_address: address }) });
            const data = await response.json();
            if (!response.ok) { if (response.status === 401 || response.status === 403) {setUser(null); navigate('/login');} throw new Error(data.msg || `HTTP error! ${response.status}`); }
            setAddress(data.shipping_address || { street: '', city: '', zip_code: '' });
            setAccountDetails({ first_name: data.first_name || '', last_name: data.last_name || '', phone_number: data.phone_number || '' }); showSuccess('Address updated!');
        } catch (err) { setApiError(`Update error: ${err.message}`); console.error("Update address error:", err); }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault(); setApiError('');
        if (passwordData.newPassword !== passwordData.confirmNewPassword) { setApiError('Passwords do not match!'); return; }
        if (passwordData.newPassword.length < 8) { setApiError('Password must be at least 8 characters!'); return; }
        if (!user?.token) { setApiError('Not logged in.'); return; }
        try {
            const response = await fetch(`${USER_API_BASE_URL}/change-password`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }, body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }) });
            const data = await response.json();
            if (!response.ok) { if (response.status === 401 || response.status === 403) {setUser(null); navigate('/login');} throw new Error(data.msg || `HTTP error! ${response.status}`); }
            showSuccess('Password updated!'); setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) { setApiError(`Update error: ${err.message}`); console.error("Update password error:", err); }
    };

    // --- **MODIFIED** Personal Info Submit ---
    const handlePersonalInfoSubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        setApiError('');
        const dataToSend = {
            ...personalInfo,
            height: personalInfo.height ? Number(personalInfo.height) : null,
            currentWeight: personalInfo.currentWeight ? Number(personalInfo.currentWeight) : null,
            targetWeight: personalInfo.targetWeight ? Number(personalInfo.targetWeight) : null,
            workoutFrequency: personalInfo.workoutFrequency ? Number(personalInfo.workoutFrequency) : null,
            roomSpecs: {
                width: personalInfo.roomSpecs.width ? Number(personalInfo.roomSpecs.width) : null,
                height: personalInfo.roomSpecs.height ? Number(personalInfo.roomSpecs.height) : null,
                depth: personalInfo.roomSpecs.depth ? Number(personalInfo.roomSpecs.depth) : null,
            }
        };

        try {
            const response = await fetch(`${USER_API_BASE_URL}/profile/personal`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(dataToSend)
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setUser(null); navigate('/login');
                }
                throw new Error(data.msg || `HTTP error! ${response.status}`);
            }

            if (data) {
                // **MODIFIED** Update both states
                const pi_data = {
                    gender: data.gender || '',
                    equipmentUse: Array.isArray(data.equipmentUse) ? data.equipmentUse : [],
                    equipmentSelect: { freeWeights: Array.isArray(data.equipmentSelect?.freeWeights) ? data.equipmentSelect.freeWeights : [], machines: Array.isArray(data.equipmentSelect?.machines) ? data.equipmentSelect.machines : [], benchRack: Array.isArray(data.equipmentSelect?.benchRack) ? data.equipmentSelect.benchRack : [], cardio: Array.isArray(data.equipmentSelect?.cardio) ? data.equipmentSelect.cardio : [] },
                    workoutFrequency: data.workoutFrequency || '',
                    mainGoal: data.mainGoal || '',
                    workoutPriorities: Array.isArray(data.workoutPriorities) ? data.workoutPriorities : [],
                    height: data.height || '',
                    currentWeight: data.currentWeight || '',
                    targetWeight: data.targetWeight || '',
                    hasInjuries: data.hasInjuries || '',
                    injuredAreas: Array.isArray(data.injuredAreas) ? data.injuredAreas : [],
                    trainingExperience: data.trainingExperience || '',
                    wantsHomeGym: data.wantsHomeGym || '',
                    roomSpecs: { width: data.roomSpecs?.width || '', height: data.roomSpecs?.height || '', depth: data.roomSpecs?.depth || '' }
                };
                setPersonalInfo(pi_data);
                setOriginalPersonalInfo(pi_data); // **NEW** Set new original data
            }
            showSuccess('Personal info saved!');
            setIsEditingPersonalInfo(false); // **NEW** Exit edit mode
        } catch (err) {
            setApiError(`Save error: ${err.message}`);
            console.error("Save personal info error:", err);
        }
    };

    // --- **NEW** Handle Cancel Edit for Personal Info ---
    const handleCancelPersonalInfoEdit = () => {
        setPersonalInfo(originalPersonalInfo); // Revert to original data
        setIsEditingPersonalInfo(false); // Exit edit mode
        setApiError(''); // Clear errors
    };


    // Get user initials
    const getInitials = () => {
        const first = accountDetails.first_name || '';
        const last = accountDetails.last_name || '';
        return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || (user?.email ? user.email[0].toUpperCase() : '?');
    };


    // --- Render Section Logic ---
    const renderSection = () => {
        if (isLoadingData && activeSection !== 'trainingPlans') {
            return <div className="profile-section"><p>Loading...</p></div>;
        }

        switch (activeSection) {
            case 'details':
                // (This section is unchanged, user didn't ask to modify it)
                return (
                    <div className="profile-section">
                    <div className="section-header"><h3>Account Details</h3><p>Manage personal info.</p></div>
                    {apiError && <div className="error-message">{apiError}</div>}
                    <form className="profile-form" onSubmit={handleDetailsSubmit}>
                    <div className="form-row">
                    <div className="form-group"><label htmlFor="first_name">First Name</label><input type="text" id="first_name" name="first_name" value={accountDetails.first_name} onChange={handleAccountDetailsChange} /></div>
                    <div className="form-group"><label htmlFor="last_name">Last Name</label><input type="text" id="last_name" name="last_name" value={accountDetails.last_name} onChange={handleAccountDetailsChange} /></div>
                    </div>
                    <div className="form-group"><label>Email</label><input type="email" value={user?.email || ''} readOnly disabled /><small className="form-hint">Email cannot be changed</small></div>
                    <div className="form-group"><label htmlFor="phone_number">Phone</label><input type="tel" id="phone_number" name="phone_number" value={accountDetails.phone_number} onChange={handleAccountDetailsChange} /></div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                    </div>
                );
            case 'personalInfo':
                // **MODIFIED** This is the section you asked to change
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>Personal Information</h3>
                    <p>Help us tailor experience.</p>
                    {/* --- NEW EDIT BUTTON --- */}
                    {!isEditingPersonalInfo && (
                        <button className="btn btn-edit" onClick={() => setIsEditingPersonalInfo(true)}>
                        <EditIcon /> Edit
                        </button>
                    )}
                    </div>
                    {apiError && <div className="error-message">{apiError}</div>}

                    <form className="profile-form personal-info-form" onSubmit={handlePersonalInfoSubmit}>
                    {/* --- NEW FIELDSET: Disables form when not editing --- */}
                    <fieldset disabled={!isEditingPersonalInfo}>
                    {/* --- Q1: Gender --- */}
                    <div className="form-group"><label>Gender</label><div className="radio-group"><label><input type="radio" name="gender" value="male" checked={personalInfo.gender === 'male'} onChange={handlePersonalInfoChange} /> Male</label><label><input type="radio" name="gender" value="female" checked={personalInfo.gender === 'female'} onChange={handlePersonalInfoChange} /> Female</label></div></div>
                    {/* --- Q2: Equipment Use --- */}
                    <div className="form-group"><label>Equipment you use?</label><div className="checkbox-group-columns">{equipmentUseOptions.map(o => (<label key={o}><input type="checkbox" name="equipmentUse" value={o} checked={personalInfo.equipmentUse.includes(o)} onChange={handlePersonalInfoChange}/> {o}</label>))}</div></div>
                    {/* --- Q3: Select Equipment (Conditional) --- */}
                    {(personalInfo.equipmentUse.includes("GYM") || personalInfo.equipmentUse.includes("HOME GYM")) && (<div className="form-group equipment-selection"><label>Select Available Equipment</label>
                        <div className="equipment-subgroup"><h4>Free Weights</h4><div className="checkbox-group-columns">{freeWeightOptions.map(o => (<label key={o}><input type="checkbox" name="equipmentSelect.freeWeights" value={o} checked={personalInfo.equipmentSelect.freeWeights.includes(o)} onChange={handlePersonalInfoChange} /> {o}</label>))}</div></div>
                        <div className="equipment-subgroup">{/*<h4>Benches & Racks</h4>*/}<div className="checkbox-group-columns">{benchRackOptions.map(o => (<label key={o}><input type="checkbox" name="equipmentSelect.benchRack" value={o} checked={personalInfo.equipmentSelect.benchRack.includes(o)} onChange={handlePersonalInfoChange} /> {o}</label>))}</div></div>
                        <div className="equipment-subgroup">{/*<h4>Cardio</h4>*/}<div className="checkbox-group-columns">{cardioOptions.map(o => (<label key={o}><input type="checkbox" name="equipmentSelect.cardio" value={o} checked={personalInfo.equipmentSelect.cardio.includes(o)} onChange={handlePersonalInfoChange} /> {o}</label>))}</div></div>
                        <div className="equipment-subgroup"><h4>Machines</h4><div className="checkbox-group-columns checkbox-group-scroll">{machineOptions.map(o => (<label key={o}><input type="checkbox" name="equipmentSelect.machines" value={o} checked={personalInfo.equipmentSelect.machines.includes(o)} onChange={handlePersonalInfoChange} /> {o}</label>))}</div></div>
                        </div>)}
                        {/* --- Q4: Frequency --- */}
                        <div className="form-group"><label htmlFor="workoutFrequency">Workouts/week?</label><select id="workoutFrequency" name="workoutFrequency" value={personalInfo.workoutFrequency} onChange={handlePersonalInfoChange}><option value="">Select...</option>{workoutFrequencyOptions.map(n => <option key={n} value={n}>{n} times</option>)}</select></div>
                        {/* --- Q5: Main Goal --- */}
                        <div className="form-group"><label>Main goal?</label><select name="mainGoal" value={personalInfo.mainGoal} onChange={handlePersonalInfoChange}><option value="">Select...</option>{mainGoalOptions.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                        {/* --- Q6: Priorities --- */}
                        <div className="form-group"><label>Priorities? (Select multiple)</label><div className="checkbox-group-columns checkbox-group-scroll">{workoutPrioritiesOptions.map(p => (<label key={p}><input type="checkbox" name="workoutPriorities" value={p} checked={personalInfo.workoutPriorities.includes(p)} onChange={handlePersonalInfoChange} /> {p}</label>))}</div></div>
                        {/* --- Q7,8,9: Body --- */}
                        <div className="form-row"><div className="form-group"><label htmlFor="height">Height (cm)</label><input type="number" id="height" name="height" value={personalInfo.height} onChange={handlePersonalInfoChange}/></div><div className="form-group"><label htmlFor="currentWeight">Current Wt (kg)</label><input type="number" id="currentWeight" name="currentWeight" value={personalInfo.currentWeight} onChange={handlePersonalInfoChange}/></div></div>
                        <div className="form-group"><label htmlFor="targetWeight">Target Wt (kg)</label><input type="number" id="targetWeight" name="targetWeight" value={personalInfo.targetWeight} onChange={handlePersonalInfoChange}/></div>
                        {/* --- Q10: Injuries --- */}
                        <div className="form-group"><label>Injuries?</label><div className="radio-group"><label><input type="radio" name="hasInjuries" value="yes" checked={personalInfo.hasInjuries === 'yes'} onChange={handlePersonalInfoChange} /> Yes</label><label><input type="radio" name="hasInjuries" value="no" checked={personalInfo.hasInjuries === 'no'} onChange={handlePersonalInfoChange} /> No</label></div></div>
                        {personalInfo.hasInjuries === 'yes' && (<div className="form-group"><label>Injured areas:</label><div className="checkbox-group-columns">{injuryAreasOptions.map(a => (<label key={a}><input type="checkbox" name="injuredAreas" value={a} checked={personalInfo.injuredAreas.includes(a)} onChange={handlePersonalInfoChange} /> {a}</label>))}</div></div>)}
                        {/* --- Q11: Experience --- */}
                        <div className="form-group"><label>Training experience?</label><select name="trainingExperience" value={personalInfo.trainingExperience} onChange={handlePersonalInfoChange}><option value="">Select...</option>{trainingExperienceOptions.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
                        {/* --- Q12: Home Gym --- */}
                        <div className="form-group"><label>Need home gym setup?</label><div className="radio-group"><label><input type="radio" name="wantsHomeGym" value="yes" checked={personalInfo.wantsHomeGym === 'yes'} onChange={handlePersonalInfoChange} /> Yes</label><label><input type="radio" name="wantsHomeGym" value="no" checked={personalInfo.wantsHomeGym === 'no'} onChange={handlePersonalInfoChange} /> No</label></div></div>
                        {/* --- Q13: Room Specs --- */}
                        {personalInfo.wantsHomeGym === 'yes' && (<div className="form-group"><label>Room Specs (m)</label><div className="form-row"><div className="form-group"><input type="number" name="roomSpecs.width" value={personalInfo.roomSpecs.width} onChange={handlePersonalInfoChange} placeholder="Width"/></div><div className="form-group"><input type="number" name="roomSpecs.height" value={personalInfo.roomSpecs.height} onChange={handlePersonalInfoChange} placeholder="Height"/></div></div><div className="form-group" style={{marginTop:'1rem'}}><input type="number" name="roomSpecs.depth" value={personalInfo.roomSpecs.depth} onChange={handlePersonalInfoChange} placeholder="Depth"/></div></div>)}
                        </fieldset>

                        {/* --- NEW CONDITIONAL BUTTONS --- */}
                        {isEditingPersonalInfo && (
                            <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancelPersonalInfoEdit}>
                            Cancel
                            </button>
                            </div>
                        )}
                        </form>
                        </div>
                );

                // --- REVISED Training Plans Case with View/Edit Modes ---
                case 'trainingPlans':
                    // VIEW MODE
                    if (viewMode === 'view' && selectedPlan) {
                        return (
                            <div className="profile-section">
                            <div className="section-header">
                            <h3>{selectedPlan.planName || 'Training Plan'}</h3>
                            <button onClick={() => setViewMode('list')} className="btn btn-sm btn-secondary back-to-list-btn">
                            &larr; Back to Plans
                            </button>
                            </div>
                            {selectedPlan.exercises && selectedPlan.exercises.length > 0 ? (
                                <ul className="view-plan-list">
                                {selectedPlan.exercises.map((ex, index) => (
                                    <li key={ex.exerciseId || index} className="view-plan-item">
                                    <strong>{ex.name || 'Unknown Exercise'}</strong>
                                    <span>{ex.reps && `Reps: ${ex.reps}`}{ex.reps && ex.time && ' / '}{ex.time && `Time: ${ex.time}`}</span>
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p>This plan has no exercises.</p>
                            )}
                            <div className="plan-actions" style={{marginTop: '1.5rem'}}>
                            <button onClick={() => handleEditPlan(selectedPlan)} className="btn btn-edit">
                            <EditIcon /> Edit
                            </button>
                            <button onClick={() => handleDeletePlan(selectedPlan)} className="btn btn-delete">
                            <TrashIcon /> Delete
                            </button>
                            </div>
                            </div>
                        );
                    }

                    // CREATE OR EDIT MODE
                    if (viewMode === 'create' || (viewMode === 'edit' && selectedPlan)) {
                        const isEditing = viewMode === 'edit';
                        return (
                            <div className="profile-section training-plan-creator">
                            <div className="section-header">
                            <h3>{isEditing ? 'Edit Training Plan' : 'Create New Training Plan'}</h3>
                            <div className="form-group plan-name-input">
                            <label htmlFor="planName">Plan Name:</label>
                            <input type="text" id="planName" value={currentPlanName} onChange={(e) => setCurrentPlanName(e.target.value)} placeholder="e.g., My Strength Routine" />
                            </div>
                            </div>
                            {apiError && <div className="error-message">{apiError}</div>}
                            <div className="creator-layout">
                            {/* Left Side: Current Plan */}
                            <div className="current-plan-section">
                            <h4>Plan Exercises ({currentPlanExercises.length})</h4>
                            {currentPlanExercises.length === 0 ? (<p className="empty-plan-text">Add exercises...</p>) : (
                                <ul className="current-plan-list">
                                {currentPlanExercises.map(ex => (
                                    <li key={ex.exerciseId} className="current-plan-item">
                                    <div className="exercise-info">
                                    <strong>{ex.name}</strong>
                                    <div className="reps-time-inputs">
                                    <input type="text" placeholder="Reps" value={ex.reps} onChange={(e) => handleRepTimeChange(ex.exerciseId, 'reps', e.target.value)} />
                                    <span>or</span>
                                    <input type="text" placeholder="Time" value={ex.time} onChange={(e) => handleRepTimeChange(ex.exerciseId, 'time', e.target.value)} />
                                    </div>
                                    </div>
                                    <button onClick={() => handleRemoveExercise(ex)} className="action-button remove-button" title="Remove"><MinusCircleIcon /></button>
                                    </li>
                                ))}
                                </ul>
                            )}
                            <div className="plan-actions">
                            <button onClick={isEditing ? handleUpdatePlan : handleSavePlan} className="btn btn-primary" disabled={isSavingPlan || currentPlanExercises.length === 0}>
                            {isSavingPlan ? 'Saving...' : (isEditing ? 'Update Plan' : 'Save Plan')}
                            </button>
                            <button onClick={handleCancelCreateOrEdit} className="btn btn-secondary"> Cancel </button>
                            </div>
                            </div>
                            {/* Right Side: Available Exercises */}
                            <div className="available-exercises-section">
                            <h4>Available Exercises ({availableExercises.length})</h4>
                            {isLoadingExercises ? <p>Loading exercises...</p> : (
                                <ul className="available-exercises-list">
                                {availableExercises.sort((a, b) => a.name.localeCompare(b.name)).map(ex => (
                                    <li key={ex.id} className="available-exercise-item">
                                    <span>{ex.name}</span>
                                    <button onClick={() => handleAddExercise(ex)} className="action-button add-button" title="Add"><PlusCircleIcon /></button>
                                    </li>
                                ))}
                                {availableExercises.length === 0 && currentPlanExercises.length > 0 && <p>All exercises added.</p>}
                                {allExercises.length === 0 && !isLoadingExercises && <p>Could not load exercises.</p>}
                                </ul>
                            )}
                            </div>
                            </div>
                            </div>
                        );
                    }
                    // LIST MODE (Default)
                    else {
                        const manualPlans = trainingPlans.filter(p => !p.isAIPlan);
                        const aiPlan = trainingPlans.find(p => p.isAIPlan);
                        return (
                            <div className="profile-section">
                            <div className="section-header"><h3>Training Plans</h3><p>Manage your plans.</p></div>
                            {apiError && <div className="error-message">{apiError}</div>}
                            {isLoadingData && <p>Loading plans...</p>}
                            {!isLoadingData && trainingPlans.length === 0 && (
                                <div className="no-plans-prompt">
                                <p>No plans saved yet.</p><p>Create one or use AI?</p>
                                <div className="creation-options">
                                <button onClick={handleStartCreatePlan} className="btn-icon-large" title="Create New"><PlusCircleIcon /> Create Manually</button>
                                <button onClick={handleAICreatePlan} className="btn-icon-large" title="Generate AI Plan"><BotIcon /> Generate with AI</button>
                                </div>
                                </div>
                            )}
                            {!isLoadingData && trainingPlans.length > 0 && (
                                <div className="plans-list">
                                {manualPlans.length > 0 && <h4>Your Plans ({manualPlans.length}/2)</h4>}
                                {manualPlans.map(plan => (
                                    <div key={plan._id} className="plan-card">
                                    <h5>{plan.planName || 'Unnamed Plan'} ({plan.exercises?.length || 0} exercises)</h5>
                                    <div className="plan-card-actions">
                                    <button className="btn-sm btn-secondary" onClick={() => handleViewPlan(plan)} title="View"><EyeIcon/></button>
                                    <button className="btn-sm btn-edit" onClick={() => handleEditPlan(plan)} title="Edit"><EditIcon/></button>
                                    <button className="btn-sm btn-delete" onClick={() => handleDeletePlan(plan)} title="Delete"><TrashIcon/></button>
                                    </div>
                                    </div>
                                ))}
                                {manualPlans.length < 2 && (
                                    <button onClick={handleStartCreatePlan} className="btn btn-outline-primary add-plan-button"><PlusCircleIcon /> Create New Plan</button>
                                )}
                                {aiPlan && (
                                    <>
                                    <h4 style={{marginTop: '2rem'}}>AI Generated Plan</h4>
                                    <div key={aiPlan._id} className="plan-card ai-plan-card">
                                    <h5>{aiPlan.planName || 'AI Plan'} ({aiPlan.exercises?.length || 0} exercises)</h5>
                                    <button className="btn-sm btn-secondary" onClick={() => handleViewPlan(aiPlan)} title="View"><EyeIcon/></button>
                                    </div>
                                    </>
                                )}
                                {!aiPlan && (
                                    <button onClick={handleAICreatePlan} className="btn btn-outline-secondary add-plan-button ai-button"><BotIcon /> Generate AI Plan</button>
                                )}
                                </div>
                            )}
                            </div>
                        );
                    }
                    // --- END Training Plans Case ---
                    case 'trainingLog':
                        return <TrainingLog user={user} allExercises={allExercises} />;
                    case 'progress':
                        return <ProgressAnalytics user={user} allExercises={allExercises} />;
                    case 'diet':
                        return (
                            <>
                            <DietAnalysisForm user={user} personalInfo={personalInfo} />
                            <hr className="section-divider" />
                            <DietTracker user={user} personalInfo={personalInfo} />
                            </>
                        );
                    case 'orders': return ( <div className="profile-section"><div className="section-header"><h3>Order History</h3><p>Your past purchases.</p></div>{orders.length === 0 ? <p>No orders yet.</p> : <div>Display orders...</div>}</div> );
                    case 'wishlist': return ( <div className="profile-section"><div className="section-header"><h3>My Wishlist</h3><p>Your saved items.</p></div>{wishlist.length === 0 ? <p>Wishlist is empty.</p> : <div>Display wishlist...</div>}</div> );
                    case 'shipping':
                        return (
                            <div className="profile-section">
                            <div className="section-header"><h3>Shipping Address</h3><p>Manage delivery info.</p></div>
                            {apiError && <div className="error-message">{apiError}</div>}
                            <form className="profile-form" onSubmit={handleAddressSubmit}>
                            <div className="form-group"><label htmlFor="street">Street</label><input type="text" id="street" name="street" value={address.street} onChange={handleAddressChange} required /></div>
                            <div className="form-row"><div className="form-group"><label htmlFor="city">City</label><input type="text" id="city" name="city" value={address.city} onChange={handleAddressChange} required /></div><div className="form-group"><label htmlFor="zip_code">ZIP</label><input type="text" id="zip_code" name="zip_code" value={address.zip_code} onChange={handleAddressChange} required /></div></div>
                            <button type="submit" className="btn btn-primary">Update Address</button>
                            </form>
                            </div>
                        );
                    case 'security':
                        return (
                            <div className="profile-section">
                            <div className="section-header"><h3>Security</h3><p>Change your password.</p></div>
                            {apiError && <div className="error-message">{apiError}</div>}
                            <form className="profile-form" onSubmit={handlePasswordSubmit}>
                            <div className="form-group"><label htmlFor="currentPassword">Current Password</label><input type="password" id="currentPassword" name="currentPassword" placeholder="••••••••" value={passwordData.currentPassword} onChange={handlePasswordChange} required /></div>
                            <div className="form-group"><label htmlFor="newPassword">New Password</label><input type="password" id="newPassword" name="newPassword" placeholder="••••••••" value={passwordData.newPassword} onChange={handlePasswordChange} required /><small className="form-hint">Min. 8 characters</small></div>
                            <div className="form-group"><label htmlFor="confirmNewPassword">Confirm New Password</label><input type="password" id="confirmNewPassword" name="confirmNewPassword" placeholder="••••••••" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required /></div>
                            <button type="submit" className="btn btn-primary">Update Password</button>
                            </form>
                            </div>
                        );
                    default: return null;
        }
    };

    // Main Loading State or if user becomes null
    if (isLoadingData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '60px' }}>
            Loading your profile...
            </div>
        );
    }

    if (!user) {
        useEffect(() => { navigate('/login'); }, [navigate]);
        return null; // Don't render anything while redirecting
    }

    return (
        <>
        {/* --- Simple Navbar --- */}
        <header className="simple-profile-header">
        <nav className="simple-profile-nav container">
        <Link to="/" className="simple-profile-logo">Fitsetup<span>.</span></Link>
        </nav>
        </header>

        <div className="profile-container">
        {successMessage && (
            <div className="success-toast">
            <CheckCircleIcon /> <span>{successMessage}</span>
            </div>
        )}
        <div className="profile-sidebar">
        <div className="profile-user">
        <div className="profile-avatar">{getInitials()}</div>
        <h4>{accountDetails.first_name || 'User'} {accountDetails.last_name}</h4>
        <p>{user?.email}</p>
        </div>
        <nav className="profile-nav">
        <a className={activeSection === 'details' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('details'); }}><UserIcon /> <span>Account Details</span></a>
        <a className={activeSection === 'personalInfo' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('personalInfo'); }}><ClipboardIcon /> <span>Personal Info</span></a>
        <a className={activeSection === 'trainingPlans' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('trainingPlans'); }}><DumbbellIcon/> <span>Training Plans</span></a>
        <a className={activeSection === 'trainingLog' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('trainingLog'); }}><ListIcon/> <span>Training Log</span></a>
        <a className={activeSection === 'progress' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('progress'); }}><BarChart2Icon/> <span>Progress</span></a>
        <a className={activeSection === 'diet' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('diet'); }}><ActivityIcon/> <span>Diet & Nutrition</span></a>
        <a className={activeSection === 'orders' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('orders'); }}><PackageIcon/> <span>Order History</span></a>
        <a className={activeSection === 'wishlist' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('wishlist'); }}><HeartIcon/> <span>My Wishlist</span></a>
        <a className={activeSection === 'shipping' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('shipping'); }}><TruckIcon/> <span>Shipping</span></a>
        <a className={activeSection === 'security' ? 'active' : ''} onClick={() => { setViewMode('list'); setActiveSection('security'); }}><ShieldIcon/> <span>Security</span></a>
        </nav>
        </div>

        <div className="profile-content">
        {renderSection()}
        </div>
        </div>
        </>
    );
}
