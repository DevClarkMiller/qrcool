BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Email] VARCHAR(100) NOT NULL,
    [Username] VARCHAR(50) NOT NULL,
    [Password] VARCHAR(120) NOT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [DF__Account__IsActiv__6B24EA82] DEFAULT 0,
    CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [AK_Account_Email] UNIQUE NONCLUSTERED ([Email]),
    CONSTRAINT [AK_Account_Username] UNIQUE NONCLUSTERED ([Username])
);

-- CreateTable
CREATE TABLE [dbo].[Content] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(100) NOT NULL,
    [Text] VARCHAR(500) NOT NULL,
    [Path] VARCHAR(255),
    [ContentTypeId] INT NOT NULL,
    CONSTRAINT [PK_Content] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[ContentType] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Name] VARCHAR(50) NOT NULL,
    CONSTRAINT [PK_ContentType] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Entry] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [AccountId] INT NOT NULL,
    [Name] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_Entry] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[EntryContent] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [EntryId] INT NOT NULL,
    [ContentId] INT NOT NULL,
    [IsActive] BIT,
    CONSTRAINT [PK_EntryContent] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [AK_EntryContent] UNIQUE NONCLUSTERED ([EntryId],[ContentId])
);

-- CreateTable
CREATE TABLE [dbo].[EntryView] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [EntryId] INT NOT NULL,
    [ContentId] INT,
    [Timestamp] DATETIME NOT NULL CONSTRAINT [DF__EntryView__Times__693CA210] DEFAULT CURRENT_TIMESTAMP,
    [Latitude] FLOAT(53),
    [Longitude] FLOAT(53),
    CONSTRAINT [PK_EntryView] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Account_Email] ON [dbo].[Account]([Email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Account_Username] ON [dbo].[Account]([Username]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_EntryContent_Content_Entry] ON [dbo].[EntryContent]([ContentId], [EntryId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_EntryContent_Entry_Content] ON [dbo].[EntryContent]([EntryId], [ContentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_EntryView_Entry] ON [dbo].[EntryView]([EntryId]);

-- AddForeignKey
ALTER TABLE [dbo].[Content] ADD CONSTRAINT [FK_Content_ContentType] FOREIGN KEY ([ContentTypeId]) REFERENCES [dbo].[ContentType]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Entry] ADD CONSTRAINT [FK_Entry_Account] FOREIGN KEY ([AccountId]) REFERENCES [dbo].[Account]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EntryContent] ADD CONSTRAINT [FK_EntryContent_Content] FOREIGN KEY ([ContentId]) REFERENCES [dbo].[Content]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EntryContent] ADD CONSTRAINT [FK_EntryContent_Entry] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[Entry]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EntryView] ADD CONSTRAINT [FK_EntryView_Entry] FOREIGN KEY ([EntryId]) REFERENCES [dbo].[Entry]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

