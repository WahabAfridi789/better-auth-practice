'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useFieldContext } from './hooks';
import { FormBase, FormControlProps } from './form-base';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FormDatePickerProps extends FormControlProps {
  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Array of dates to disable
   */
  disabledDates?: Date[];

  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Date format string
   * @default 'PPP'
   */
  dateFormat?: string;
}

export function FormDatePicker(props: FormDatePickerProps) {
  const {
    minDate,
    maxDate,
    disabledDates = [],
    disabled = false,
    dateFormat = 'PPP',
    placeHolder = 'Pick a date',
    ...baseProps
  } = props;

  const field = useFieldContext<Date>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...baseProps}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            className={`w-full pl-3 text-left font-normal ${
              !field.state.value && 'text-muted-foreground'
            }`}
            disabled={disabled}
            aria-invalid={isInvalid}
          >
            {field.state.value ? format(field.state.value, dateFormat) : <span>{placeHolder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(date) => {
              if (date) {
                field.handleChange(date);
              }
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return disabledDates.some(
                (disabledDate) => date.getTime() === disabledDate.getTime()
              );
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}
