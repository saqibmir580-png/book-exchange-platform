import React, { useState } from 'react';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const nextStep = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  return step === 1 
    ? <RegisterStep1 onNext={nextStep} />
    : <RegisterStep2 formData={formData} />;
};

export default Register;
