import React from 'react';

const MealDashboard = ({ userType }) => {
  // Sample data for dashboard
  const appointments = [
    { id: 1, customer: 'John Doe', date: '2023-06-15', time: '10:30 AM', status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', date: '2023-06-15', time: '02:00 PM', status: 'Confirmed' },
    { id: 3, customer: 'Robert Johnson', date: '2023-06-16', time: '09:00 AM', status: 'Pending' }
  ];

  const mealPlans = [
    { id: 1, customer: 'John Doe', goal: 'Weight Loss', dietType: 'Balanced', created: '2023-06-10' },
    { id: 2, customer: 'Jane Smith', goal: 'Muscle Gain', dietType: 'High Protein', created: '2023-06-12' },
    { id: 3, customer: 'Robert Johnson', goal: 'Maintenance', dietType: 'Keto', created: '2023-06-14' }
  ];

  const nutritionists = [
    { id: 1, name: 'Dr. Sarah Johnson', appointments: 12, specialization: 'Weight Management' },
    { id: 2, name: 'Dr. Michael Chen', appointments: 8, specialization: 'Sports Nutrition' },
    { id: 3, name: 'Dr. Emily Wilson', appointments: 15, specialization: 'Plant-Based Diets' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>
        {userType === 'nutritionist' ? 'Nutritionist Dashboard' : 'Manager Dashboard'}
      </h1>

      {userType === 'nutritionist' ? (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              Upcoming Appointments
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Customer</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appointment => (
                    <tr key={appointment.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{appointment.customer}</td>
                      <td style={{ padding: '1rem' }}>{appointment.date}</td>
                      <td style={{ padding: '1rem' }}>{appointment.time}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: appointment.status === 'Confirmed' ? '#d4edda' : '#fff3cd',
                          color: appointment.status === 'Confirmed' ? '#155724' : '#856404',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.9rem'
                        }}>
                          {appointment.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button style={{
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '0.5rem'
                        }}>
                          View
                        </button>
                        <button style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                          Reschedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              Recent Meal Plans
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              {mealPlans.map(plan => (
                <div key={plan.id} style={{
                  flex: '1 1 300px',
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{plan.customer}</h3>
                  <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}><strong>Goal:</strong> {plan.goal}</p>
                  <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}><strong>Diet Type:</strong> {plan.dietType}</p>
                  <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}><strong>Created:</strong> {plan.created}</p>
                  <button style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
              Nutritionist Management
            </h2>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>+</span> Add Nutritionist
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Specialization</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Appointments</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nutritionists.map(nutritionist => (
                    <tr key={nutritionist.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{nutritionist.name}</td>
                      <td style={{ padding: '1rem' }}>{nutritionist.specialization}</td>
                      <td style={{ padding: '1rem' }}>{nutritionist.appointments}</td>
                      <td style={{ padding: '1rem' }}>
                        <button style={{
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '0.5rem'
                        }}>
                          View Schedule
                        </button>
                        <button style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              flex: '1',
              backgroundColor: '#e8f4fc',
              padding: '1.5rem',
              borderRadius: '8px',
              minWidth: '300px'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Total Customers</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3498db', marginBottom: '1rem' }}>1,248</p>
              <p style={{ color: '#7f8c8d' }}>+12% from last month</p>
            </div>

            <div style={{
              flex: '1',
              backgroundColor: '#e5f6fd',
              padding: '1.5rem',
              borderRadius: '8px',
              minWidth: '300px'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Active Meal Plans</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2ecc71', marginBottom: '1rem' }}>856</p>
              <p style={{ color: '#7f8c8d' }}>+8% from last month</p>
            </div>

            <div style={{
              flex: '1',
              backgroundColor: '#fef5e7',
              padding: '1.5rem',
              borderRadius: '8px',
              minWidth: '300px'
            }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Upcoming Appointments</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e67e22', marginBottom: '1rem' }}>94</p>
              <p style={{ color: '#7f8c8d' }}>Next 7 days</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MealDashboard;