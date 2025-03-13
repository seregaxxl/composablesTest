<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in fields" :key="field">
      <label :for="field">{{ field }}</label>
      <input
        :id="field"
        v-model="formData[field]"
        @input="validateField(field, formData[field])"
      />
      <span v-if="!formState.fields[field].isValid" class="error">
        {{ formState.fields[field].errors.join(', ') }}
      </span>
    </div>
    <button type="submit" :disabled="!formState.isValid">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormValidation } from '../composables/useFormValidation';

const rules = {
  username: [
    (value: string) => (value.length >= 3 ? true : 'Username must be at least 3 characters'),
  ],
  email: [
    (value: string) => (value.includes('@') ? true : 'Email must contain @'),
  ],
  password: [
    (value: string) => (value.length >= 6 ? true : 'Password must be at least 6 characters'),
  ],
  phone: [
    (value: string) => (value.length >= 7 ? true : 'phone must be at least 7 characters'),
  ],
};
const {fields} = useFormValidation(rules)

const { formState, validateField, validateForm } = useFormValidation(rules);

const formData = ref<Record<string, any>>({});
fields.forEach((field) => {
  formData.value[field] = ''; 
});

const handleSubmit = () => {
  validateForm(formData.value);
  if (formState.value.isValid) {
    console.log('Form is valid, submitting...', formData.value);
  } else {
    console.log('Form is invalid');
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
}
</style>