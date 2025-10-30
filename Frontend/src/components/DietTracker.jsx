// DietTracker.jsx
import React, { useState, useEffect } from 'react';
import './DietTracker.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DietTracker({ user, personalInfo }) {
    // ...
    const [dietLogs, setDietLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [entryCalories, setEntryCalories] = useState('');

    const API_URL = 'http://localhost:5000/api/dietlog'; // Your new backend URL

    // --- Fetch Diet Logs ---
    useEffect(() => {
        const fetchDietLogs = async () => {
            if (!user?.token) return;
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch(API_URL, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (response.status === 404) {
                    setDietLogs([]);
                } else if (response.ok) {
                    const data = await response.json();
                    setDietLogs(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                } else {
                    throw new Error(`Failed to fetch diet logs: ${response.statusText}`);
                }
            } catch (err) {
                setError(err.message);
                setDietLogs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDietLogs();
    }, [user]); // Removed API_URL from dependency array as it's constant

    // --- Handle Calorie Entry Submission ---
    const handleAddEntry = async (e) => {
        e.preventDefault();
        if (!entryDate || !entryCalories || isNaN(entryCalories) || entryCalories <= 0) {
            setError('Please enter a valid date and positive calorie amount.');
            return;
        }
        setError('');

        const newEntry = { date: entryDate, calories: Number(entryCalories) };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newEntry)
            });

            const savedLog = await response.json();
            if (!response.ok) {
                throw new Error(savedLog.msg || 'Failed to save entry');
            }

            setDietLogs(prevLogs => {
                const existingIndex = prevLogs.findIndex(log => new Date(log.date).toISOString().split('T')[0] === entryDate);
                let updatedLogs;
                if (existingIndex > -1) {
                    updatedLogs = [...prevLogs];
                    updatedLogs[existingIndex] = savedLog;
                } else {
                    updatedLogs = [...prevLogs, savedLog];
                }
                return updatedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            });

            setEntryDate(new Date().toISOString().split('T')[0]);
            setEntryCalories('');
        } catch (err) {
            setError(err.message);
        }
    };

    // --- Calculations for Weekly/Monthly Totals ---
    const calculateTotals = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let weeklyTotal = 0;
        let monthlyTotal = 0;

        dietLogs.forEach(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);

            if (logDate >= oneWeekAgo) {
                weeklyTotal += log.calories;
            }
            if (logDate >= startOfMonth) {
                monthlyTotal += log.calories;
            }
        });
        return { weeklyTotal, monthlyTotal };
    };

    const { weeklyTotal, monthlyTotal } = calculateTotals();

    return (
        <div className="profile-section diet-tracker">
        <div className="section-header">
        <h3>Diet Tracker</h3>
        <p>Monitor your daily calorie intake and progress towards your goals.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* --- Weight Goal Display --- */}
        <div className="weight-goals">
        <h4>Weight Goals</h4>
        <p>Current Weight: <strong>{personalInfo?.currentWeight || 'N/A'} kg</strong></p>
        <p>Target Weight: <strong>{personalInfo?.targetWeight || 'N/A'} kg</strong></p>
        </div>

        {/* --- Calorie Entry Form --- */}
        <form className="calorie-entry-form profile-form" onSubmit={handleAddEntry}>
        <h4>Add Calorie Entry</h4>
        <div className="form-row">
        <div className="form-group">
        <label htmlFor="entry-date">Date:</label>
        <input type="date" id="entry-date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
        </div>
        <div className="form-group">
        <label htmlFor="entry-calories">Calories:</label>
        <input type="number" id="entry-calories" value={entryCalories} onChange={(e) => setEntryCalories(e.target.value)} placeholder="e.g., 2000" required />
        </div>
        </div>
        <button type="submit" className="btn btn-secondary">Add Entry</button>
        </form>

        {/* --- Visualizations & Summary --- */}
        <div className="diet-summary">
        <h4>Summary</h4>
        <p>Total Calories (Last 7 Days): <strong>{weeklyTotal} kcal</strong></p>
        <p>Total Calories (This Month): <strong>{monthlyTotal} kcal</strong></p>

        <h5>Recent Daily Intake</h5>
        {isLoading ? <p>Loading chart...</p> : dietLogs.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dietLogs.slice(0, 7).sort((a, b) => new Date(a.date) - new Date(b.date))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#82ca9d" name="Calories" />
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <p>No calorie data to display yet.</p>
        )}
        </div>

        {/* --- Detailed Log History --- */}
        <div className="diet-log-history">
        <h4>Calorie Log History</h4>
        {isLoading ? <p>Loading history...</p> : dietLogs.length === 0 ? (
            <p>No entries yet.</p>
        ) : (
            <ul>
            {dietLogs.map((log) => (
                <li key={log._id || log.date}>
                <span>{new Date(log.date).toLocaleDateString()}</span>
                <span>{log.calories} kcal</span>
                </li>
            ))}
            </ul>
        )}
        </div>
        </div>
    );
}
