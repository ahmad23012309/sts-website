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

/**
 * The header carries the logo in the centre with the menu split around it, so
 * the navigation is declared as two halves rather than one list.
 */
export const primaryNav: NavItem[] = [
  {
    label: "Fleet",
    href: "/fleet",
    mega: true,
    children: [
      {
        label: "Coasters",
        href: "/fleet/category/coaster",
        description: "22-seat group travel, the largest part of our fleet",
      },
      {
        label: "Vans",
        href: "/fleet/category/van",
        description: "Hiace Grand Cabin and Karvaan Plus, 7 to 13 seats",
      },
      {
        label: "Buses",
        href: "/fleet/category/bus",
        description: "Daewoo intercity coaches for large groups",
      },
      {
        label: "Sedans",
        href: "/fleet/category/sedan",
        description: "Yaris, Corolla Altis and Civic",
      },
      {
        label: "SUVs",
        href: "/fleet/category/suv",
        description: "Sportage, Sorento, Fortuner and Haval H6",
      },
      {
        label: "Luxury",
        href: "/fleet/category/luxury",
        description: "Prado and Land Cruiser for executive travel",
      },
      {
        label: "Pickups",
        href: "/fleet/category/pickup",
        description: "Hilux Revo and JAC T9 for site and field work",
      },
      {
        label: "Economy",
        href: "/fleet/category/economy",
        description: "Wagon R and XBEE for city running",
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

/** Items shown to the left of the centred logo. */
export const navLeft = primaryNav.filter((item) =>
  ["Fleet", "Fare Calculator", "Corporate"].includes(item.label),
);

/** Items shown to the right of it. */
export const navRight = primaryNav.filter((item) =>
  ["Services", "Fuel Prices", "Company"].includes(item.label),
);

export const footerNav = {
  fleet: [
    { label: "All Vehicles", href: "/fleet" },
    { label: "Coasters", href: "/fleet/category/coaster" },
    { label: "Vans", href: "/fleet/category/van" },
    { label: "Buses", href: "/fleet/category/bus" },
    { label: "SUVs", href: "/fleet/category/suv" },
    { label: "Sedans", href: "/fleet/category/sedan" },
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
