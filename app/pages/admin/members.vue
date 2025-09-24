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
          <div class="flex flex-col sm:flex-row sm: justify-between gap-4">
            <div>
              <p class="font-medium text-gray-900">{{ member.fullname }}</p>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
              <p class="text-sm text-gray-500">
                {{ new Date(member.createdAt).toLocaleDateString() }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UBadge
                :color="
                  member.status === 'pending'
                    ? 'warning'
                    : member.status === 'approved'
                    ? 'success'
                    : 'error'
                "
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
  <pre>
  {{ data }}
  </pre>
</template>

<script setup>
import { UCard, UTable, UBadge, UDropdownMenu, UButton } from "#components";

definePageMeta({
  layout: "default",
});

const { data } = await useAsyncData("members", () =>
  $fetch("/api/users", {
    query: { role: "member", page: 1, limit: 10 },
  })
);

const members = computed(() => data.value?.data || []);

const handleApprove = (id) => {
  // TODO: Connect to /admin/members/:id/approve API
  console.log("Approve member:", id);
  alert("Member approved!");
};

const handleReject = (id) => {
  // TODO: Connect to /admin/members/:id/reject API
  console.log("Reject member:", id);
  alert("Member rejected!");
};
</script>
