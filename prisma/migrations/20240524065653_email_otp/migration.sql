-- CreateTable
CREATE TABLE "EmailOtp" (
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "EmailOtp_pkey" PRIMARY KEY ("email")
);
