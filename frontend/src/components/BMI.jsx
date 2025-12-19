import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BMI() {
  const [weight, setWeight] = useState('');
  const [weightlb, setWeightlb] = useState('');
  const [weightkg, setWeightkg] = useState('');
  const [heightin, setHeightin] = useState('');
  const [heightcm, setHeightcm] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [message, setMessage] = useState('');

  const calcBmi = (event) => {
    event.preventDefault();
    
    if (!weight || !height) {
      alert('Please enter valid weight and height');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    if (weightNum <= 0 || heightNum <= 0) {
      alert('Weight and height must be positive numbers');
      return;
    }

    const bmiValue = (weightNum / (heightNum * heightNum) * 10000);
    setBmi(bmiValue.toFixed(1));

    if (bmiValue < 18.5) {
      setMessage('You are underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setMessage('You are at a healthy weight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setMessage('You are overweight');
    } else {
      setMessage('You are obese');
    }
  };

  const calcWei = (event) => {
    event.preventDefault();
    
    if (!weightlb) {
      alert('Please enter a valid weight');
      return;
    }

    const weightNum = parseFloat(weightlb);
    if (weightNum <= 0) {
      alert('Weight must be a positive number');
      return;
    }

    setWeightkg((weightNum * 0.453592).toFixed(1));
  };

  const calcHei = (event) => {
    event.preventDefault();
    
    if (!heightin) {
      alert('Please enter a valid height');
      return;
    }

    const heightNum = parseFloat(heightin);
    if (heightNum <= 0) {
      alert('Height must be a positive number');
      return;
    }

    setHeightcm((heightNum * 2.54).toFixed(2));
  };

  const reload = () => {
    setWeight('');
    setWeightlb('');
    setWeightkg('');
    setHeightin('');
    setHeightcm('');
    setHeight('');
    setBmi('');
    setMessage('');
  };

  const getBmiCategory = () => {
    if (!bmi) return '';
    const bmiNum = parseFloat(bmi);
    
    if (bmiNum < 18.5) return 'Underweight';
    if (bmiNum < 25) return 'Normal weight';
    if (bmiNum < 30) return 'Overweight';
    return 'Obese';
  };

  const getBmiColor = () => {
    if (!bmi) return 'gray';
    const bmiNum = parseFloat(bmi);
    
    if (bmiNum < 18.5) return 'text-blue-600';
    if (bmiNum < 25) return 'text-green-600';
    if (bmiNum < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-20"></div>
      
    {/* Main Content */}
    <main className="flex-grow bg-cover bg-center bg-fixed py-12"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg')`
        }}
      >

      {/* Hero Section */}
      <div className="bg-black bg-opacity-40 text-white py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">BMI Calculator</h1>
        <p className="text-lg">Calculate your Body Mass Index and check your weight status</p>
      </div>

      
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* BMI Calculator */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden">
              <div className="bg-blue-600 text-white py-3 px-6">
                <h2 className="text-xl font-bold">BMI Calculator</h2>
              </div>
              <div className="p-6">
                <form onSubmit={calcBmi}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Enter weight in kg"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter height in cm"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                      Calculate
                    </button>
                    <button
                      type="button"
                      onClick={reload}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                      Clear
                    </button>
                  </div>
                </form>

                {bmi && (
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Your Results</h3>
                    <p className="text-lg mb-1">BMI: <span className={`font-bold ${getBmiColor()}`}>{bmi}</span></p>
                    <p className="text-lg mb-1">Category: <span className={`font-bold ${getBmiColor()}`}>{getBmiCategory()}</span></p>
                    <p className="text-gray-700">{message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Weight Converter */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-6">
                <h2 className="text-xl font-bold">Weight Converter</h2>
              </div>
              <div className="p-6">
                <form onSubmit={calcWei}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Pounds (lbs)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={weightlb}
                      onChange={(e) => setWeightlb(e.target.value)}
                      placeholder="Enter weight in lbs"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Kilograms (kg)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                      value={weightkg}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                      Convert
                    </button>
                    <button
                      type="button"
                      onClick={reload}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Height Converter */}
            <div className="bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden">
              <div className="bg-purple-600 text-white py-3 px-6">
                <h2 className="text-xl font-bold">Height Converter</h2>
              </div>
              <div className="p-6">
                <form onSubmit={calcHei}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Inches (in)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={heightin}
                      onChange={(e) => setHeightin(e.target.value)}
                      placeholder="Enter height in inches"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Centimeters (cm)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                      value={heightcm}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                      Convert
                    </button>
                    <button
                      type="button"
                      onClick={reload}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BMI;