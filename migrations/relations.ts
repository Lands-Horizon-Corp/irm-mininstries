import { relations } from "drizzle-orm/relations";
import {
  churches,
  members,
  ministers,
  ministerAwardsRecognitions,
  ministerCaseReports,
  ministerChildren,
  ministerEducationBackgrounds,
  ministerEmergencyContacts,
  ministerEmploymentRecords,
  ministerMinistryExperiences,
  ministryRanks,
  ministerMinistryRecords,
  ministerMinistrySkills,
  ministrySkills,
  ministerSeminarsConferences,
} from "./schema";

export const membersRelations = relations(members, ({ one }) => ({
  church: one(churches, {
    fields: [members.churchId],
    references: [churches.id],
  }),
}));

export const churchesRelations = relations(churches, ({ many }) => ({
  members: many(members),
  ministers: many(ministers),
  ministerMinistryRecords: many(ministerMinistryRecords),
}));

export const ministersRelations = relations(ministers, ({ one, many }) => ({
  church: one(churches, {
    fields: [ministers.churchId],
    references: [churches.id],
  }),
  ministerAwardsRecognitions: many(ministerAwardsRecognitions),
  ministerCaseReports: many(ministerCaseReports),
  ministerChildren: many(ministerChildren),
  ministerEducationBackgrounds: many(ministerEducationBackgrounds),
  ministerEmergencyContacts: many(ministerEmergencyContacts),
  ministerEmploymentRecords: many(ministerEmploymentRecords),
  ministerMinistryExperiences: many(ministerMinistryExperiences),
  ministerMinistryRecords: many(ministerMinistryRecords),
  ministerMinistrySkills: many(ministerMinistrySkills),
  ministerSeminarsConferences: many(ministerSeminarsConferences),
}));

export const ministerAwardsRecognitionsRelations = relations(
  ministerAwardsRecognitions,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerAwardsRecognitions.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerCaseReportsRelations = relations(
  ministerCaseReports,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerCaseReports.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerChildrenRelations = relations(
  ministerChildren,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerChildren.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerEducationBackgroundsRelations = relations(
  ministerEducationBackgrounds,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerEducationBackgrounds.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerEmergencyContactsRelations = relations(
  ministerEmergencyContacts,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerEmergencyContacts.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerEmploymentRecordsRelations = relations(
  ministerEmploymentRecords,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerEmploymentRecords.ministerId],
      references: [ministers.id],
    }),
  })
);

export const ministerMinistryExperiencesRelations = relations(
  ministerMinistryExperiences,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerMinistryExperiences.ministerId],
      references: [ministers.id],
    }),
    ministryRank: one(ministryRanks, {
      fields: [ministerMinistryExperiences.ministryRankId],
      references: [ministryRanks.id],
    }),
  })
);

export const ministryRanksRelations = relations(ministryRanks, ({ many }) => ({
  ministerMinistryExperiences: many(ministerMinistryExperiences),
}));

export const ministerMinistryRecordsRelations = relations(
  ministerMinistryRecords,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerMinistryRecords.ministerId],
      references: [ministers.id],
    }),
    church: one(churches, {
      fields: [ministerMinistryRecords.churchLocationId],
      references: [churches.id],
    }),
  })
);

export const ministerMinistrySkillsRelations = relations(
  ministerMinistrySkills,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerMinistrySkills.ministerId],
      references: [ministers.id],
    }),
    ministrySkill: one(ministrySkills, {
      fields: [ministerMinistrySkills.ministrySkillId],
      references: [ministrySkills.id],
    }),
  })
);

export const ministrySkillsRelations = relations(
  ministrySkills,
  ({ many }) => ({
    ministerMinistrySkills: many(ministerMinistrySkills),
  })
);

export const ministerSeminarsConferencesRelations = relations(
  ministerSeminarsConferences,
  ({ one }) => ({
    minister: one(ministers, {
      fields: [ministerSeminarsConferences.ministerId],
      references: [ministers.id],
    }),
  })
);
