import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useState } from 'react';
import { Icons } from '../icons';
import { FormBase, FormControlProps } from './form-base';
import { useFieldContext } from './hooks';

export function FormPasswordInput(props: FormControlProps) {
  const field = useFieldContext<string>();
  const [showPassword, setShowPassword] = useState(false);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <InputGroup>
        <InputGroupInput
          placeholder={props.placeHolder || 'Enter your password'}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          type={showPassword ? 'text' : 'password'}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Icons.EyeSlash /> : <Icons.Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FormBase>
  );
}
