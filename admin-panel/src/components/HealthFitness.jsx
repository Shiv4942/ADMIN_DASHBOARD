import React, { useState, useEffect } from 'react';
import { workoutService, goalService, dietLogService } from '../services/healthFitnessService';
import { format } from 'date-fns';

const HealthFitness = () => {
  const [activeTab, setActiveTab] = useState('workouts');
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [loading, setLoading] = useState({ workouts: false, goals: false, dietLogs: false });
  const [error, setError] = useState(null);
  
  // Form states
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ 
    type: '', 
    duration: '30', 
    calories: 0,
    notes: ''
  });
  
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    target: '', 
    current: '0',
    deadline: format(new Date().setMonth(new Date().getMonth() + 1), 'yyyy-MM-dd'),
    category: 'fitness'
  });
  
  const [showMealForm, setShowMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ 
    meal: 'Breakfast', 
    food: '', 
    calories: 0, 
    protein: 0, 
    carbs: 0, 
    fat: 0,
    notes: ''
  });
  
  const [showMealPlanForm, setShowMealPlanForm] = useState(false);
  const [mealPlan, setMealPlan] = useState({
    name: '',
    description: '',
    meals: [
      { meal: 'Breakfast', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { meal: 'Lunch', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { meal: 'Dinner', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { meal: 'Snacks', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 }
    ]
  });

  // Fetch data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'workouts' && workouts.length === 0) {
          setLoading(prev => ({ ...prev, workouts: true }));
          const data = await workoutService.getWorkouts();
          setWorkouts(data);
        } else if (activeTab === 'goals' && goals.length === 0) {
          setLoading(prev => ({ ...prev, goals: true }));
          const data = await goalService.getGoals();
          setGoals(data);
        } else if (activeTab === 'diet' && dietLogs.length === 0) {
          setLoading(prev => ({ ...prev, dietLogs: true }));
          const data = await dietLogService.getDietLogs();
          setDietLogs(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(prev => ({ ...prev, [activeTab]: false }));
      }
    };

    fetchData();
  }, [activeTab]);

  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: '💪' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'diet', label: 'Diet Logs', icon: '🥗' },
  ];

  // Workout Handlers
  const handleCreateWorkout = async () => {
    if (!newWorkout.type) {
      setError('Please enter a workout type');
      return;
    }
    
    try {
      const workout = await workoutService.createWorkout({
        ...newWorkout,
        duration: `${newWorkout.duration} min`
      });
      
      setWorkouts([workout, ...workouts]);
      setNewWorkout({ type: '', duration: '30', calories: 0, notes: '' });
      setShowWorkoutForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create workout');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutService.deleteWorkout(id);
        setWorkouts(workouts.filter(workout => workout._id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete workout');
      }
    }
  };

  const renderWorkouts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Workouts</h3>
        <button 
          className="btn-primary" 
          onClick={() => setShowWorkoutForm(true)}
          disabled={loading.workouts}
        >
          {loading.workouts ? 'Loading...' : 'Add Workout'}
        </button>
      </div>
      
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      
      {showWorkoutForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input 
              className="input-field" 
              placeholder="Type (e.g., Cardio)" 
              value={newWorkout.type} 
              onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })} 
            />
            <input 
              className="input-field" 
              type="number"
              placeholder="Duration (minutes)" 
              value={newWorkout.duration} 
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })} 
            />
            <input 
              className="input-field" 
              type="number" 
              placeholder="Calories burned" 
              value={newWorkout.calories} 
              onChange={(e) => setNewWorkout({ ...newWorkout, calories: parseInt(e.target.value || '0', 10) })} 
            />
            <textarea
              className="input-field md:col-span-2"
              placeholder="Notes (optional)"
              value={newWorkout.notes}
              onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
              rows={1}
            />
            <div className="flex space-x-2 md:col-span-5">
              <button 
                className="btn-primary flex-1" 
                onClick={handleCreateWorkout}
                disabled={loading.workouts}
              >
                {loading.workouts ? 'Saving...' : 'Save Workout'}
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => setShowWorkoutForm(false)}
                disabled={loading.workouts}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {loading.workouts ? (
          <div className="text-center py-8">Loading workouts...</div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No workouts found. Add your first workout!</div>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{workout.type}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(workout.createdAt), 'MMM d, yyyy')}
                  </p>
                  {workout.notes && (
                    <p className="mt-2 text-sm text-gray-700">{workout.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{workout.duration}</p>
                  <p className="text-sm text-gray-600">{workout.calories} calories</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <button 
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => handleDeleteWorkout(workout._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Goal Handlers
  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.target) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      const goal = await goalService.createGoal({
        ...newGoal,
        target: parseFloat(newGoal.target),
        current: 0,
        progress: 0,
        deadline: newGoal.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      setGoals([goal, ...goals]);
      setNewGoal({ title: '', target: 0, category: 'weight', deadline: '' });
      setShowGoalForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to create goal');
    }
  };

  const handleUpdateGoalProgress = async (id, currentProgress) => {
    try {
      const goal = goals.find(g => g._id === id);
      if (!goal) return;
      
      const progress = Math.min(100, Math.round((currentProgress / goal.target) * 100));
      
      const updatedGoal = await goalService.updateGoal(id, {
        current: currentProgress,
        progress
      });
      
      setGoals(goals.map(g => g._id === id ? updatedGoal : g));
    } catch (err) {
      setError(err.message || 'Failed to update goal progress');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.deleteGoal(id);
        setGoals(goals.filter(goal => goal._id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete goal');
      }
    }
  };

  const renderGoals = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Fitness Goals</h3>
          <button 
            className="btn-primary" 
            onClick={() => setShowGoalForm(true)}
            disabled={loading.goals}
          >
            {loading.goals ? 'Loading...' : 'Add Goal'}
          </button>
        </div>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        {showGoalForm && (
          <div className="card p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input 
                className="input-field" 
                placeholder="Goal Title" 
                value={newGoal.title} 
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} 
              />
              <select 
                className="input-field" 
                value={newGoal.category} 
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                <option value="weight">Weight Loss</option>
                <option value="distance">Running Distance</option>
                <option value="workout">Workout Minutes</option>
                <option value="other">Other</option>
              </select>
              <input 
                className="input-field" 
                type="number" 
                placeholder="Target" 
                value={newGoal.target || ''} 
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} 
              />
              <input 
                className="input-field" 
                type="date" 
                placeholder="Deadline" 
                min={new Date().toISOString().split('T')[0]}
                value={newGoal.deadline || ''} 
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} 
              />
              <div className="flex space-x-2 md:col-span-5">
                <button 
                  className="btn-primary flex-1" 
                  onClick={handleCreateGoal}
                  disabled={loading.goals}
                >
                  {loading.goals ? 'Saving...' : 'Save Goal'}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowGoalForm(false)}
                  disabled={loading.goals}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {loading.goals ? (
            <div className="text-center py-8">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No goals found. Add your first goal to get started!</div>
          ) : (
            goals.map((goal) => (
              <div key={goal._id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-600">
                      Target: {goal.target} {goal.category === 'weight' ? 'lbs' : goal.category === 'distance' ? 'miles' : ''}
                      {goal.deadline && ` • Due: ${format(new Date(goal.deadline), 'MMM d, yyyy')}`}
                    </p>
                  </div>
                  <button 
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => handleDeleteGoal(goal._id)}
                  >
                    Delete
                  </button>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      goal.progress < 30 ? 'bg-red-500' : 
                      goal.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${Math.min(100, goal.progress)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {goal.progress}% Complete
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {Number(goal.current).toFixed(1)} / {goal.target}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max={goal.target * 1.5}
                      value={goal.current}
                      onChange={(e) => {
                        const current = parseFloat(e.target.value);
                        handleUpdateGoalProgress(goal._id, current);
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {Number(goal.current).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Diet Log Handlers
  const handleCreateDietLog = async () => {
    if (!newMeal.food || !newMeal.meal) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      const dietLog = await dietLogService.createDietLog({
        ...newMeal,
        protein: parseFloat(newMeal.protein) || 0,
        carbs: parseFloat(newMeal.carbs) || 0,
        fat: parseFloat(newMeal.fat) || 0,
        calories: parseInt(newMeal.calories, 10) || 0
      });
      
      setDietLogs([dietLog, ...dietLogs]);
      setNewMeal({ 
        meal: 'Breakfast', 
        food: '', 
        calories: 0, 
        protein: 0, 
        carbs: 0, 
        fat: 0,
        notes: '' 
      });
      setShowMealForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to log meal');
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.food) {
      setError('Please enter food name');
      return;
    }
    
    try {
      const mealLog = await dietLogService.createDietLog({
        ...newMeal,
        date: new Date().toISOString()
      });
      setDietLogs([mealLog, ...dietLogs]);
      setNewMeal({ 
        meal: 'Breakfast', 
        food: '', 
        calories: 0, 
        protein: 0, 
        carbs: 0, 
        fat: 0,
        notes: ''
      });
      setShowMealForm(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add meal');
    }
  };
  
  const handleAddMealPlan = async () => {
    try {
      // Filter out empty meals
      const validMeals = mealPlan.meals.filter(meal => meal.food.trim() !== '');
      
      if (validMeals.length === 0) {
        setError('Please add at least one meal to the plan');
        return;
      }
      
      // Add all meals from the plan to the diet logs
      const newMealLogs = [];
      
      for (const meal of validMeals) {
        try {
          const response = await dietLogService.createDietLog({
            ...meal,
            date: new Date().toISOString(),
            notes: mealPlan.name ? `Part of meal plan: ${mealPlan.name}` : ''
          });
          newMealLogs.push(response);
        } catch (err) {
          console.error(`Error adding meal ${meal.meal}:`, err);
          // Continue with other meals even if one fails
        }
      }
      
      if (newMealLogs.length > 0) {
        // Update the diet logs state with the new meals
        setDietLogs(prevLogs => [...newMealLogs, ...prevLogs]);
        
        // Show success message
        setError(null);
        
        // Reset form
        setMealPlan({
          name: '',
          description: '',
          meals: [
            { meal: 'Breakfast', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
            { meal: 'Lunch', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
            { meal: 'Dinner', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
            { meal: 'Snacks', food: '', calories: 0, protein: 0, carbs: 0, fat: 0 }
          ]
        });
        
        setShowMealPlanForm(false);
      } else {
        setError('Failed to add any meals. Please try again.');
      }
    } catch (err) {
      console.error('Error in handleAddMealPlan:', err);
      setError(err.response?.data?.message || 'Failed to add meal plan');
    }
  };
  
  const updateMealInPlan = (index, field, value) => {
    const updatedMeals = [...mealPlan.meals];
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    setMealPlan({ ...mealPlan, meals: updatedMeals });
  };
  
  const calculateTotals = () => {
    return mealPlan.meals.reduce(
      (totals, meal) => ({
        calories: totals.calories + (Number(meal.calories) || 0),
        protein: totals.protein + (Number(meal.protein) || 0),
        carbs: totals.carbs + (Number(meal.carbs) || 0),
        fat: totals.fat + (Number(meal.fat) || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleDeleteDietLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal log?')) {
      try {
        await dietLogService.deleteDietLog(id);
        setDietLogs(dietLogs.filter(log => log._id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete meal log');
      }
    }
  };

  // Group diet logs by date
  const groupDietLogsByDate = () => {
    const grouped = {};
    dietLogs.forEach(log => {
      const date = format(new Date(log.date || log.createdAt), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });
    return grouped;
  };

  const groupedDietLogs = groupDietLogsByDate();

  const renderDiet = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Diet Logs</h3>
        <div className="space-x-2">
          <button
            onClick={() => setShowMealPlanForm(true)}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 mr-2"
          >
            + Create Meal Plan
          </button>
          <button
            onClick={() => setShowMealForm(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            + Add Meal
          </button>
        </div>
      </div>
      
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      
      {showMealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Meal</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Meal Type</label>
                <select
                  value={newMeal.meal}
                  onChange={(e) => setNewMeal({...newMeal, meal: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Item</label>
                <input
                  type="text"
                  value={newMeal.food}
                  onChange={(e) => setNewMeal({...newMeal, food: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Chicken Salad"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Calories</label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
                  <input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newMeal.notes}
                  onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="2"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowMealForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMeal}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showMealPlanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Meal Plan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                <input
                  type="text"
                  value={mealPlan.name}
                  onChange={(e) => setMealPlan({...mealPlan, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g., High Protein Diet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={mealPlan.description}
                  onChange={(e) => setMealPlan({...mealPlan, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows="2"
                  placeholder="Brief description of your meal plan..."
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-800 mb-3">Meal Plan</h4>
                
                {mealPlan.meals.map((meal, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-3">{meal.meal}</h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Food Items</label>
                        <input
                          type="text"
                          value={meal.food}
                          onChange={(e) => updateMealInPlan(index, 'food', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          placeholder="e.g., Grilled chicken with quinoa"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Calories</label>
                          <input
                            type="number"
                            value={meal.calories}
                            onChange={(e) => updateMealInPlan(index, 'calories', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Protein (g)</label>
                          <input
                            type="number"
                            value={meal.protein}
                            onChange={(e) => updateMealInPlan(index, 'protein', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Carbs (g)</label>
                          <input
                            type="number"
                            value={meal.carbs}
                            onChange={(e) => updateMealInPlan(index, 'carbs', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Fat (g)</label>
                          <input
                            type="number"
                            value={meal.fat}
                            onChange={(e) => updateMealInPlan(index, 'fat', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">Daily Totals</h5>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Calories</span>
                      <span className="text-lg font-semibold">{calculateTotals().calories}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Protein (g)</span>
                      <span className="text-lg font-semibold">{calculateTotals().protein}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Carbs (g)</span>
                      <span className="text-lg font-semibold">{calculateTotals().carbs}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Fat (g)</span>
                      <span className="text-lg font-semibold">{calculateTotals().fat}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowMealPlanForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMealPlan}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Save Meal Plan
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-8">
        {loading.dietLogs ? (
          <div className="text-center py-8">Loading diet logs...</div>
        ) : dietLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No diet logs found. Log your first meal to get started!</div>
        ) : (
          Object.entries(groupedDietLogs).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)).map(([date, logs]) => (
            <div key={date} className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700 border-b pb-1">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h4>
              <div className="space-y-3">
                {logs.map((log, index) => {
                  const totalCalories = log.calories || 0;
                  const totalProtein = parseFloat(log.protein) || 0;
                  const totalCarbs = parseFloat(log.carbs) || 0;
                  const totalFat = parseFloat(log.fat) || 0;
                  
                  // Create a truly unique key using date, meal type, _id, and timestamp
                  const uniqueKey = log._id 
                    ? `${date}-${log.meal}-${log._id}`
                    : `${date}-${log.meal}-${index}-${Date.now()}`;
                  
                  return (
                    <div key={uniqueKey} className="card p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900">{log.meal}</span>
                            {log.notes && (
                              <span className="ml-2 text-xs text-gray-500">
                                <i className="fas fa-sticky-note mr-1"></i>
                                {log.notes.length > 20 ? `${log.notes.substring(0, 20)}...` : log.notes}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{log.food}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-gray-900">{totalCalories} cal</span>
                          <p className="text-xs text-gray-500">
                            {format(new Date(log.date || log.createdAt), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-blue-50 p-2 rounded text-center">
                            <div className="font-medium text-blue-700">{totalProtein}g</div>
                            <div className="text-xs text-blue-500">Protein</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded text-center">
                            <div className="font-medium text-green-700">{totalCarbs}g</div>
                            <div className="text-xs text-green-500">Carbs</div>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded text-center">
                            <div className="font-medium text-yellow-700">{totalFat}g</div>
                            <div className="text-xs text-yellow-500">Fat</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                        <button 
                          className="text-red-500 hover:text-red-700 text-sm"
                          onClick={() => handleDeleteDietLog(log._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Daily Summary */}
              {logs.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Daily Total:</span>
                    <span className="font-semibold">
                      {logs.reduce((sum, log) => sum + (log.calories || 0), 0)} calories
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-blue-600">
                        {logs.reduce((sum, log) => sum + (parseFloat(log.protein) || 0), 0).toFixed(1)}g
                      </span> protein
                    </div>
                    <div>
                      <span className="text-green-600">
                        {logs.reduce((sum, log) => sum + (parseFloat(log.carbs) || 0), 0).toFixed(1)}g
                      </span> carbs
                    </div>
                    <div>
                      <span className="text-yellow-600">
                        {logs.reduce((sum, log) => sum + (parseFloat(log.fat) || 0), 0).toFixed(1)}g
                      </span> fat
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Main render function
  const render = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health &amp; Fitness</h1>
        <p className="text-gray-600 mt-2">Track your workouts, goals, and nutrition.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'diet' && renderDiet()}
      </div>
    </div>
  );

  // Return the JSX directly
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health &amp; Fitness</h1>
        <p className="text-gray-600 mt-2">Track your workouts, goals, and nutrition.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'diet' && renderDiet()}
      </div>
    </div>
  );
};

export default HealthFitness;
    


