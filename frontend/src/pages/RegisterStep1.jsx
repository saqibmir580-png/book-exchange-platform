import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // ← Make sure to import Link
import axios from '../api/axios';

const RegisterStep1 = ({ onNext }) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const { name, email, password, phone } = data; // ← Destructure form values

  const handleChange = e =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSendOTP = async e => {
    e.preventDefault(); // ← Prevent default form submission
    setError('');
    try {
      await axios.post('/users/send-otp', { email });
      onNext(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSendOTP}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500"
              placeholder="e.g. +918080901234"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
          >
            Send OTP & Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStep1;
