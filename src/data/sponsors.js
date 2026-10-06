// ============================================
// SPONSORSHIP TIERS
// Edit prices and benefits to fit the SUG's needs.
// ============================================

export const sponsorshipTiers = [
  {
    id: 1,
    name: "Bronze Partner",
    price: "₦100,000",
    duration: "1 Academic Session",
    color: "from-amber-700 to-amber-900",
    benefits: [
      "Logo on website Partners section",
      "Mention in one SUG newsletter",
      "Social media shout-out (1 post)",
    ],
  },
  {
    id: 2,
    name: "Silver Partner",
    price: "₦200,000",
    duration: "1 Academic Session",
    color: "from-gray-400 to-gray-600",
    featured: true,
    benefits: [
      "Everything in Bronze",
      "Banner placement on Home page",
      "2 sponsored posts on News page",
      "Logo on SUG event materials",
    ],
  },
  {
    id: 3,
    name: "Gold Partner",
    price: "₦350,000",
    duration: "1 Academic Session",
    color: "from-yellow-500 to-yellow-700",
    benefits: [
      "Everything in Silver",
      "Featured partner highlight on Home page",
      "Dedicated announcement post",
      "Physical banner at SUG events",
      "Priority contact with SUG executives",
    ],
  },
];

export const currentPartners = [
  // Add partners here as they come on board:
  // { id: 1, name: "Company Name", logo: "/photos/partners/company.png", tier: "Silver" }
];