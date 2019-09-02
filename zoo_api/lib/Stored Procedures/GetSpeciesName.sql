CREATE DEFINER=`zoo`@`%` PROCEDURE `GetSpeciesName`(IN DietId INT)
BEGIN
	SELECT 
		SPECIES.species AS Description
	FROM 
		DIETS
		LEFT JOIN SPECIES
			ON DIETS.species_id = SPECIES.species_id 
	WHERE 
		DIETS.diet_id = DietId;
END
