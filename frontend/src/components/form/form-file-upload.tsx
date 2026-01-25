'use client';

import { useFieldContext } from './hooks';
import { FormBase, FormControlProps } from './form-base';
import { FileUploader } from '@/components/file-uploader';

interface FormFileUploadProps extends FormControlProps {
  /**
   * Accepted file types
   * @example acceptedTypes={{ 'image/*': [] }}
   */
  acceptedTypes?: Record<string, string[]>;

  /**
   * Maximum file size in bytes
   * @default 1024 * 1024 * 2 (2MB)
   */
  maxSize?: number;

  /**
   * Maximum number of files
   * @default 1
   */
  maxFiles?: number;

  /**
   * Whether to accept multiple files
   * @default false
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Upload progress for each file
   * @example progresses={{ 'file1.png': 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Function to be called when files are uploaded
   */
  onUpload?: (files: File[]) => Promise<void>;
}

export function FormFileUpload(props: FormFileUploadProps) {
  const {
    acceptedTypes,
    maxSize = 1024 * 1024 * 2, // 2MB default
    maxFiles = 1,
    multiple = false,
    disabled = false,
    progresses,
    onUpload,
    ...baseProps
  } = props;

  const field = useFieldContext<File[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...baseProps}>
      <FileUploader
        value={field.state.value}
        onValueChange={(files) => field.handleChange(files)}
        onUpload={onUpload}
        progresses={progresses}
        accept={acceptedTypes}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled}
        aria-invalid={isInvalid}
      />
    </FormBase>
  );
}
