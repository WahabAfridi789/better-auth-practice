import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormInput } from './form-input';
import { FormTextarea } from './form-textarea';
import { FormSelect } from './form-select';
import { FormCheckbox } from './form-checkbox';
import { FormPasswordInput } from './form-password-input';
import { FormSwitch } from './form-switch';
import { FormFileUpload } from './form-file-upload';
import { FormDatePicker } from './form-date-picker';
import { FormMultiSelect } from './form-multi-select';

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    PasswordInput: FormPasswordInput,
    Switch: FormSwitch,
    FileUpload: FormFileUpload,
    DatePicker: FormDatePicker,
    MultiSelect: FormMultiSelect,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
