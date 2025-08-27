# Database Seeder

This directory contains seed data and seeding functionality for the IRM Ministries database.

## Usage

To run the seeder and populate your database with initial data:

```bash
bun run db:seed
```

## What gets seeded?

### Churches (6 entries)

- IRM Main Church - Manila
- IRM Branch - Quezon City
- IRM Branch - Cebu
- IRM Branch - Davao
- IRM Mission Station - Baguio
- IRM Branch - Iloilo

### Ministry Ranks (4 entries)

- Volunteer Worker / M.T./ GNMB
- Missionary
- Pastor / Deaconess (Probationary)
- Ordained Pastor / Ordained Deaconess

### Ministry Skills (161 entries)

A comprehensive list of ministry-related skills including:

- Preaching, Teaching, Planning, Administration
- Music Ministry, Youth Ministry, Children's Ministry
- Counseling, Leadership, Event Coordination
- Technical Support, Media Ministry, Digital Ministry
- And many more specialized ministry skills

## How it works

The seeder uses `onConflictDoNothing()` to prevent duplicate entries, so you can run it multiple times safely. If an entry with the same name already exists, it will be skipped.

## Adding new seed data

1. Add your data to the appropriate file in `src/db/seed/data/`
2. Import and use it in `src/db/seed/index.ts`
3. Run `bun run db:seed` to populate the new data

## File Structure

```
src/db/seed/
├── index.ts              # Main seeder file
├── data/
│   ├── churches.ts       # Churches seed data
│   ├── ministry-ranks.ts # Ministry ranks seed data
│   └── ministry-skills.ts # Ministry skills seed data
└── README.md            # This file
```
