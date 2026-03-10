export type NavigationItem = {
  icon: string;
  label: string;
  description?: string;
  to?: string;
  children?: NavigationItem[];
};

// Functions accept 't' parameter to avoid calling useI18n() inside nested functions
// useI18n() must be called at the top level of setup function
export const getBaseNavItems = (
  t: (key: string) => string,
): NavigationItem[] => {
  return [
    {
      icon: "i-heroicons-home",
      label: t("navigation.dashboard"),
      to: "/dashboard",
    },
  ];
};

export const getMemberNavItems = (
  t: (key: string) => string,
): NavigationItem[] => {
  return [
    {
      icon: "i-heroicons-banknotes",
      label: t("navigation.loans"),
      children: [
        {
          icon: "i-heroicons-credit-card",
          label: t("navigation.loanRequest"),
          to: "/loans/request",
        },
        {
          icon: "i-heroicons-clipboard-document-list",
          label: t("navigation.myLoans"),
          to: "/loans",
        },
      ],
    },
  ];
};

export const getAdminNavItems = (
  t: (key: string) => string,
): NavigationItem[] => {
  return [
    {
      icon: "i-heroicons-user-group",
      label: t("navigation.usersManagement"),
      children: [
        {
          icon: "i-heroicons-briefcase",
          label: t("navigation.administratorManagement"),
          description: t("navigation.administratorManagementDesc"),
          to: "/admin/administrators",
        },
        {
          icon: "i-heroicons-user-group",
          label: t("navigation.memberManagement"),
          description: t("navigation.memberManagementDesc"),
          to: "/admin/members",
        },
      ],
    },
    {
      icon: "i-heroicons-clipboard-document-list",
      label: t("navigation.loanManagement"),
      to: "/admin/loans",
    },
    {
      icon: "i-heroicons-wallet",
      label: t("navigation.savingsManagement"),
      to: "/admin/savings",
    },
    {
      icon: "i-heroicons-banknotes",
      label: t("navigation.expenseManagement"),
      children: [
        {
          icon: "i-heroicons-credit-card",
          label: t("navigation.createExpense"),
          description: t("navigation.createExpenseDescription"),
          to: "/admin/expenses/create",
        },
        {
          icon: "i-heroicons-credit-card",
          label: t("navigation.expenseList"),
          description: t("navigation.expenseListDescription"),
          to: "/admin/expenses",
        },
      ],
    },
  ];
};
