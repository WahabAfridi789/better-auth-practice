'use client';

import { useFieldContext } from './hooks';
import { FormBase, FormControlProps } from './form-base';
import { MultiSelect } from '../ui/multi-select';

interface FormMultiSelectProps extends FormControlProps {
  /**
   * Options for the multi-select dropdown
   * @example options={[{ value: 'next.js', label: 'Next.js' }]}
   */
  options: Array<{ value: string; label: string }>;

  /**
   * Placeholder text when no items are selected
   * @default "Select items..."
   */
  placeHolder?: string;

  /**
   * Whether the multi-select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Maximum number of items that can be selected
   */
  maxCount?: number;
}

export function FormMultiSelect(props: FormMultiSelectProps) {
  const {
    options,
    placeHolder = 'Select items...',
    disabled = false,
    maxCount,
    ...baseProps
  } = props;

  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...baseProps}>
      <MultiSelect
        options={options}
        value={field.state.value || []}
        onValueChange={(value) => field.handleChange(value)}
        placeholder={placeHolder}
        disabled={disabled}
        maxCount={maxCount}
        aria-invalid={isInvalid}
        modalPopover={true}
        className=""
      />
    </FormBase>
  );
}
