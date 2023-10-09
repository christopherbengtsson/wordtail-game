import { Input } from '..';
import type { FieldProps } from 'formik';
import { ErrorLabel } from './ErrorLabel';

export function FormInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  type,
  ...props
}: FieldProps & { type: string }) {
  return (
    <div className="customFormikInput">
      <Input
        {...field}
        {...props}
        type={type}
        value={isNaN(field.value) && type === 'number' ? '' : field.value}
      />
      {touched[field.name] && errors[field.name] && (
        <ErrorLabel value={errors[field.name]} />
      )}
    </div>
  );
}
