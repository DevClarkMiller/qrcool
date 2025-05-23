USE QrCool;
GO

SELECT * From Account;
--SELECT * FROM Entry;

SELECT  e.Name AS EntryName, 
		ec.IsActive IsActive, 
		c.Name AS ContentName,
		c.Text AS ContentText,
		c.Path AS ContentPath, 
		ct.Name AS ContentType
FROM EntryContent ec
INNER JOIN Content c 
	ON ec.ContentId = c.Id
INNER JOIN Entry e
	ON ec.EntryId = e.Id
INNER JOIN ContentType ct
	ON c.ContentTypeId = ct.Id;

SELECT ev.Id, e.Name, ev.ContentId, ev.Timestamp, ev.Latitude, ev.Longitude
FROM EntryView ev
INNER JOIN Entry e ON e.Id = ev.EntryId;

--SELECT * FROM EntryContent;
--SELECT * FROM Content;
--SELECT * FROM ContentType;
