import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserForm = ({ setUserData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'weight_loss',
    dietType: 'balanced'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.age || !formData.weight || !formData.height) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert strings to numbers
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    // Validate number ranges
    if (age < 18 || age > 100) {
      alert('Please enter a valid age between 18 and 100');
      return;
    }
    if (weight < 40 || weight > 200) {
      alert('Please enter a valid weight between 40kg and 200kg');
      return;
    }
    if (height < 140 || height > 220) {
      alert('Please enter a valid height between 140cm and 220cm');
      return;
    }

    // Calculate BMI and other metrics
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    // Calculate daily calories based on Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    };

    // Goal adjustments
    const goalAdjustments = {
      weight_loss: -300,
      maintenance: 0,
      muscle_gain: 300
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel] + goalAdjustments[formData.goal];
    const calories = Math.round(tdee);

    // Macronutrient distribution
    const macros = calculateMacros(calories, formData.goal, formData.dietType, weight);

    // Create complete user data
    const completeUserData = {
      ...formData,
      age,
      weight,
      height,
      bmi,
      bmiCategory: getBmiCategory(bmi),
      calories,
      macros
    };

    // Set the user data and navigate
    if (typeof setUserData === 'function') {
      setUserData(completeUserData);
      navigate('/MealPlan');
    } navigate('/MealPlan', { state: { userData: completeUserData } });
  };

  const getBmiCategory = (bmi) => {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return 'Underweight';
    if (bmiNum < 25) return 'Normal weight';
    if (bmiNum < 30) return 'Overweight';
    return 'Obese';
  };

  const calculateMacros = (calories, goal, dietType, weight) => {
    // Base protein needs (grams per kg of body weight)
    const proteinPerKg = {
      weight_loss: 2.2,
      maintenance: 1.6,
      muscle_gain: 2.2
    };
    
    const proteinG = Math.round(weight * proteinPerKg[goal]);
    const proteinCal = proteinG * 4;
    
    // Fat calculation (25-35% of calories)
    const fatCal = Math.round(calories * 0.3);
    const fatG = Math.round(fatCal / 9);
    
    // Remaining calories go to carbs
    const carbCal = calories - proteinCal - fatCal;
    const carbG = Math.round(carbCal / 4);
    
    // Adjust for special diet types
    if (dietType === 'keto') {
      return {
        protein: proteinG,
        carbs: 20,
        fats: Math.round((calories - proteinCal - 80) / 9)
      };
    } else if (dietType === 'low_carb') {
      return {
        protein: proteinG,
        carbs: Math.round(carbG * 0.5),
        fats: Math.round(fatG * 1.2)
      };
    }
    
    return {
      protein: proteinG,
      carbs: carbG,
      fats: fatG
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://wallpapercave.com/wp/wp13630257.jpg')"
        }}
      >
        <div className="w-full h-full bg-black bg-opacity-50 backdrop-blur-sm py-12 px-4">
          <div className="max-w-2xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-center">
              <h1 className="text-3xl font-bold text-white">Personalized Nutrition Plan</h1>
              <p className="text-white opacity-90 mt-2">Fill in your details to get a customized meal plan</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="18"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    min="40"
                    max="200"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    min="140"
                    max="220"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Activity Level */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="lightly_active">Lightly active (light exercise 1-3 days/week)</option>
                    <option value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</option>
                    <option value="very_active">Very active (hard exercise 6-7 days/week)</option>
                  </select>
                </div>

                {/* Fitness Goal */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Fitness Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Gain</option>
                  </select>
                </div>

                {/* Diet Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Diet Type</label>
                  <select
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="keto">Keto</option>
                    <option value="low_carb">Low Carb</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Generate Meal Plan
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserForm;