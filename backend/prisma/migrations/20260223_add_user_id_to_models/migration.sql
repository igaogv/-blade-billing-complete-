-- AddColumn userId to clients table
ALTER TABLE "clients" ADD COLUMN "userId" TEXT;

-- AddColumn userId to invoices table
ALTER TABLE "invoices" ADD COLUMN "userId" TEXT;

-- AddColumn userId to appointments table
ALTER TABLE "appointments" ADD COLUMN "userId" TEXT;

-- Get existing users to assign clients to (for data migration)
-- For each client without userId, assign to first user (admin)
WITH first_user AS (
  SELECT id FROM "users" ORDER BY "createdAt" ASC LIMIT 1
)
UPDATE "clients" SET "userId" = (SELECT id FROM first_user) WHERE "userId" IS NULL;

-- Assign existing invoices to first user
WITH first_user AS (
  SELECT id FROM "users" ORDER BY "createdAt" ASC LIMIT 1
)
UPDATE "invoices" SET "userId" = (SELECT id FROM first_user) WHERE "userId" IS NULL;

-- Assign existing appointments to first user
WITH first_user AS (
  SELECT id FROM "users" ORDER BY "createdAt" ASC LIMIT 1
)
UPDATE "appointments" SET "userId" = (SELECT id FROM first_user) WHERE "userId" IS NULL;

-- Make userId NOT NULL after data migration
ALTER TABLE "clients" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "invoices" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "userId" SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for better query performance
CREATE INDEX "clients_userId_idx" ON "clients"("userId");
CREATE INDEX "invoices_userId_idx" ON "invoices"("userId");
CREATE INDEX "appointments_userId_idx" ON "appointments"("userId");
