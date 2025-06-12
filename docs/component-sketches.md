# 🧩 Component Sketches - Lumbung Mesari (Volt UI)

This document provides implementation examples and patterns for using Volt UI components in the Lumbung Mesari application.

---

## 🎯 Component Usage Examples

### Buttons
```vue
<template>
  <div class="flex gap-4">
    <Button label="Primary Action" />
    <SecondaryButton label="Secondary" />
    <DangerButton label="Delete" />
    <ContrastButton label="Cancel" />
  </div>
</template>

<script setup>
import Button from '@/src/volt/Button.vue';
import SecondaryButton from '@/src/volt/SecondaryButton.vue';
import DangerButton from '@/src/volt/DangerButton.vue';
import ContrastButton from '@/src/volt/ContrastButton.vue';
</script>
```

### Form with Validation
```vue
<template>
  <Card>
    <template #title>New Transaction</template>
    <template #content>
      <FormField label="Amount" :error="errors.amount">
        <InputNumber 
          v-model="form.amount" 
          mode="currency" 
          currency="IDR" 
          :class="{ 'p-invalid': errors.amount }"
        />
      </FormField>
      
      <FormField label="Transaction Type" class="mt-4">
        <Select 
          v-model="form.type" 
          :options="['Deposit', 'Withdraw']" 
          placeholder="Select type"
        />
      </FormField>
      
      <div class="flex justify-end gap-3 mt-6">
        <ContrastButton label="Cancel" @click="onCancel" />
        <Button 
          label="Submit" 
          :loading="isSubmitting" 
          @click="handleSubmit" 
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import Card from '@/src/volt/Card.vue';
import Button from '@/src/volt/Button.vue';
import ContrastButton from '@/src/volt/ContrastButton.vue';
import InputNumber from '@/src/volt/InputNumber.vue';
import Select from '@/src/volt/Select.vue';
import FormField from '@/components/ui/FormField.vue';

const form = ref({
  amount: null,
  type: ''
});

const errors = ref({});
const isSubmitting = ref(false);

async function handleSubmit() {
  // Form submission logic
}

function onCancel() {
  // Handle cancel
}
</script>
```

### Status Badge
```vue
<template>
  <div class="flex items-center gap-2">
    <span>Status:</span>
    <Badge 
      :value="statusLabel" 
      :severity="statusSeverity" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Badge from '@/src/volt/Badge.vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['pending', 'approved', 'rejected'].includes(value)
  }
});

const statusMap = {
  pending: { label: 'Pending', severity: 'warning' },
  approved: { label: 'Approved', severity: 'success' },
  rejected: { label: 'Rejected', severity: 'danger' }
};

const statusLabel = computed(() => statusMap[props.status]?.label || props.status);
const statusSeverity = computed(() => statusMap[props.status]?.severity || 'info');
</script>
```

---

## 🏗️ Page Layouts

### Dashboard Layout
```vue
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <Button 
        label="New Transaction" 
        icon="pi pi-plus" 
        @click="showTransactionModal = true" 
      />
    </div>
    
    <div class="grid gap-6 md:grid-cols-3">
      <Card v-for="stat in stats" :key="stat.label">
        <template #title>{{ stat.label }}</template>
        <template #content>
          <p class="text-2xl font-semibold">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ stat.change }}</p>
        </template>
      </Card>
    </div>
    
    <Card>
      <template #title>Recent Transactions</template>
      <template #content>
        <DataTable :value="transactions" :rows="5" paginator>
          <Column field="date" header="Date" />
          <Column field="description" header="Description" />
          <Column field="amount" header="Amount" />
          <Column field="status" header="Status">
            <template #body="{ data }">
              <StatusBadge :status="data.status" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>
```

---

## 🎨 Styling Guidelines

1. **Spacing**: Use Tailwind's spacing scale (e.g., `p-4`, `mb-6`, `space-y-4`)
2. **Colors**: Use semantic color classes from Volt UI (e.g., `text-primary`, `bg-success`)
3. **Responsive**: Use responsive prefixes (e.g., `md:grid-cols-2`, `lg:flex`)
4. **Dark Mode**: Components automatically support dark mode

## 🔧 Best Practices

1. **Component Imports**:
   ```javascript
   // Good
   import Button from '@/src/volt/Button.vue';
   
   // Avoid
   import { Button } from '@/src/volt';
   ```

2. **Form Handling**:
   - Use `v-model` for two-way binding
   - Implement proper validation
   - Show loading states during submission

3. **State Management**:
   - Use Pinia for global state
   - Keep component state local when possible
   - Use composables for reusable logic

---

> ✍️ Update this document as new patterns and components are added to the system.
