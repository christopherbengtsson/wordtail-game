import { Input } from '..';
import type { FieldProps } from 'formik';

export function FormInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps) {
  return (
    <div className="customFormikInput">
      <Input {...field} {...props} />
      {touched[field.name] && errors[field.name] && (
        <p className="error">{`${errors[field.name]}`}</p>
      )}
    </div>
  );
}
