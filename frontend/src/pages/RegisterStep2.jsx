import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const RegisterStep2 = ({ formData }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/users/verify-otp', { ...formData, otp });
      alert('Registration successful! Awaiting admin approval.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Step 2: Verify OTP</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleVerify}>
        <div className="mb-4">
          <label className="block text-sm font-medium">OTP Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Verify & Register
        </button>
      </form>
    </div>
  );
};

export default RegisterStep2;
