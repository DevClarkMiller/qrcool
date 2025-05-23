USE master;
GO
DROP DATABASE QrCool;
GO
CREATE DATABASE QrCool;
GO
USE QrCool;
GO

CREATE TABLE Account(
	Id INT IDENTITY,
	Email VARCHAR(100) NOT NULL,
	Username VARCHAR(50) NOT NULL,
	Password VARCHAR(120) NOT NULL, -- Needs to be big becuase it's a hash,
	IsActive BIT NOT NULL DEFAULT 0,
	CONSTRAINT PK_Account PRIMARY KEY (Id),
	CONSTRAINT AK_Account_Email UNIQUE(Email),
	CONSTRAINT AK_Account_Username UNIQUE(Username)
);
GO

CREATE INDEX IX_Account_Email ON Account(Email);
CREATE INDEX IX_Account_Username ON Account(Username);

GO

CREATE TABLE ContentType(
	Id INT IDENTITY,
	Name VARCHAR(50) NOT NULL,
	CONSTRAINT PK_ContentType PRIMARY KEY (Id)
);

CREATE TABLE Content(
	Id INT IDENTITY,
	Name VARCHAR(100) NOT NULL,
	Text VARCHAR(500) NOT NULL,
	Path VARCHAR(255) NULL,
	ContentTypeId INT NOT NULL,
	CONSTRAINT PK_Content PRIMARY KEY (Id),
	CONSTRAINT FK_Content_ContentType FOREIGN KEY (ContentTypeId) REFERENCES ContentType(Id)
);

CREATE TABLE Entry(
	Id INT IDENTITY,
	AccountId INT NOT NULL,
	Name VARCHAR(100) NOT NULL,
	CONSTRAINT PK_Entry PRIMARY KEY (Id),
	CONSTRAINT FK_Entry_Account FOREIGN KEY(AccountId) REFERENCES Account(Id)
);

CREATE TABLE EntryContent(
	Id INT IDENTITY,
	EntryId INT NOT NULL,
	ContentId INT NOT NULL,
	CONSTRAINT PK_EntryContent PRIMARY KEY (Id),
	CONSTRAINT FK_EntryContent_Entry FOREIGN KEY (EntryId) REFERENCES Entry(Id),
	CONSTRAINT FK_EntryContent_Content FOREIGN KEY (ContentId) REFERENCES Content(Id) ON DELETE CASCADE,
	CONSTRAINT AK_EntryContent UNIQUE (EntryId, ContentId)
);


ALTER TABLE EntryContent
ADD IsActive BIT NULL;
GO

CREATE INDEX IX_EntryContent_Entry_Content ON EntryContent(EntryId, ContentId);
CREATE INDEX IX_EntryContent_Content_Entry ON EntryContent(ContentId, EntryId);

GO

CREATE TABLE EntryView(
	Id INT IDENTITY,
	EntryId INT NOT NULL,
	ContentId INT NULL, -- Doesn't have a foreign key
	Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
	Latitude FLOAT NULL,
	Longitude FLOAT NULL,
	CONSTRAINT PK_EntryView PRIMARY KEY (Id),
	CONSTRAINT FK_EntryView_Entry FOREIGN KEY (EntryId) REFERENCES Entry(Id)
		ON DELETE CASCADE, -- Will remove all entry views when an entry is deleted
);

GO

CREATE INDEX IX_EntryView_Entry ON EntryView(EntryId);
GO

-- Some default entries for ContentType
INSERT INTO ContentType(Name) VALUES
('Redirect'), ('HTML'), 
('Image'), ('Video'), ('Audio'),
('Text'),('File');