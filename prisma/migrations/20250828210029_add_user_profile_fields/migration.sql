-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "availableHours" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "pickupInstructions" TEXT,
ADD COLUMN     "preferredContact" TEXT,
ADD COLUMN     "preferredPickupMethod" TEXT,
ADD COLUMN     "showAddress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showContactInfo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT;
