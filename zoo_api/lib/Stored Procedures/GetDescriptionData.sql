DELIMITER $$
CREATE DEFINER=`zoo`@`%` PROCEDURE `GetDescriptionData`(IN DietId INT)
BEGIN
	SELECT 
		CONCAT("#", diet_id, " (" , note_id, ") ", dc) AS Description
	FROM 
		LOCATIONS
		RIGHT JOIN (DIETS LEFT JOIN DELIVERY_CONTAINERS ON DIETS.dc_id = DELIVERY_CONTAINERS.dc_id) 
			ON LOCATIONS.location_id = DELIVERY_CONTAINERS.location_id
	WHERE 
		DIETS.diet_id = DietId;
END$$
DELIMITER ;
