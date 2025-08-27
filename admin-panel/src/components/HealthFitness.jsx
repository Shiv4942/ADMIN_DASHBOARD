import React, { useState } from 'react';

const HealthFitness = () => {
  const [activeTab, setActiveTab] = useState('workouts');
  const [workouts, setWorkouts] = useState([]);
  const [goalsState, setGoalsState] = useState([]);
  const [dietEntries, setDietEntries] = useState([]);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '30 min', calories: 0 });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '' });
  const [showMealForm, setShowMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState({ meal: 'Meal', food: '', calories: 0, protein: '0g', carbs: '0g', fat: '0g' });

  const workoutData = [
    { id: 1, type: 'Strength Training', duration: '45 min', calories: 320, date: '2024-01-15' },
    { id: 2, type: 'Cardio', duration: '30 min', calories: 280, date: '2024-01-14' },
    { id: 3, type: 'Yoga', duration: '60 min', calories: 180, date: '2024-01-13' },
    { id: 4, type: 'HIIT', duration: '25 min', calories: 350, date: '2024-01-12' },
  ].concat(workouts);

  const goals = [
    { id: 1, title: 'Lose 10 lbs', target: '10 lbs', current: '6 lbs', progress: 60, deadline: '2024-03-01' },
    { id: 2, title: 'Run 5K', target: '5K', current: '3.2K', progress: 64, deadline: '2024-02-15' },
    { id: 3, title: 'Build Muscle', target: '5 lbs', current: '2 lbs', progress: 40, deadline: '2024-04-01' },
  ].concat(goalsState);

  const dietLogs = [
    { id: 1, meal: 'Breakfast', food: 'Oatmeal with berries', calories: 320, protein: '12g', carbs: '45g', fat: '8g' },
    { id: 2, meal: 'Lunch', food: 'Grilled chicken salad', calories: 450, protein: '35g', carbs: '15g', fat: '22g' },
    { id: 3, meal: 'Dinner', food: 'Salmon with quinoa', calories: 580, protein: '42g', carbs: '35g', fat: '28g' },
  ].concat(dietEntries);

  const tabs = [
    { id: 'workouts', label: 'Workouts', icon: '💪' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'diet', label: 'Diet Logs', icon: '🥗' },
  ];

  const renderWorkouts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Workouts</h3>
        <button className="btn-primary" onClick={() => setShowWorkoutForm(true)}>Add Workout</button>
      </div>
      {showWorkoutForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="input-field" placeholder="Type (e.g., Cardio)" value={newWorkout.type} onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })} />
            <input className="input-field" placeholder="Duration (e.g., 30 min)" value={newWorkout.duration} onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })} />
            <input className="input-field" type="number" placeholder="Calories" value={newWorkout.calories} onChange={(e) => setNewWorkout({ ...newWorkout, calories: parseInt(e.target.value || '0', 10) })} />
            <div className="flex space-x-2">
              <button className="btn-primary" onClick={() => {
                if (!newWorkout.type) { alert('Enter type'); return; }
                setWorkouts(prev => [{ id: Date.now(), date: new Date().toISOString().slice(0,10), ...newWorkout }, ...prev]);
                setNewWorkout({ type: '', duration: '30 min', calories: 0 });
                setShowWorkoutForm(false);
              }}>Save</button>
              <button className="btn-secondary" onClick={() => setShowWorkoutForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {workoutData.map((workout) => (
          <div key={workout.id} className="card p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">{workout.type}</h4>
                <p className="text-sm text-gray-600">{workout.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{workout.duration}</p>
                <p className="text-sm text-gray-600">{workout.calories} calories</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Fitness Goals</h3>
        <button className="btn-primary" onClick={() => setShowGoalForm(true)}>Add Goal</button>
      </div>
      {showGoalForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="input-field" placeholder="Title" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
            <input className="input-field" placeholder="Target (e.g., 5K)" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} />
            <input className="input-field" type="date" placeholder="Deadline" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} />
            <div className="flex space-x-2">
              <button className="btn-primary" onClick={() => {
                if (!newGoal.title || !newGoal.target) { alert('Enter title and target'); return; }
                setGoalsState(prev => [{ id: Date.now(), title: newGoal.title, target: newGoal.target, current: '0', progress: 0, deadline: newGoal.deadline || 'N/A' }, ...prev]);
                setNewGoal({ title: '', target: '', deadline: '' });
                setShowGoalForm(false);
              }}>Save</button>
              <button className="btn-secondary" onClick={() => setShowGoalForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-900">{goal.title}</h4>
              <span className="text-sm text-gray-600">Due: {goal.deadline}</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress: {goal.current} / {goal.target}</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiet = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Diet Logs</h3>
        <button className="btn-primary" onClick={() => setShowMealForm(true)}>Log Meal</button>
      </div>
      {showMealForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input className="input-field" placeholder="Meal (e.g., Breakfast)" value={newMeal.meal} onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })} />
            <input className="input-field" placeholder="Food" value={newMeal.food} onChange={(e) => setNewMeal({ ...newMeal, food: e.target.value })} />
            <input className="input-field" type="number" placeholder="Calories" value={newMeal.calories} onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value || '0', 10) })} />
            <input className="input-field" placeholder="Protein (g)" value={newMeal.protein} onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })} />
            <input className="input-field" placeholder="Carbs (g)" value={newMeal.carbs} onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })} />
            <div className="flex space-x-2">
              <button className="btn-primary" onClick={() => {
                if (!newMeal.food) { alert('Enter food'); return; }
                setDietEntries(prev => [{ id: Date.now(), ...newMeal }, ...prev]);
                setNewMeal({ meal: 'Meal', food: '', calories: 0, protein: '0g', carbs: '0g', fat: '0g' });
                setShowMealForm(false);
              }}>Save</button>
              <button className="btn-secondary" onClick={() => setShowMealForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {dietLogs.map((log) => (
          <div key={log.id} className="card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{log.meal}</h4>
                <p className="text-sm text-gray-600">{log.food}</p>
              </div>
              <span className="font-medium text-gray-900">{log.calories} cal</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Protein:</span>
                <span className="ml-2 font-medium">{log.protein}</span>
              </div>
              <div>
                <span className="text-gray-600">Carbs:</span>
                <span className="ml-2 font-medium">{log.carbs}</span>
              </div>
              <div>
                <span className="text-gray-600">Fat:</span>
                <span className="ml-2 font-medium">{log.fat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health & Fitness</h1>
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
