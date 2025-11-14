import React, { useState, useEffect } from 'react';
import './TrainingLog.css';
// **NEW: Import icons for Edit, Delete, and Remove**
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';

// --- Helper Icons (from your file) ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function TrainingLog({ user, allExercises }) {
    const [pastWorkouts, setPastWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // **NEW** For success messages
    const [isFormVisible, setIsFormVisible] = useState(false);

    // --- State for the NEW or EDITED workout ---
    const [date, setDate] = useState(getTodayDate());
    const [workoutType, setWorkoutType] = useState('My Workout');
    const [currentExercises, setCurrentExercises] = useState([]);
    const [logToEdit, setLogToEdit] = useState(null); // **NEW** To hold the log being edited

    // --- State for the *single exercise* being added ---
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [sets, setSets] = useState([{ reps: '', weight: '', timeInSeconds: '' }]);
    const [rpe, setRpe] = useState('');
    const [notes, setNotes] = useState('');

    const API_URL = 'http://localhost:5000/api/workoutlog';

    // --- 1. Fetch all past workout *sessions* ---
    const fetchWorkouts = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (response.status === 404) {
                setPastWorkouts([]);
            } else if (response.ok) {
                const data = await response.json();
                // **MODIFIED** Sort by date, newest first
                setPastWorkouts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } else {
                throw new Error(`Failed to fetch workouts: ${response.statusText}`);
            }

        } catch (err) {
            setError(err.message);
            setPastWorkouts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, [user]);

    // --- 2. Handle Exercise Selection (Unchanged) ---
    const handleExerciseChange = (e) => {
        const exerciseIdString = e.target.value;
        if (!exerciseIdString) {
            setSelectedExercise(null);
            return;
        }
        const exerciseId = parseInt(exerciseIdString, 10);
        const exercise = allExercises.find(ex => ex.id === exerciseId);
        setSelectedExercise(exercise);
        setSets([{ reps: '', weight: '', timeInSeconds: '' }]);
        setRpe('');
        setNotes('');
    };

    // --- 3. Handle Set/Rep/Weight changes (Unchanged) ---
    const handleSetChange = (index, field, value) => {
        const newSets = [...sets];
        newSets[index][field] = value;
        setSets(newSets);
    };
    const addSet = () => setSets([...sets, { reps: '', weight: '', timeInSeconds: '' }]);
    const removeSet = (index) => {
        if (sets.length <= 1) return;
        setSets(sets.filter((_, i) => i !== index));
    };

    // --- 4. Add exercise to the *current workout list* (Unchanged) ---
    const handleAddExerciseToWorkout = (e) => {
        e.preventDefault();
        if (!selectedExercise) {
            setError('Please select an exercise');
            return;
        }
        const newExerciseLog = {
            exerciseId: selectedExercise.id,
            exerciseName: selectedExercise.name,
            sets: sets.filter(s => s.reps || s.weight || s.timeInSeconds),
            rpe: rpe ? Number(rpe) : undefined,
            notes,
        };
        setCurrentExercises([...currentExercises, newExerciseLog]);
        setSelectedExercise(null);
        setSets([{ reps: '', weight: '', timeInSeconds: '' }]);
        setRpe('');
        setNotes('');
        setError('');
    };

    // --- **NEW** Remove an exercise from the *current* list (before saving) ---
    const removeExerciseFromCurrentWorkout = (indexToRemove) => {
        setCurrentExercises(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- 5. Save the ENTIRE workout (HANDLES BOTH CREATE AND UPDATE) ---
    const handleSaveWorkout = async () => {
        if (currentExercises.length === 0) {
            setError('Please add at least one exercise to the workout');
            return;
        }

        setError('');
        setSuccess('');

        // This is the complete data for the workout session
        const workoutData = {
            date,
            workoutType,
            exercises: currentExercises,
        };

        // **NEW** Determine method and URL
        const isEditing = !!logToEdit;
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${logToEdit._id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(workoutData)
            });
            const savedWorkout = await response.json();
            if (!response.ok) throw new Error(savedWorkout.msg || 'Failed to save workout');

            setSuccess(isEditing ? 'Workout updated successfully!' : 'Workout saved successfully!');
            resetWorkoutForm();
            setIsFormVisible(false);
            fetchWorkouts(); // Re-fetch the list to show changes
        } catch (err) {
            setError(err.message);
        }
    };

    // --- **NEW** 6. Handle Edit Button Click ---
    const handleEdit = (log) => {
        clearMessages();
        setLogToEdit(log);
        setDate(new Date(log.date).toISOString().split('T')[0]);
        setWorkoutType(log.workoutType);
        setCurrentExercises(log.exercises);
        setIsFormVisible(true);
        window.scrollTo(0, 0); // Scroll to top
    };

    // --- **NEW** 7. Handle Delete Button Click ---
    const handleDelete = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this workout log?')) {
            return;
        }
        clearMessages();
        try {
            const response = await fetch(`${API_URL}/${logId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to delete');

            setSuccess('Workout deleted!');
            // Remove from state without re-fetching
            setPastWorkouts(prev => prev.filter(log => log._id !== logId));
        } catch (err) {
            setError(err.message);
        }
    };

    // --- **MODIFIED** Reset Form ---
    const resetWorkoutForm = () => {
        setDate(getTodayDate());
        setWorkoutType('My Workout');
        setCurrentExercises([]);
        setError('');
        setSuccess('');
        setLogToEdit(null); // **NEW** Clear editing state
        // Reset single-exercise form
        setSelectedExercise(null);
        setSets([{ reps: '', weight: '', timeInSeconds: '' }]);
        setRpe('');
        setNotes('');
    };

    // **NEW** Clear messages
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    return (
        <div className="profile-section training-log-section">
        <div className="section-header">
        <h3>Training Log</h3>
        <button
        className="btn btn-primary"
        // **MODIFIED** On-click logic
        onClick={() => {
            if (isFormVisible) {
                resetWorkoutForm(); // Clear form if closing
            }
            setIsFormVisible(!isFormVisible);
            clearMessages();
        }}
        >
        {isFormVisible ? (logToEdit ? 'Cancel Edit' : 'Cancel Workout') : 'Start New Workout'}
        </button>
        </div>

        {/* **MODIFIED** Added success message */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* --- New Workout Form (Conditional) --- */}
        {isFormVisible && (
            <div className="profile-form workout-form">
            {/* --- Part 1: Current Workout Details --- */}
            {/* **MODIFIED** Title changes based on state */}
            <h4>{logToEdit ? 'Edit Workout Session' : 'New Workout Session'}</h4>
            <div className="form-row">
            <div className="form-group">
            <label htmlFor="workout-date">Date</label>
            <input type="date" id="workout-date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
            <label htmlFor="workout-type">Workout Name</label>
            <input type="text" id="workout-type" value={workoutType} onChange={e => setWorkoutType(e.target.value)} placeholder="e.g., Push Day" />
            </div>
            </div>

            {/* --- Part 2: List of exercises *in this workout* --- */}
            <div className="current-workout-list">
            <h5>{logToEdit ? 'Exercises in this Log' : 'Current Workout'}</h5>
            {currentExercises.length === 0 ? (
                <p>Add an exercise below to get started.</p>
            ) : (
                // **MODIFIED** Added a remove button
                currentExercises.map((ex, index) => (
                    <div key={index} className="current-exercise-item">
                    <div>
                    <strong>{ex.exerciseName}</strong>
                    <span>{ex.sets.length} sets</span>
                    </div>
                    <button
                    type="button"
                    className="btn-icon-sm btn-delete"
                    onClick={() => removeExerciseFromCurrentWorkout(index)}
                    title="Remove exercise from log"
                    >
                    <FaTimes />
                    </button>
                    </div>
                ))
            )}
            </div>

            {/* --- Part 3: Form to add *one* exercise (Unchanged) --- */}
            <form className="log-form" onSubmit={handleAddExerciseToWorkout}>
            <div className="form-group">
            <label htmlFor="log-exercise">Add Exercise</label>
            <select id="log-exercise" onChange={handleExerciseChange} value={selectedExercise?.id || ''} required>
            <option value="">Select exercise...</option>
            {allExercises.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
            </select>
            </div>
            {selectedExercise && (
                <>
                <div className="form-group">
                <label>Sets</label>
                {sets.map((set, index) => (
                    <div key={index} className="set-row">
                    <span>Set {index + 1}</span>
                    <input type="number" placeholder="Reps" value={set.reps} onChange={e => handleSetChange(index, 'reps', e.target.value)} />
                    <input type="number" placeholder="Weight (kg)" value={set.weight} onChange={e => handleSetChange(index, 'weight', e.target.value)} />
                    <input type="number" placeholder="Time (sec)" value={set.timeInSeconds} onChange={e => handleSetChange(index, 'timeInSeconds', e.target.value)} />
                    <button type="button" className="btn-icon-sm" onClick={() => removeSet(index)}><TrashIcon /></button>
                    </div>
                ))}
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addSet}>
                <PlusIcon /> Add Set
                </button>
                </div>
                <div className="form-row">
                <div className="form-group">
                <label htmlFor="log-rpe">RPE (1-10)</label>
                <input type="number" id="log-rpe" min="1" max="10" value={rpe} onChange={e => setRpe(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="log-notes">Notes</label>
                <input type="text" id="log-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g., Felt strong" />
                </div>
                </div>
                <button type="submit" className="btn btn-secondary">Add Exercise to Workout</button>
                </>
            )}
            </form>

            {/* --- Part 4: Final Save Button --- */}
            <button onClick={handleSaveWorkout} className="btn btn-primary btn-save-workout" disabled={currentExercises.length === 0}>
            {logToEdit ? 'Update Workout Session' : 'Save Workout Session'}
            </button>
            </div>
        )}

        {/* --- Existing Workout History --- */}
        <div className="log-list">
        <h4>History</h4>
        {isLoading && <p>Loading workouts...</p>}
        {!isLoading && pastWorkouts.length === 0 && <p>No workouts found. Add your first one!</p>}
        {!isLoading && pastWorkouts.map(workout => (
            <div key={workout._id} className="log-item">
            <div className="log-item-header">
            <div> {/* **NEW** Wrapper */}
            <strong>{workout.workoutType || 'Workout'}</strong>
            <span>{new Date(workout.date).toLocaleDateString()}</span>
            </div>
            {/* **NEW** Actions */}
            <div className="log-item-actions">
            <button className="btn-icon" title="Edit" onClick={() => handleEdit(workout)}>
            <FaEdit />
            </button>
            <button className="btn-icon btn-delete" title="Delete" onClick={() => handleDelete(workout._id)}>
            <FaTrashAlt />
            </button>
            </div>
            </div>
            {workout.exercises.map((ex, i) => (
                <div key={i} className="workout-exercise-details">
                <strong>{ex.exerciseName}</strong>
                <ul className="log-item-sets">
                {ex.sets.map((set, j) => (
                    <li key={j}>
                    Set {j + 1}:
                    {set.reps && ` ${set.reps} reps`}
                    {set.weight && ` @ ${set.weight} kg`}
                    {set.timeInSeconds && ` for ${set.timeInSeconds} sec`}
                    </li>
                ))}
                </ul>
                {ex.rpe && <p>RPE: {ex.rpe}</p>}
                {ex.notes && <p>Notes: {ex.notes}</p>}
                </div>
            ))}
            </div>
        ))}
        </div>
        </div>
    );
}
