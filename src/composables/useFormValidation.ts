import { ref, computed } from 'vue';

type Validator = (value: any) => string | boolean;

interface FieldValidationRules {
  [key: string]: Validator[]; 
}

interface FieldValidationState {
  isValid: boolean; 
  errors: string[]; 
}

interface FormValidationState {
  isValid: boolean; 
  fields: {
    [key: string]: FieldValidationState; 
  };
}

export function useFormValidation(rules: FieldValidationRules) {
  const formState = ref<FormValidationState>({
    isValid: false,
    fields: {},
  });

  const fields = Object.keys(rules);

  fields.forEach((field) => {
    formState.value.fields[field] = {
      isValid: true,
      errors: [],
    };
  });

  const validateField = (field: string, value: any) => {
    const fieldRules = rules[field] || [];
    const errors: string[] = [];

    fieldRules.forEach((validator) => {
      const result = validator(value);
      if (typeof result === 'string') {
        errors.push(result); 
      }
    });

    formState.value.fields[field] = {
      isValid: errors.length === 0,
      errors,
    };

    formState.value.isValid = Object.values(formState.value.fields).every(
      (fieldState) => fieldState.isValid
    );
  };

  const validateForm = (formData: Record<string, any>) => {
    fields.forEach((field) => {
      validateField(field, formData[field]);
    });
  };

  return {
    formState: computed(() => formState.value), 
    validateField, 
    validateForm, 
    fields
  };
}
