<template>
  <UModal
    v-model:open="open"
    :title="$t('dashboard.cashbookReportModalTitle')"
    :description="$t('dashboard.cashbookReportModalDescription')"
  >
    <template #body>
      <div class="flex gap-2">
        <USelect
          v-model="selectedMonth"
          :items="monthOptions"
          value-key="value"
          :placeholder="$t('loan.selectMonth')"
          class="w-32"
        />
        <USelect
          v-model="selectedYear"
          :items="yearOptions"
          value-key="value"
          :placeholder="$t('loan.selectYear')"
          class="w-24"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="outline"
          :disabled="isDownloading"
          @click="open = false"
        >
          {{ $t("common.cancel") }}
        </UButton>
        <UButton
          color="primary"
          :loading="isDownloading"
          :disabled="!selectedMonth || !selectedYear"
          @click="downloadReport"
        >
          {{ $t("common.downloadReport") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { downloadBlobReport } from "~~/utils/downloadBlob";

const open = defineModel<boolean>("open", { default: false });

const config = useRuntimeConfig();
const currentYear = new Date().getFullYear();
const startYear = config.public.startYear as number;
const yearsCount = Math.max(1, currentYear - startYear + 1);

const yearOptions = Array.from({ length: yearsCount }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}));

const monthOptions = [
  { label: $t("common.monthNames.january"), value: 1 },
  { label: $t("common.monthNames.february"), value: 2 },
  { label: $t("common.monthNames.march"), value: 3 },
  { label: $t("common.monthNames.april"), value: 4 },
  { label: $t("common.monthNames.may"), value: 5 },
  { label: $t("common.monthNames.june"), value: 6 },
  { label: $t("common.monthNames.july"), value: 7 },
  { label: $t("common.monthNames.august"), value: 8 },
  { label: $t("common.monthNames.september"), value: 9 },
  { label: $t("common.monthNames.october"), value: 10 },
  { label: $t("common.monthNames.november"), value: 11 },
  { label: $t("common.monthNames.december"), value: 12 },
];

const isDownloading = ref(false);
const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(currentYear);

watch(open, (isOpen) => {
  if (!isOpen) return;

  const now = new Date();
  selectedMonth.value = now.getMonth() + 1;
  selectedYear.value = now.getFullYear();
});

const downloadReport = async () => {
  if (!selectedMonth.value || !selectedYear.value) return;

  isDownloading.value = true;
  try {
    await downloadBlobReport("/api/reports/cashbook", {
      query: {
        month: selectedMonth.value,
        year: selectedYear.value,
      },
      fileName: `laporan-buku-kas-${selectedYear.value}-${String(
        selectedMonth.value,
      ).padStart(2, "0")}.xlsx`,
      fallbackErrorMessage: $t("common.downloadReportError"),
      onSuccess: () => {
        open.value = false;
      },
    });
  } catch (err: unknown) {
    console.error("Error downloading cashbook report:", err);
    const toast = useToast();
    toast.add({
      title: $t("common.error.title"),
      description:
        err instanceof Error ? err.message : $t("common.downloadReportError"),
      color: "error",
    });
  } finally {
    isDownloading.value = false;
  }
};
</script>
