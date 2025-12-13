export type NavigationItem = {
  icon: string;
  label: string;
  description?: string;
  to?: string;
  children?: NavigationItem[];
};

export const BASE_NAV_ITEMS: NavigationItem[] = [
  {
    icon: "i-heroicons-home",
    label: "Dashboard",
    to: "/dashboard",
  },
];

export const MEMBER_NAV_ITEMS: NavigationItem[] = [
  {
    icon: "i-heroicons-banknotes",
    label: "My Loans",
    to: "/loans",
  },
];

export const ADMIN_NAV_ITEMS: NavigationItem[] = [
  {
    icon: "i-heroicons-user-group",
    label: "Users Management",
    children: [
      {
        icon: "i-heroicons-briefcase",
        label: "Administrator Management",
        description: "Manage administrators",
        to: "/admin/administrators",
      },
      {
        icon: "i-heroicons-user-group",
        label: "Member Management",
        description: "List and Approve or Reject Member",
        to: "/admin/members",
      },
    ],
  },

  {
    icon: "i-heroicons-clipboard-document-list",
    label: "Loan Management",
    to: "/admin/loans",
  },
  {
    icon: "i-heroicons-wallet",
    label: "Savings Management",
    to: "/admin/savings",
  },
];
