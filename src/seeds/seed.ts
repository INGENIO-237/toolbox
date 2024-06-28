import seedApps from "./seeders/apps.seeder";
import seedPartners from "./seeders/partners.seeder";
import seedUsers from "./seeders/users.seeder";

export default async function seedDb() {
  await seedUsers();
  await seedApps()
  await seedPartners()
}

