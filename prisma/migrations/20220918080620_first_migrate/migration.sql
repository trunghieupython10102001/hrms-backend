-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upDatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserType" (
    "id" SERIAL NOT NULL,
    "userTypeName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upDatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Function" (
    "id" SERIAL NOT NULL,
    "functionName" TEXT NOT NULL,
    "isDisplay" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentID" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upDatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Function_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFunction" (
    "userID" INTEGER NOT NULL,
    "functionID" INTEGER NOT NULL,
    "isGrant" BOOLEAN NOT NULL,
    "isInsert" BOOLEAN NOT NULL,
    "isUpdate" BOOLEAN NOT NULL,
    "isDelete" BOOLEAN NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upDatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFunction_pkey" PRIMARY KEY ("userID","functionID")
);

-- CreateTable
CREATE TABLE "UserTypeFunction" (
    "userTypeID" INTEGER NOT NULL,
    "functionID" INTEGER NOT NULL,
    "isGrant" BOOLEAN NOT NULL,
    "isInsert" BOOLEAN NOT NULL,
    "isUpdate" BOOLEAN NOT NULL,
    "isDelete" BOOLEAN NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upDatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTypeFunction_pkey" PRIMARY KEY ("userTypeID","functionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserFunction" ADD CONSTRAINT "UserFunction_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFunction" ADD CONSTRAINT "UserFunction_functionID_fkey" FOREIGN KEY ("functionID") REFERENCES "Function"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTypeFunction" ADD CONSTRAINT "UserTypeFunction_userTypeID_fkey" FOREIGN KEY ("userTypeID") REFERENCES "UserType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTypeFunction" ADD CONSTRAINT "UserTypeFunction_functionID_fkey" FOREIGN KEY ("functionID") REFERENCES "Function"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
