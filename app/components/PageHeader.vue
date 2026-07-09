<template>
  <div class="mb-6">
    <UBreadcrumb
      v-if="breadcrumb && breadcrumb.length"
      :items="breadcrumb"
      class="mb-3"
    />
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <span
            v-if="icon"
            class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <UIcon :name="icon" class="size-5" />
          </span>
          <h1
            class="text-2xl sm:text-[26px] font-bold tracking-tight text-highlighted"
          >
            {{ title }}
          </h1>
        </div>
        <p v-if="description" class="mt-1.5 text-sm text-muted">
          {{ description }}
        </p>
      </div>

      <div
        v-if="$slots.actions"
        class="flex flex-wrap items-center gap-2 shrink-0"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui";

defineProps<{
  title: string;
  description?: string;
  icon?: string;
  breadcrumb?: BreadcrumbItem[];
}>();
</script>
