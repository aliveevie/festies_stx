import { useState, useCallback } from 'react';

/**
 * useForm Hook
 * Hook for managing form state, validation, and submission
 */
const useForm = ({
  initialValues = {},
  validate = null,
  onSubmit = null,
  validateOnChange = true,
  validateOnBlur = true,
} = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (validateOnChange && validate) {
      const validationErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name] || null,
      }));
    }
  }, [values, validate, validateOnChange]);

  const setError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setFieldValue = useCallback(
    (name, value) => {
      setValue(name, value);
    },
    [setValue]
  );

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));

    if (isTouched && validateOnBlur && validate) {
      const validationErrors = validate(values);
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name] || null,
      }));
    }
  }, [values, validate, validateOnBlur]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      setValue(name, newValue);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setFieldTouched(name, true);
    },
    [setFieldTouched]
  );

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );

    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }

      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit?.(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const resetField = useCallback((name) => {
    setValue(name, initialValues[name]);
    setError(name, null);
    setFieldTouched(name, false);
  }, [initialValues, setValue, setError, setFieldTouched]);

  const getFieldProps = useCallback(
    (name) => ({
      name,
      value: values[name] ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: touched[name] ? errors[name] : null,
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setError,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    resetForm,
    resetField,
    getFieldProps,
  };
};

export default useForm;
// Style improvement
// Performance optimization
// Refactor improvement
// Additional style improvement
// Documentation update
