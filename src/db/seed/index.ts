import { db } from "@/db/drizzle";
import { churches } from "@/modules/church/church-schema";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";

import { churchesSeedData } from "./data/churches";
import { ministryRanksSeedData } from "./data/ministry-ranks";
import { ministrySkillsSeedData } from "./data/ministry-skills";

async function seedChurches() {
  for (const church of churchesSeedData) {
    await db
      .insert(churches)
      .values(church)
      .onConflictDoNothing({ target: churches.name });
  }
}

async function seedMinistryRanks() {
  for (const rank of ministryRanksSeedData) {
    await db
      .insert(ministryRanks)
      .values(rank)
      .onConflictDoNothing({ target: ministryRanks.name });
  }
}

async function seedMinistrySkills() {
  for (const skill of ministrySkillsSeedData) {
    await db
      .insert(ministrySkills)
      .values(skill)
      .onConflictDoNothing({ target: ministrySkills.name });
  }
}

async function main() {
  try {
    await seedChurches();
    await seedMinistryRanks();
    await seedMinistrySkills();
  } catch {
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
