-- CreateTable
CREATE TABLE "machines" (
    "id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "machine_contract_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_api_key_key" ON "machines"("api_key");

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
