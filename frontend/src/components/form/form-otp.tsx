import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FormBase, FormControlProps } from './form-base';
import { useFieldContext } from './hooks';

export type FormOTPProps = FormControlProps & {
  length?: number;
};

export function FormOTP({ length = 6, ...props }: FormOTPProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <div className="flex justify-center">
        <InputOTP
          maxLength={length}
          value={field.state.value}
          onChange={(value) => {
            field.handleChange(value);
          }}
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          disabled={props.disabled}
        >
          <InputOTPGroup>
            {Array.from({ length }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
    </FormBase>
  );
}
