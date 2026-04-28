# Schema Generation Progress Tracker

## Status: COMPLETE 🚀

### Core Entities
- [x] User (auth.prisma)
- [x] Player (player.prisma)
- [x] Coach (coach.prisma)
- [x] Contact (player.prisma)
- [x] Academy (academy.prisma)
- [x] Team (academy.prisma)
- [x] SuperAdmin (auth.prisma - Standalone)
- [x] Club (academy.prisma)
- [x] Academy Manager (academy.prisma)
- [x] Agent (agent.prisma)
- [x] League (league.prisma)
- [x] Transfer (transfer.prisma)

### Auxiliary Entities
- [x] BirthCountry (player.prisma)
- [x] SeasonStats (player.prisma)
- [x] Languages (player.prisma)
- [x] StylesAndIcons (Mapped via styleImage in Player)
- [x] CareerHighlights (player.prisma)
- [x] KeySkills (Mapped via SkillAttribute in player.prisma)
- [x] Docs (Implicitly handled via media fields)
- [x] SuccessStory (player.prisma)

### Post Entities
- [x] Post (social.prisma)
- [x] ImagePost (social.prisma)
- [x] VideoPost (social.prisma)
- [x] Article (social.prisma)

### Match & Training Entities
- [x] Match (match.prisma)
- [x] MatchStatistics (match.prisma)
- [x] MatchMedia (match.prisma)
- [x] GameReport (match.prisma)
- [x] TrainingSession (match.prisma)
- [x] SessionPlayer (match.prisma)
- [x] ExtraEvents (match.prisma)

### Relational / Join Entities
- [x] CoachPlayer (coach.prisma)
- [x] CoachComment (match.prisma)
- [x] Parent (parent.prisma)
- [x] ParentPlayer (parent.prisma)
- [x] Address (parent.prisma)
- [x] CoachTeam (coach.prisma)

### Shop & Sponsorship
- [x] Sponsor (shop.prisma)
- [x] Product (shop.prisma)
- [x] SubscriptionPlan (shop.prisma)

### Player Specific Analysis
- [x] PlayerCV (player.prisma)
- [x] TransferRequest (player.prisma)
- [x] PlayerAttributeAnalysis (player.prisma)
- [x] PositionalCoEfficients (player.prisma)

---
## Hierarchical & Business Rules (Upgraded)
- **Multi-Academy Support**: A `Club` can create and manage multiple `Academy` instances.
- **Flexible Player/Team Association**:
    - `Club` can directly own multiple `Team` and `Player` entities.
    - `Academy` can directly own multiple `Team` and `Player` entities.
    - `Player` can exist independently (not linked to any academy or club) or be linked to either/both.
- **Standalone Administration**: `SuperAdmin` is a standalone model with its own credentials, separate from the standard `User` auth flow.
- **Modular Role Enums**: `UserRole` and `AdminRole` are separated to ensure strict permission boundaries.

---
## Technical Notes
- **Directory**: All modular schema files are located in `prisma/schema/`.
- **Integrity**: Referential integrity is enforced with `onDelete: Cascade` for child entities and `onDelete: SetNull` for structural hierarchies.
- **Validation**: Schema passes `npx prisma validate`.
