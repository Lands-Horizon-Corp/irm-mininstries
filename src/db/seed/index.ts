import { db } from "@/db/drizzle";
import { ministryRanks } from "@/modules/ministry-ranks/ministry-ranks-schema";
import { ministrySkills } from "@/modules/ministry-skills/ministry-skills-schema";

import { ministryRanksSeedData } from "./data/ministry-ranks";
import { ministrySkillsSeedData } from "./data/ministry-skills";

async function seedMinistryRanks() {
  console.log("🌱 Seeding ministry ranks...");

  try {
    for (const rank of ministryRanksSeedData) {
      await db
        .insert(ministryRanks)
        .values(rank)
        .onConflictDoNothing({ target: ministryRanks.name });
    }

    console.log(
      `✅ Successfully seeded ${ministryRanksSeedData.length} ministry ranks`
    );
  } catch (error) {
    console.error("❌ Error seeding ministry ranks:", error);
    throw error;
  }
}

async function seedMinistrySkills() {
  console.log("🌱 Seeding ministry skills...");

  try {
    for (const skill of ministrySkillsSeedData) {
      await db
        .insert(ministrySkills)
        .values(skill)
        .onConflictDoNothing({ target: ministrySkills.name });
    }

    console.log(
      `✅ Successfully seeded ${ministrySkillsSeedData.length} ministry skills`
    );
  } catch (error) {
    console.error("❌ Error seeding ministry skills:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting database seeding...");

  try {
    await seedMinistryRanks();
    await seedMinistrySkills();

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("💥 Database seeding failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
