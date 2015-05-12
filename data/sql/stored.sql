DELIMITER $$
DROP FUNCTION IF EXISTS `sic`.`pubGetSeries` $$
CREATE FUNCTION `sic`.`pubGetSeries` (pubId INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE curPubId INT;
    DECLARE curParentId INT DEFAULT 0;
    DECLARE curIsSeries INT DEFAULT 0;

    SELECT pub_id, parent_id, is_series INTO curPubId, curParentId, curIsSeries
      FROM publication WHERE pub_id = pubId;

    WHILE curPubId > 0 AND curParentId > 0 AND curIsSeries = 0 DO
        SELECT pub_id, parent_id, is_series INTO curPubId, curParentId, curIsSeries
          FROM publication WHERE pub_id = curParentId;
    END WHILE;

    IF curIsSeries > 0 THEN
      RETURN curPubId;
    END IF;

    RETURN 0;
END $$
DELIMITER ;
