import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NOTE: This app requires the following dependencies.
// To install them, run:
// npm install @react-native-async-storage/async-storage
// npm install react-native-vector-icons (and follow setup instructions)
// If you don't want to install icons, text-based icons are used as a fallback.

// Mock data to get started
const initialMeals = [
  { "day": "Monday", "breakfast": "Dosa & Chutney", "lunch": "Rice, Sambar, Veg", "dinner": "Chapati & Veg", "notes": "Soak dosa batter" },
  { "day": "Tuesday", "breakfast": "Idli", "lunch": "Dal Tadka", "dinner": "Roti & Sabzi", "notes": "" },
  { "day": "Wednesday", "breakfast": "Poha", "lunch": "Veggie Stir Fry", "dinner": "Pasta", "notes": "" },
  { "day": "Thursday", "breakfast": "Oats", "lunch": "Sandwich", "dinner": "Soup", "notes": "" },
  { "day": "Friday", "breakfast": "Upma", "lunch": "Pizza", "dinner": "Salad", "notes": "" },
  { "day": "Saturday", "breakfast": "Pancakes", "lunch": "Burger", "dinner": "BBQ", "notes": "" },
  { "day": "Sunday", "breakfast": "Scrambled Eggs", "lunch": "Roast Chicken", "dinner": "Leftovers", "notes": "" }
];

const initialGroceryList = [
  { "item": "Rice", "category": "Grains", "quantity": "5kg", "checked": false },
  { "item": "Milk", "category": "Dairy", "quantity": "1L", "checked": true },
  { "item": "Tomatoes", "category": "Vegetables", "quantity": "500g", "checked": false },
  { "item": "Chicken", "category": "Meat", "quantity": "1kg", "checked": false },
];

const initialCleaningTasks = [
  { "task": "Sweep Living Room", "category": "Indoor", "frequency": "Daily", "status": "To-do" },
  { "task": "Clean Kitchen Counters", "category": "Indoor", "frequency": "Daily", "status": "Done" },
  { "task": "Mop Floors", "category": "Indoor", "frequency": "Weekly", "status": "To-do" },
  { "task": "Dust Shelves", "category": "Indoor", "frequency": "Weekly", "status": "To-do" },
  { "task": "Wash Windows", "category": "Outdoor", "frequency": "Monthly", "status": "To-do" },
];

const initialProjects = [
  { "category": "Panchalis", "task": "Upload new saree post", "deadline": "2025-09-20", "notes": "Highlight Banarasi silk", "status": "To-Do" },
  { "category": "Panchalis", "task": "Plan next photoshoot", "deadline": "2025-10-05", "notes": "Find new location", "status": "In Progress" },
  { "category": "YouTube", "task": "Edit latest video", "deadline": "2025-09-18", "notes": "Add music", "status": "To-Do" },
  { "category": "YouTube", "task": "Write new script", "deadline": "2025-09-25", "notes": "Topic: DIY home decor", "status": "Done" },
];

const initialPlanner = [
  { "date": "2025-09-16", "priorities": ["Meal prep", "Clean kitchen", "Upload saree post"], "events": "Doctor appt 4PM", "done": false }
];

const initialNotes = [
  { "title": "Crochet Idea", "details": "Try new table mat pattern", "tags": ["Craft"], "dateAdded": "2025-09-15" },
  { "title": "Grocery Shopping List", "details": "Don't forget the milk!", "tags": ["Food"], "dateAdded": "2025-09-14" }
];

// Helper function to get data from AsyncStorage
const getLocalData = async (key, initialValue) => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);
    return initialValue;
  }
};

// Helper function to save data to AsyncStorage
const setLocalData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for all data
  const [meals, setMeals] = useState(initialMeals);
  const [groceryList, setGroceryList] = useState(initialGroceryList);
  const [cleaningTasks, setCleaningTasks] = useState(initialCleaningTasks);
  const [projects, setProjects] = useState(initialProjects);
  const [planner, setPlanner] = useState(initialPlanner);
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    const loadData = async () => {
      setMeals(await getLocalData('meals', initialMeals));
      setGroceryList(await getLocalData('groceryList', initialGroceryList));
      setCleaningTasks(await getLocalData('cleaningTasks', initialCleaningTasks));
      setProjects(await getLocalData('projects', initialProjects));
      setPlanner(await getLocalData('planner', initialPlanner));
      setNotes(await getLocalData('notes', initialNotes));
      setLoading(false);
    };
    loadData();
  }, []);

  // Sync state with AsyncStorage on change
  useEffect(() => { setLocalData('meals', meals); }, [meals]);
  useEffect(() => { setLocalData('groceryList', groceryList); }, [groceryList]);
  useEffect(() => { setLocalData('cleaningTasks', cleaningTasks); }, [cleaningTasks]);
  useEffect(() => { setLocalData('projects', projects); }, [projects]);
  useEffect(() => { setLocalData('planner', planner); }, [planner]);
  useEffect(() => { setLocalData('notes', notes); }, [notes]);

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Loading...</Text>;
    }
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard meals={meals} cleaningTasks={cleaningTasks} planner={planner} />;
      case 'meals':
        return <MealPlanner meals={meals} setMeals={setMeals} />;
      case 'grocery':
        return <GroceryList groceryList={groceryList} setGroceryList={setGroceryList} />;
      case 'cleaning':
        return <CleaningTasks cleaningTasks={cleaningTasks} setCleaningTasks={setCleaningTasks} />;
      case 'projects':
        return <Projects projects={projects} setProjects={setProjects} />;
      case 'planner':
        return <Planner planner={planner} setPlanner={setPlanner} />;
      case 'notes':
        return <Notes notes={notes} setNotes={setNotes} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentPadding}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, isDarkMode && styles.darkBottomNav]}>
        <TabButton icon="🏠" label="Home" tab="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon="🍽️" label="Meals" tab="meals" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon="🛒" label="Grocery" tab="grocery" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon="🧹" label="Cleaning" tab="cleaning" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon="📁" label="Projects" tab="projects" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon="📅" label="Planner" tab="planner" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon="📝" label="Notes" tab="notes" activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </View>
  );
};

const TabButton = ({ icon, label, tab, activeTab, setActiveTab }) => (
  <TouchableOpacity onPress={() => setActiveTab(tab)} style={styles.tabButton}>
    <Text style={[styles.tabIcon, activeTab === tab && styles.activeTab]}>{icon}</Text>
    <Text style={[styles.tabLabel, activeTab === tab && styles.activeTab]}>{label}</Text>
  </TouchableOpacity>
);

// Dashboard Section
const Dashboard = ({ meals, cleaningTasks, planner }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayMeals = meals.find(meal => meal.day === today);
  const topCleaningTasks = cleaningTasks.filter(task => task.status === 'To-do').slice(0, 3);
  const todayPlanner = planner.find(p => p.date === new Date().toISOString().slice(0, 10));

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      <Card title="Today's Meal Plan">
        {todayMeals ? (
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Breakfast: {todayMeals.breakfast}</Text>
            <Text style={styles.cardText}>Lunch: {todayMeals.lunch}</Text>
            <Text style={styles.cardText}>Dinner: {todayMeals.dinner}</Text>
          </View>
        ) : <Text style={styles.cardText}>No meal plan for today.</Text>}
      </Card>
      <Card title="Top Cleaning Tasks">
        <View style={styles.cardContent}>
          {topCleaningTasks.length > 0 ? topCleaningTasks.map((task, index) => (
            <Text key={index} style={styles.cardText}>- {task.task}</Text>
          )) : <Text style={styles.cardText}>No cleaning tasks left!</Text>}
        </View>
      </Card>
      <Card title="Today's Priorities">
        <View style={styles.cardContent}>
          {todayPlanner && todayPlanner.priorities.length > 0 ? todayPlanner.priorities.map((priority, index) => (
            <Text key={index} style={styles.cardText}>- {priority}</Text>
          )) || <Text style={styles.cardText}>No priorities set.</Text>}
        </View>
      </Card>
    </View>
  );
};

// Meal Planner Section
const MealPlanner = ({ meals, setMeals }) => {
  const [editingDay, setEditingDay] = useState(null);
  const [editedMeal, setEditedMeal] = useState({});

  const handleEdit = (day) => {
    setEditingDay(day);
    setEditedMeal(meals.find(m => m.day === day));
  };

  const handleChange = (name, value) => {
    setEditedMeal({ ...editedMeal, [name]: value });
  };

  const handleSave = () => {
    setMeals(meals.map(m => m.day === editingDay ? editedMeal : m));
    setEditingDay(null);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Meal Planner</Text>
      {meals.map((meal) => (
        <Card key={meal.day} title={meal.day}>
          {editingDay === meal.day ? (
            <View>
              <TextInput style={styles.input} value={editedMeal.breakfast} onChangeText={(text) => handleChange('breakfast', text)} placeholder="Breakfast" />
              <TextInput style={styles.input} value={editedMeal.lunch} onChangeText={(text) => handleChange('lunch', text)} placeholder="Lunch" />
              <TextInput style={styles.input} value={editedMeal.dinner} onChangeText={(text) => handleChange('dinner', text)} placeholder="Dinner" />
              <View style={styles.buttonRow}>
                <Button onPress={handleSave}>Save</Button>
                <Button onPress={() => setEditingDay(null)} variant="secondary">Cancel</Button>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.cardText}>Breakfast: {meal.breakfast}</Text>
              <Text style={styles.cardText}>Lunch: {meal.lunch}</Text>
              <Text style={styles.cardText}>Dinner: {meal.dinner}</Text>
              <Button onPress={() => handleEdit(meal.day)}>Edit</Button>
            </View>
          )}
        </Card>
      ))}
    </View>
  );
};

// Grocery List Section
const GroceryList = ({ groceryList, setGroceryList }) => {
  const handleToggleCheck = (item) => {
    setGroceryList(groceryList.map(i => i.item === item ? { ...i, checked: !i.checked } : i));
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Grocery List</Text>
      {groceryList.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.listItem, item.checked && styles.checkedItem]}
          onPress={() => handleToggleCheck(item.item)}
        >
          <View style={[styles.checkbox, item.checked && styles.checkedCheckbox]}>
            {item.checked && <Text style={styles.checkIcon}>✓</Text>}
          </View>
          <Text style={[styles.listItemText, item.checked && styles.checkedText]}>{item.item} ({item.quantity})</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Cleaning Tasks Section
const CleaningTasks = ({ cleaningTasks, setCleaningTasks }) => {
  const handleToggleStatus = (task) => {
    setCleaningTasks(cleaningTasks.map(t => t.task === task ? { ...t, status: t.status === 'To-do' ? 'Done' : 'To-do' } : t));
  };
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Cleaning Tasks</Text>
      {cleaningTasks.map((task, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.listItem, task.status === 'Done' && styles.checkedItem]}
          onPress={() => handleToggleStatus(task.task)}
        >
          <View style={[styles.checkbox, task.status === 'Done' && styles.checkedCheckbox]}>
            {task.status === 'Done' && <Text style={styles.checkIcon}>✓</Text>}
          </View>
          <Text style={[styles.listItemText, task.status === 'Done' && styles.checkedText]}>{task.task}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Projects Section
const Projects = ({ projects, setProjects }) => {
  const [activeCategory, setActiveCategory] = useState('Panchalis');
  const filteredProjects = projects.filter(p => p.category === activeCategory);
  const statuses = ['To-Do', 'In Progress', 'Done'];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Projects</Text>
      <View style={styles.buttonRow}>
        <Button onPress={() => setActiveCategory('Panchalis')}>Panchalis Studio</Button>
        <Button onPress={() => setActiveCategory('YouTube')}>YouTube</Button>
      </View>
      <View>
        {statuses.map(status => (
          <View key={status} style={styles.kanbanColumn}>
            <Text style={styles.kanbanTitle}>{status}</Text>
            {filteredProjects.filter(p => p.status === status).map((project, index) => (
              <Card key={index} title={project.task}>
                <Text style={styles.kanbanText}>Notes: {project.notes}</Text>
                <Text style={styles.kanbanText}>Deadline: {project.deadline}</Text>
              </Card>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// Planner Section
const Planner = ({ planner, setPlanner }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const todayPlanner = planner.find(p => p.date === selectedDate);
  const [prioritiesInput, setPrioritiesInput] = useState('');

  const handleAddPriority = () => {
    if (prioritiesInput.trim() === '') return;
    const existingEntry = planner.find(p => p.date === selectedDate);
    if (existingEntry) {
      const updatedPriorities = [...existingEntry.priorities, prioritiesInput];
      setPlanner(planner.map(p => p.date === selectedDate ? { ...p, priorities: updatedPriorities } : p));
    } else {
      setPlanner([...planner, { date: selectedDate, priorities: [prioritiesInput], events: "", done: false }]);
    }
    setPrioritiesInput('');
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Daily Planner</Text>
      <Card title="Today's Plan">
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={selectedDate}
          onChangeText={setSelectedDate}
        />
        <View style={styles.spacer} />
        <Text style={styles.cardTitle}>Priorities</Text>
        <View style={styles.cardContent}>
          {todayPlanner?.priorities.map((p, index) => (
            <Text key={index} style={styles.cardText}>- {p}</Text>
          )) || <Text style={styles.cardText}>No priorities set.</Text>}
        </View>
        <View style={styles.spacer} />
        <TextInput
          style={styles.input}
          placeholder="Add new priority"
          value={prioritiesInput}
          onChangeText={setPrioritiesInput}
        />
        <Button onPress={handleAddPriority}>Add Priority</Button>
      </Card>
    </View>
  );
};

// Notes Section
const Notes = ({ notes, setNotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.details.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Search notes..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {filteredNotes.map((note, index) => (
        <Card key={index} title={note.title}>
          <Text style={styles.cardText}>{note.details}</Text>
        </Card>
      ))}
    </View>
  );
};

// --- Custom Components ---
const Card = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardBody}>
      {children}
    </View>
  </View>
);

const Button = ({ children, onPress, variant = 'primary' }) => {
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  darkContainer: {
    backgroundColor: '#1f2937',
  },
  contentContainer: {
    flexGrow: 1,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  darkBottomNav: {
    borderTopColor: '#4b5563',
    backgroundColor: '#1f2937',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  tabIcon: {
    fontSize: 20,
    color: '#9ca3af',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#9ca3af',
  },
  activeTab: {
    color: '#06b6d4',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkedItem: {
    backgroundColor: '#e0f7fa',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 16,
    flex: 1,
  },
  checkedText: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  input: {
    height: 40,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#06b6d4',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#374151',
  },
  kanbanColumn: {
    marginBottom: 20,
  },
  kanbanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  kanbanText: {
    fontSize: 14,
    color: '#6b7280',
  },
  spacer: {
    height: 10,
  },
});

export default App;
