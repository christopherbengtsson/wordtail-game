import type { FieldProps } from 'formik';
import { Select } from '..';

export function FormSelect({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps) {
  return (
    <div className="customFormikInput">
      <Select
        {...field}
        {...props}
        tabIndex={0}
        onChange={(option) => setFieldValue(field.name, option)} // The first parameter of React-Select's onChange is an option value while the first parameter of formik's handleChange is an event
      />
      {touched[field.name] && errors[field.name] && (
        <p className="error">{`${errors[field.name]}`}</p>
      )}
    </div>
  );
}
