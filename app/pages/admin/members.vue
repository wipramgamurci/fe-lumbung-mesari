<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Member Management</h1>
    <UCard>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Pending Approvals</h2>
        <span class="text-sm text-gray-600">{{ members.length }} members</span>
      </div>
      
      <div class="space-y-4">
        <UCard v-for="member in members" :key="member.id">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900">{{ member.name }}</p>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
              <p class="text-sm text-gray-500">{{ new Date(member.createdAt).toLocaleDateString() }}</p>
            </div>
            
            <div class="flex items-center space-x-4">
              <UBadge 
                :color="member.status === 'pending' ? 'warning' : member.status === 'approved' ? 'success' : 'error'"
                variant="solid"
              >
                {{ member.status }}
              </UBadge>
              
              <template v-if="member.status === 'pending'">
                <UButton 
                  color="success" 
                  size="sm" 
                  icon="i-heroicons-check-circle"
                  @click="handleApprove(member.id)"
                >
                  Approve
                </UButton>
                
                <UButton 
                  color="error" 
                  size="sm" 
                  icon="i-heroicons-x-circle"
                  @click="handleReject(member.id)"
                >
                  Reject
                </UButton>
              </template>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { UCard, UTable, UBadge, UDropdownMenu, UButton } from '#components'

definePageMeta({
  layout: 'default'
})

// Dummy data based on types-and-models.md
const members = ref([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    status: 'pending',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'member',
    status: 'approved',
    createdAt: '2024-01-13T09:20:00Z'
  }
])

const handleApprove = (id) => {
  // TODO: Connect to /admin/members/:id/approve API
  console.log('Approve member:', id)
  alert('Member approved!')
}

const handleReject = (id) => {
  // TODO: Connect to /admin/members/:id/reject API
  console.log('Reject member:', id)
  alert('Member rejected!')
}
</script>
