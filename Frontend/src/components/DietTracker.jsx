import React, { useState, useEffect } from 'react';
import './DietTracker.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons

export default function DietTracker({ user, personalInfo }) {
    const [dietLogs, setDietLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // **NEW** For success messages
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
    const [entryCalories, setEntryCalories] = useState('');
    const [editingLogId, setEditingLogId] = useState(null); // **NEW** To track editing state

    const API_URL = 'http://localhost:5000/api/dietlog'; // Your backend URL

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
                    const data = await response.json();
                    throw new Error(data.msg || `Failed to fetch diet logs: ${response.statusText}`);
                }
            } catch (err) {
                setError(err.message);
                setDietLogs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDietLogs();
    }, [user]);

    // --- **NEW** Clear Form ---
    const clearForm = () => {
        setEntryDate(new Date().toISOString().split('T')[0]);
        setEntryCalories('');
        setEditingLogId(null);
        setError('');
        setSuccess('');
    };

    // --- Handle Calorie Entry Submission (NOW HANDLES ADD + UPDATE) ---
    const handleAddEntry = async (e) => {
        e.preventDefault();
        if (!entryDate || !entryCalories || isNaN(entryCalories) || entryCalories <= 0) {
            setError('Please enter a valid date and positive calorie amount.');
            return;
        }
        setError('');
        setSuccess('');

        const newEntry = { date: entryDate, calories: Number(entryCalories) };

        try {
            // Your backend POST route handles upsert (create/update)
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

            // **UPDATED** Set success message based on editing state
            setSuccess(editingLogId ? 'Entry updated successfully!' : 'Entry added successfully!');

            // **UPDATED** Refresh local state
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

            clearForm(); // Reset the form
        } catch (err) {
            setError(err.message);
        }
    };

    // --- **NEW** Handle Edit Button Click ---
    const handleEdit = (log) => {
        clearForm();
        setEditingLogId(log._id);
        setEntryDate(new Date(log.date).toISOString().split('T')[0]);
        setEntryCalories(log.calories);
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    // --- **NEW** Handle Delete Button Click ---
    const handleDelete = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) {
            return;
        }
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/${logId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to delete entry');
            }

            setSuccess('Entry deleted successfully!');
            // Refresh state by removing the deleted log
            setDietLogs(prevLogs => prevLogs.filter(log => log._id !== logId));
        } catch (err) {
            setError(err.message);
        }
    };

    // --- Calculations for Weekly/Monthly Totals (Unchanged) ---
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

        {/* **MODIFIED** Added success message */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* --- Weight Goal Display (Unchanged) --- */}
        <div className="weight-goals">
        <h4>Weight Goals</h4>
        <p>Current Weight: <strong>{personalInfo?.currentWeight || 'N/A'} kg</strong></p>
        <p>Target Weight: <strong>{personalInfo?.targetWeight || 'N/A'} kg</strong></p>
        </div>

        {/* --- Calorie Entry Form (MODIFIED) --- */}
        <form className="calorie-entry-form profile-form" onSubmit={handleAddEntry}>
        <h4>{editingLogId ? 'Edit Calorie Entry' : 'Add Calorie Entry'}</h4>
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
        {/* **MODIFIED** Added new buttons */}
        <div className="form-actions">
        <button type="submit" className="btn btn-secondary">
        {editingLogId ? 'Update Entry' : 'Add Entry'}
        </button>
        {editingLogId && (
            <button type="button" className="btn btn-cancel" onClick={clearForm}>
            Cancel
            </button>
        )}
        </div>
        </form>

        {/* --- Visualizations & Summary (Unchanged) --- */}
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

        {/* --- Detailed Log History (MODIFIED) --- */}
        <div className="diet-log-history">
        <h4>Calorie Log History</h4>
        {isLoading ? <p>Loading history...</p> : dietLogs.length === 0 ? (
            <p>No entries yet.</p>
        ) : (
            <ul className="log-history-list"> {/* **MODIFIED** Added class */}
            {dietLogs.map((log) => (
                <li key={log._id}>
                <div className="log-info"> {/* **MODIFIED** Wrapper */}
                <span>{new Date(log.date).toLocaleDateString()}</span>
                <span>{log.calories} kcal</span>
                </div>
                <div className="log-actions"> {/* **NEW** Wrapper */}
                <button className="btn-icon" title="Edit" onClick={() => handleEdit(log)}>
                <FaEdit />
                </button>
                <button className="btn-icon btn-delete" title="Delete" onClick={() => handleDelete(log._id)}>
                <FaTrashAlt />
                </button>
                </div>
                </li>
            ))}
            </ul>
        )}
        </div>
        </div>
    );
}
