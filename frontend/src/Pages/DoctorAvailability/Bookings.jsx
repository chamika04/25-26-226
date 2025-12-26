import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const BookingRequest = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    timeSlot: '',
    workoutType: '',
    packageType: '',
    status: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8070/bookings');
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/bookings/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking.');
    }
  };

  const approveBooking = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8070/bookings/approve/${id}`);
      if (response.status === 200) {
        setBookings(bookings.map(booking =>
          booking._id === id ? { ...booking, status: 'Confirmed' } : booking
        ));
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      setError('Failed to approve booking.');
    }
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setEditFormData({
      date: booking.date,
      timeSlot: booking.timeSlot,
      workoutType: booking.workoutType,
      packageType: booking.packageType,
      status: booking.status
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8070/bookings/${editingBooking._id}`,
        editFormData
      );
      if (response.status === 200) {
        setBookings(bookings.map(booking =>
          booking._id === editingBooking._id ? { ...booking, ...editFormData } : booking
        ));
        setEditingBooking(null);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking.');
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  const filteredBookings = searchQuery
    ? bookings.filter(booking =>
        booking.workoutType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.packageType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.timeSlot.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bookings;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      
      <div className="pt-20"></div>
      
      <div style={{ 
        backgroundImage: "url('https://wallpapercave.com/wp/wp13630257.jpg')", 
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        minHeight: "100vh",
        padding: "20px"
      }}>
        <div className="pt-20"></div>
        <div className="container mx-auto px-4 py-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Booking Schedule</h2>
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workout Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.timeSlot}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.workoutType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.packageType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(booking)}
                              disabled={booking.status === 'Confirmed'}
                              className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md ${
                                booking.status === 'Confirmed' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              
                            >
                              Edit
                            </button>
                            
                            <button
                              onClick={() => handleDelete(booking._id)}
                              disabled={booking.status === 'Confirmed'}
                              className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md ${
                                booking.status === 'Confirmed' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery ? 'No matching bookings found' : 'No bookings available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Booking</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <select
                  name="timeSlot"
                  value={editFormData.timeSlot}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="09:00AM - 10:00AM">09:00AM - 10:00AM</option>
                  <option value="10:00AM - 11:00AM">10:00AM - 11:00AM</option>
                  <option value="11:00AM - 12:00PM">11:00AM - 12:00PM</option>
                  <option value="01:00PM - 02:00PM">01:00PM - 02:00PM</option>
                  <option value="02:00PM - 03:00PM">02:00PM - 03:00PM</option>
                  <option value="03:00PM - 04:00PM">03:00PM - 04:00PM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Workout Type</label>
                <select
                  name="workoutType"
                  value={editFormData.workoutType}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="ZUMBA">ZUMBA</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Yoga">Yoga</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Aerobics">Aerobics</option>
                  <option value="Callisthenics">Callisthenics</option>
                  <option value="Body Weight training">Body Weight training</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Package</label>
                <select
                  name="packageType"
                  value={editFormData.packageType}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              
              
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingRequest;