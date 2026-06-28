import { useState } from 'react';

const useForm = (initial) => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(err => ({ ...err, [field]: '' }));
  };

  return { form, setForm, errors, setErrors, set };
};

export default useForm;
