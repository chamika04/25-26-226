import React, { useState } from 'react';

const NutritionistBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Sample nutritionists data
  const nutritionists = [
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Weight Management', rating: 4.8 },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Sports Nutrition', rating: 4.6 },
    { id: 3, name: 'Dr. Emily Wilson', specialization: 'Plant-Based Diets', rating: 4.9 }
  ];

  // Sample available time slots
  const availableTimes = [
    '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    setBookingSuccess(true);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem', textAlign: 'center' }}>Book a Nutritionist</h1>
      
      {bookingSuccess ? (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Booking Confirmed!</h2>
          <p>Your appointment with the nutritionist has been scheduled for {selectedDate} at {selectedTime}.</p>
          <p>You will receive a confirmation email with the details.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Available Nutritionists</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {nutritionists.map(nutritionist => (
                <div key={nutritionist.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div>
                    <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{nutritionist.name}</h3>
                    <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>{nutritionist.specialization}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#f39c12', marginRight: '0.5rem' }}>★ {nutritionist.rating}</span>
                      <span style={{ color: '#7f8c8d' }}>(120 reviews)</span>
                    </div>
                  </div>
                  <button style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleBooking}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Schedule Appointment</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7f8c8d' }}>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {selectedDate && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7f8c8d' }}>Available Time Slots</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {availableTimes.map((time, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '0.6rem 1rem',
                        backgroundColor: selectedTime === time ? '#3498db' : '#f8f9fa',
                        color: selectedTime === time ? 'white' : '#2c3e50',
                        border: `1px solid ${selectedTime === time ? '#3498db' : '#ddd'}`,
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7f8c8d' }}>Special Requests</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  minHeight: '100px'
                }}
                placeholder="Any dietary restrictions, allergies, or specific concerns you'd like the nutritionist to know about..."
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: (!selectedDate || !selectedTime) ? 0.7 : 1,
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#c0392b')}
              onMouseOut={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#e74c3c')}
            >
              Confirm Booking
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default NutritionistBooking;
