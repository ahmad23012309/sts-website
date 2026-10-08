export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  /** Renders as a wide panel rather than a simple dropdown. */
  mega?: boolean;
}

export const primaryNav: NavItem[] = [
  {
    label: "Fleet",
    href: "/fleet",
    mega: true,
    children: [
      {
        label: "Economy",
        href: "/fleet/category/economy",
        description: "Alto, Cultus and similar, for city running",
      },
      {
        label: "Sedans",
        href: "/fleet/category/sedan",
        description: "Yaris, City, Corolla",
      },
      {
        label: "SUVs",
        href: "/fleet/category/suv",
        description: "Sportage, Tucson and the rest",
      },
      {
        label: "Luxury",
        href: "/fleet/category/luxury",
        description: "Civic, Fortuner, executive travel",
      },
      {
        label: "Vans",
        href: "/fleet/category/van",
        description: "Hiace and Grand Cabin, up to 13 seats",
      },
      {
        label: "Coasters",
        href: "/fleet/category/coaster",
        description: "Group travel, 22 seats",
      },
    ],
  },
  {
    label: "Fare Calculator",
    href: "/fare-calculator",
  },
  {
    label: "Corporate",
    href: "/corporate",
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Daily Rental", href: "/services/daily-rental" },
      { label: "Corporate Fleet", href: "/services/corporate-fleet" },
      { label: "Airport Transfer", href: "/services/airport-transfer" },
      { label: "Intercity Travel", href: "/services/intercity-travel" },
      { label: "Wedding and Events", href: "/services/wedding-and-events" },
      { label: "Staff Transport", href: "/services/staff-transport" },
    ],
  },
  {
    label: "Fuel Prices",
    href: "/fuel-prices",
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const footerNav = {
  fleet: [
    { label: "All Vehicles", href: "/fleet" },
    { label: "Economy", href: "/fleet/category/economy" },
    { label: "Sedans", href: "/fleet/category/sedan" },
    { label: "SUVs", href: "/fleet/category/suv" },
    { label: "Luxury", href: "/fleet/category/luxury" },
    { label: "Compare Vehicles", href: "/compare" },
  ],
  services: [
    { label: "Daily Rental", href: "/services/daily-rental" },
    { label: "Corporate Fleet", href: "/services/corporate-fleet" },
    { label: "Airport Transfer", href: "/services/airport-transfer" },
    { label: "Intercity Travel", href: "/services/intercity-travel" },
    { label: "Staff Transport", href: "/services/staff-transport" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
    { label: "Payment Plans", href: "/payment-plans" },
    { label: "Attributions", href: "/attributions" },
  ],
};
