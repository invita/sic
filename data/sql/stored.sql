-- TODO: Find Parent Publication

DELIMITER $$
DROP FUNCTION IF EXISTS `junk`.`GetParentIDByID` $$
CREATE FUNCTION `junk`.`GetParentIDByID` (GivenID INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE rv INT;

    SELECT IFNULL(parent_id,-1) INTO rv FROM
    (SELECT parent_id FROM pctable WHERE id = GivenID) A;
    RETURN rv;
END $$
DELIMITER ;