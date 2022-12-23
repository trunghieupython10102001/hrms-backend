BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [fullname] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [dateOfBirth] DATETIME2 NOT NULL,
    [avatarUrl] NVARCHAR(1000) NOT NULL,
    [createdBy] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [upDatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[UserType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userTypeName] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [createdBy] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [upDatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [UserType_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Function] (
    [id] INT NOT NULL IDENTITY(1,1),
    [functionName] NVARCHAR(1000) NOT NULL CONSTRAINT [Function_functionName_df] DEFAULT '',
    [functionLink] NVARCHAR(1000) NOT NULL,
    [isDisplay] BIT NOT NULL CONSTRAINT [Function_isDisplay_df] DEFAULT 1,
    [isActive] BIT NOT NULL CONSTRAINT [Function_isActive_df] DEFAULT 1,
    [parentID] INT NOT NULL,
    [createdBy] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Function_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [upDatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Function_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserFunction] (
    [userID] INT NOT NULL,
    [functionID] INT NOT NULL,
    [isGrant] BIT NOT NULL,
    [isInsert] BIT NOT NULL,
    [isUpdate] BIT NOT NULL,
    [isDelete] BIT NOT NULL,
    [createdBy] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserFunction_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [upDatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [UserFunction_pkey] PRIMARY KEY CLUSTERED ([userID],[functionID])
);

-- CreateTable
CREATE TABLE [dbo].[UserTypeFunction] (
    [userTypeID] INT NOT NULL,
    [functionID] INT NOT NULL,
    [isGrant] BIT NOT NULL,
    [isInsert] BIT NOT NULL,
    [isUpdate] BIT NOT NULL,
    [isDelete] BIT NOT NULL,
    [createdBy] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserTypeFunction_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [upDatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [UserTypeFunction_pkey] PRIMARY KEY CLUSTERED ([userTypeID],[functionID])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserFunction] ADD CONSTRAINT [UserFunction_userID_fkey] FOREIGN KEY ([userID]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserFunction] ADD CONSTRAINT [UserFunction_functionID_fkey] FOREIGN KEY ([functionID]) REFERENCES [dbo].[Function]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserTypeFunction] ADD CONSTRAINT [UserTypeFunction_userTypeID_fkey] FOREIGN KEY ([userTypeID]) REFERENCES [dbo].[UserType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserTypeFunction] ADD CONSTRAINT [UserTypeFunction_functionID_fkey] FOREIGN KEY ([functionID]) REFERENCES [dbo].[Function]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
