import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProgressAnalytics.css'; // We will create this file

export default function ProgressAnalytics({ user, allExercises }) {
    const [prs, setPrs] = useState([]);
    const [strengthData, setStrengthData] = useState([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState(''); // Holds the ID
    const [isLoadingPRs, setIsLoadingPRs] = useState(true);
    const [isLoadingChart, setIsLoadingChart] = useState(false);
    const [error, setError] = useState('');

    const PR_API_URL = 'http://localhost:5000/api/progress/prs';
    const STRENGTH_API_URL = 'http://localhost:5000/api/progress/strength';

    // --- 1. Fetch Personal Records (PRs) on component mount ---
    useEffect(() => {
        const fetchPRs = async () => {
            if (!user?.token) return;
            setIsLoadingPRs(true);
            try {
                const response = await fetch(PR_API_URL, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.status === 404) {
                    setPrs([]);
                } else if (response.ok) {
                    const data = await response.json();
                    setPrs(data);
                } else {
                    throw new Error('Failed to fetch PRs');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoadingPRs(false);
            }
        };
        fetchPRs();
    }, [user]);

    // --- 2. Fetch Strength Data when an exercise is selected ---
    const handleExerciseSelect = async (e) => {
        const exerciseId = e.target.value;
        if (!exerciseId) {
            setStrengthData([]);
            setSelectedExerciseId('');
            return;
        }

        setSelectedExerciseId(exerciseId);
        setIsLoadingChart(true);
        setError('');

        try {
            const response = await fetch(`${STRENGTH_API_URL}/${exerciseId}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.status === 404) {
                setStrengthData([]);
            } else if (response.ok) {
                const data = await response.json();
                setStrengthData(data);
            } else {
                throw new Error('Failed to fetch chart data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingChart(false);
        }
    };

    return (
        <div className="profile-section progress-analytics-section">
        <div className="section-header">
        <h3>Progress & Analytics</h3>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* --- Personal Records Section --- */}
        <div className="progress-widget pr-widget">
        <h4>Personal Records (Max Weight)</h4>
        {isLoadingPRs ? (
            <p>Loading PRs...</p>
        ) : prs.length === 0 ? (
            <p>No PRs found. Go log some workouts!</p>
        ) : (
            <ul className="pr-list">
            {prs.map(pr => (
                <li key={pr.exerciseId}>
                <span>{pr.exerciseName}</span>
                <strong>{pr.maxWeight} kg</strong>
                </li>
            ))}
            </ul>
        )}
        </div>

        {/* --- Strength Progress Chart Section --- */}
        <div className="progress-widget chart-widget">
        <h4>Strength Progress (Max Weight Over Time)</h4>
        <div className="form-group">
        <label htmlFor="exercise-select">Select Exercise:</label>
        <select id="exercise-select" value={selectedExerciseId} onChange={handleExerciseSelect}>
        <option value="">Select an exercise...</option>
        {allExercises
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
            </select>
            </div>

            {isLoadingChart && <p>Loading chart data...</p>}

            {!isLoadingChart && strengthData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                <LineChart
                data={strengthData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="maxWeight" stroke="#8884d8" activeDot={{ r: 8 }} name="Max Weight (kg)" />
                </LineChart>
                </ResponsiveContainer>
            )}

            {!isLoadingChart && strengthData.length === 0 && selectedExerciseId && (
                <p>No weight-based logs found for this exercise.</p>
            )}
            </div>
            </div>
    );
}
