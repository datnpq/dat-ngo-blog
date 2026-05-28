import "dotenv/config";
import { db } from "./index";
import { author } from "./schema";
import bcrypt from "bcrypt";

async function seed() {
  const email = process.env.AUTHOR_EMAIL || "dat@realitech.dev";
  const password = process.env.AUTHOR_PASSWORD;

  if (!password) {
    console.error("AUTHOR_PASSWORD env var is required");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .insert(author)
    .values({ email, passwordHash })
    .onConflictDoUpdate({
      target: author.email,
      set: { passwordHash },
    });

  console.log(`Author seeded: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
