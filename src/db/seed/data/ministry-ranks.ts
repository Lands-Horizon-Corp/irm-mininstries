import type { NewMinistryRank } from "@/modules/ministry-ranks/ministry-ranks-schema";

export const ministryRanksSeedData: NewMinistryRank[] = [
  {
    name: "Volunteer Worker / M.T./ GNMB",
    description:
      "Volunteer Worker, M.T. (Missionary Trainee), or GNMB (General National Missionary Board) rank in ministry experience.",
  },
  {
    name: "Missionary",
    description: "Missionary rank in ministry experience.",
  },
  {
    name: "Pastor / Deaconess (Probationary)",
    description:
      "Probationary Pastor or Deaconess rank in ministry experience.",
  },
  {
    name: "Ordained Pastor / Ordained Deaconess",
    description:
      "Ordained Pastor or Ordained Deaconess rank in ministry experience.",
  },
];
