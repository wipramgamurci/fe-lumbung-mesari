export const useUsers = async (options: {
  role?: Ref<string> | string;
  status?: Ref<string> | string | ComputedRef<string | undefined>;
  page: Ref<number>;
  limit: Ref<number>;
}) => {
  const queryParams = computed(() => {
    const params: Record<string, string | number> = {
      page: unref(options.page),
      limit: unref(options.limit),
    };

    const role = unref(options.role);
    if (role) params.role = role;

    const status = unref(options.status);
    if (status) params.status = status;

    return params;
  });

  const { data, pending, refresh, error } = await useFetch("/api/users", {
    key: () =>
      `users-${Object.entries(queryParams.value)
        .map(([k, v]) => `${k}:${v}`)
        .join("-")}`,
    query: queryParams,
    watch: [queryParams],
  });

  const users = computed(() => data.value?.data || []);
  const total = computed(() => data.value?.totalData || 0);

  return { users, total, pending, refresh, error };
};
