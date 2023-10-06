import { Input } from '..';
import type { FieldProps } from 'formik';
import { ErrorLabel } from './ErrorLabel';

export function FormInput({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps) {
  return (
    <div className="customFormikInput">
      <Input {...field} {...props} />
      {touched[field.name] && errors[field.name] && (
        <ErrorLabel value={errors[field.name]} />
      )}
    </div>
  );
}
