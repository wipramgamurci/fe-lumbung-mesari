export type NavigationItem = {
  icon: string;
  label: string;
  to: string;
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
    label: "Member Management",
    to: "/admin/members",
  },
  {
    icon: "i-heroicons-briefcase",
    label: "Administrator Management",
    to: "/admin/administrators",
  },
  {
    icon: "i-heroicons-clipboard-document-list",
    label: "Loan Management",
    to: "/admin/loans",
  },
];
