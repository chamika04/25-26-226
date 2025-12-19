import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const MealPlan = () => {
  const location = useLocation();
  const userData = location.state?.userData;

  // Sample meal plan data based on user preferences
  const generateMealPlan = () => {
    if (!userData) return null;

    const { dietType, calories } = userData;
    
    // Base meal structure
    const meals = {
      breakfast: {
        title: "Breakfast",
        items: []
      },
      lunch: {
        title: "Lunch",
        items: []
      },
      dinner: {
        title: "Dinner",
        items: []
      },
      snacks: {
        title: "Snacks",
        items: []
      }
    };

    // Diet-specific meal options
    if (dietType === 'keto') {
      meals.breakfast.items = [
        "3 Eggs scrambled with spinach and feta cheese",
        "2 slices of bacon",
        "1/2 Avocado"
      ];
      meals.lunch.items = [
        "Grilled chicken salad with olive oil dressing",
        "1/4 cup almonds",
        "1 cup mixed greens"
      ];
      meals.dinner.items = [
        "Salmon with roasted asparagus",
        "Cauliflower mash with butter",
        "Side of sautéed mushrooms"
      ];
      meals.snacks.items = [
        "String cheese",
        "Handful of macadamia nuts",
        "Celery with almond butter"
      ];
    } else if (dietType === 'vegetarian') {
      meals.breakfast.items = [
        "Greek yogurt with berries and granola",
        "Whole grain toast with almond butter",
        "Smoothie with spinach, banana, and protein powder"
      ];
      meals.lunch.items = [
        "Quinoa bowl with roasted vegetables and tahini",
        "Hummus with whole wheat pita",
        "Side salad with balsamic vinaigrette"
      ];
      meals.dinner.items = [
        "Lentil curry with brown rice",
        "Roasted sweet potatoes",
        "Steamed broccoli"
      ];
      meals.snacks.items = [
        "Apple slices with peanut butter",
        "Handful of mixed nuts",
        "Cottage cheese with pineapple"
      ];
    } else {
      // Default balanced diet
      meals.breakfast.items = [
        "Oatmeal with banana and walnuts",
        "2 boiled eggs",
        "1 cup Greek yogurt"
      ];
      meals.lunch.items = [
        "Grilled chicken with quinoa and steamed vegetables",
        "Mixed green salad with olive oil",
        "1 whole grain roll"
      ];
      meals.dinner.items = [
        "Lean steak with roasted potatoes",
        "Grilled zucchini and eggplant",
        "Side of brown rice"
      ];
      meals.snacks.items = [
        "Protein shake",
        "Handful of almonds",
        "Carrot sticks with hummus"
      ];
    }

    return meals;
  };

  const mealPlan = generateMealPlan();

  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Background with image */}
        <div 
          className="flex-grow bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://wallpapercave.com/wp/wp12425019.jpg')",
            minHeight: '100vh'
          }}
        >
          <Navbar />
          <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-160px)] bg-black bg-opacity-70">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg mx-4 max-w-md">
              <h1 className="text-2xl font-bold mb-4">No User Data Found</h1>
              <p className="mb-4">Please complete the nutrition form first.</p>
              <a 
                href="/UserForm" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Go to Nutrition Form
              </a>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('https://wallpapercave.com/wp/wp12425019.jpg')"
      }}
    >
      <Navbar />
      <div className="pt-20"></div>
      
      {/* Main Content with semi-transparent overlay */}
      <main className="flex-grow bg-black bg-opacity-70">
        <div className="container mx-auto px-4 py-12">
          {/* User Summary */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h1 className="text-3xl font-bold">Your Personalized Meal Plan</h1>
              <p className="opacity-90 mt-2">Based on your health goals and preferences</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-2">Daily Calories</h3>
                <p className="text-2xl font-bold">{userData.calories}</p>
                <p className="text-sm text-gray-600">kcal per day</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">Protein</h3>
                <p className="text-2xl font-bold">{userData.macros.protein}g</p>
                <p className="text-sm text-gray-600">per day</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-800 mb-2">Carbs</h3>
                <p className="text-2xl font-bold">{userData.macros.carbs}g</p>
                <p className="text-sm text-gray-600">per day</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 mb-2">Fats</h3>
                <p className="text-2xl font-bold">{userData.macros.fats}g</p>
                <p className="text-sm text-gray-600">per day</p>
              </div>
            </div>
            
            <div className="p-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">Your Profile</h3>
                  <ul className="space-y-2">
                    <li><span className="font-medium">Age:</span> {userData.age}</li>
                    <li><span className="font-medium">Weight:</span> {userData.weight} kg</li>
                    <li><span className="font-medium">Height:</span> {userData.height} cm</li>
                    <li><span className="font-medium">BMI:</span> {userData.bmi} ({userData.bmiCategory})</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Preferences</h3>
                  <ul className="space-y-2">
                    <li><span className="font-medium">Activity Level:</span> {userData.activityLevel.replace('_', ' ')}</li>
                    <li><span className="font-medium">Goal:</span> {userData.goal.replace('_', ' ')}</li>
                    <li><span className="font-medium">Diet Type:</span> {userData.dietType.replace('_', ' ')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mealPlan && Object.keys(mealPlan).map((mealKey) => (
              <div key={mealKey} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-500 p-4 text-white">
                  <h2 className="text-xl font-bold">{mealPlan[mealKey].title}</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {mealPlan[mealKey].items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block bg-green-100 text-green-800 rounded-full p-1 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {mealKey === 'breakfast' && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2">Nutrition Tip</h4>
                      <p>Start your day with protein to maintain energy levels and reduce cravings throughout the day.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Plan Button */}
          <div className="mt-12 text-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Generate Weekly Plan
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MealPlan;