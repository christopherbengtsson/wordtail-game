import type { FieldProps } from 'formik';
import { Select, SelectNative } from 'react95';
import { useTheme } from 'styled-components';

const options = [
  { value: 'one', label: 'Some label 1' },
  { value: 'two', label: 'Some label 2' },
  { value: 'three', label: 'Some label 3' },
  { value: 'four', label: 'Some label 4' },
  { value: 'five', label: 'Some label 5' },
];

export function FormSelect({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps) {
  const theme = useTheme(); // TODO: Couldn't the select work with styled components

  return (
    <div className="customFormikInput">
      <Select
        {...field}
        {...props}
        tabIndex={0}
        menuMaxHeight={135}
        style={{ height: theme.sizes.buttonHeight }}
      />
      {touched[field.name] && errors[field.name] && (
        <p className="error">{`${errors[field.name]}`}</p>
      )}
    </div>
  );
}

// const Select = forwardRef(SelectInner) as <T>(
//   props: SelectProps<T> & { ref?: React.ForwardedRef<SelectRef> }
// ) => ReturnType<typeof SelectInner<T>>;
