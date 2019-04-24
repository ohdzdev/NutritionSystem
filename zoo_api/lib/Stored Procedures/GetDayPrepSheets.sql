CREATE DEFINER=`zoo`@`%` PROCEDURE `zoo`.`GetDayPrepSheets`(IN nextDay VARCHAR(255))
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tTomorrowDiet;
	DROP TEMPORARY TABLE IF EXISTS tTomorrowDietSub;
	DROP TEMPORARY TABLE IF EXISTS tTomorrowDietSubCopy;

	CREATE TEMPORARY TABLE tTomorrowDietSub
	AS
	SELECT DISTINCT DIETS.diet_id as diet_id,
					DIET_PLAN.food_id as food_id,
					DIET_PLAN.group_amount as group_amount,
					DIET_PLAN.unit_id as unit_id,
					DIET_PLAN.sort as sort,
					DIET_PLAN.tote as tote,
					FOOD.food as food,
					UNITS.unit as unit,
					DIET_PLAN.line_notes as line_notes,
					DIETS.table_id as table_id,
					FOOD.meat as meat,
					IF(FOOD.meat=1, 5, DIETS.table_id) AS target,
					DELIVERY_CONTAINERS.sort_order as sort_order
	FROM (
			(
				LOCATIONS RIGHT JOIN (
					(
						(
							DIETS LEFT JOIN DIET_PLAN
							ON DIETS.diet_id = DIET_PLAN.diet_id
						)
						LEFT JOIN SPECIES
						ON DIETS.species_id = SPECIES.species_id
					)
					LEFT JOIN DELIVERY_CONTAINERS
					ON DIETS.dc_id = DELIVERY_CONTAINERS.dc_id
				)
				ON LOCATIONS.location_id = DELIVERY_CONTAINERS.location_id
			)
			LEFT JOIN FOOD
			ON DIET_PLAN.food_id = FOOD.food_id
		)
		LEFT JOIN UNITS ON
		DIET_PLAN.unit_id = UNITS.unit_id
	WHERE (
		(
			(DIET_PLAN.line_notes Not Like "%ZK%")
			OR
			(DIET_PLAN.line_notes IS NULL)
		)
		AND 
		(
			(IF(DAYOFWEEK(nextDay) = 1, DIET_PLAN.sun, 0)) = 1
			OR
			(IF(DAYOFWEEK(nextDay) = 2, DIET_PLAN.mon, 0)) = 1
			OR
			(IF(DAYOFWEEK(nextDay) = 3, DIET_PLAN.tue, 0)) = 1
			OR
			(IF(DAYOFWEEK(nextDay) = 4, DIET_PLAN.wed, 0)) = 1
			OR
			(IF(DAYOFWEEK(nextDay) = 5, DIET_PLAN.thr, 0)) = 1
			OR
			(IF(DAYOFWEEK(nextDay) = 6, DIET_PLAN.fri, 0)) = 1
			OR
			(IF(DAYOFWEEK(nextDay) = 7, DIET_PLAN.sat, 0)) = 1
		) 
		AND
		((DIETS.`current`)=True) 
		AND 
		((DIETS.nc_prepares)=True) 
		AND 
		((DIETS.group_id)=1)
		AND
		(
			(
				Round((Round(DATEDIFF('2019-1-6', nextDay)/7,0) Mod (DIET_PLAN.freq_weeks))+1,0) = DIET_PLAN.freq_rotation
			)
		)
	)
	UNION
	SELECT DISTINCT SUBENCLOSURES.se_id as diet_id,
					DIET_PLAN.food_id as food_id,
					Sum(DIET_PLAN.group_amount) as group_amount,
					DIET_PLAN.unit_id as unit_id,
					Min(DIET_PLAN.sort) as sort,
					Min(DIET_PLAN.tote) as tote,
					FOOD.food as food,
					UNITS.unit as unit,
					DIET_PLAN.line_notes as line_notes,
					DIETS.table_id AS table_id,
					FOOD.meat as meat,
					IF(FOOD.meat=1, 5, DIETS.table_id) AS target,
					DELIVERY_CONTAINERS.sort_order as sort_order
	FROM (
			(
				(
					(
						(
							DIETS LEFT JOIN DIET_PLAN
							ON DIETS.diet_id = DIET_PLAN.diet_id
						)
						LEFT JOIN SUBENCLOSURES
						ON DIETS.group_id = SUBENCLOSURES.se_id
					)
					LEFT JOIN LOCATIONS
					ON SUBENCLOSURES.location_id = LOCATIONS.location_id
				)
				LEFT JOIN FOOD
				ON DIET_PLAN.food_id = FOOD.food_id
			)
			LEFT JOIN UNITS
			ON DIET_PLAN.unit_id = UNITS.unit_id
		)
		INNER JOIN DELIVERY_CONTAINERS
		ON DIETS.dc_id = DELIVERY_CONTAINERS.dc_id
	WHERE (
			(
				DIET_PLAN.line_notes Not Like "%ZK%"
				OR
				DIET_PLAN.line_notes IS NULL
			)
			AND
			(DIETS.group_id<>1)
			AND
			(DIETS.`current` = True)
			AND
			(DIETS.nc_prepares = True)
			AND
			(
				(IF(DAYOFWEEK(nextDay) = 1, DIET_PLAN.sun, 0)) = 1
				OR
				(IF(DAYOFWEEK(nextDay) = 2, DIET_PLAN.mon, 0)) = 1
				OR
				(IF(DAYOFWEEK(nextDay) = 3, DIET_PLAN.tue, 0)) = 1
				OR
				(IF(DAYOFWEEK(nextDay) = 4, DIET_PLAN.wed, 0)) = 1
				OR
				(IF(DAYOFWEEK(nextDay) = 5, DIET_PLAN.thr, 0)) = 1
				OR
				(IF(DAYOFWEEK(nextDay) = 6, DIET_PLAN.fri, 0)) = 1
				OR
				(IF(DAYOFWEEK(nextDay) = 7, DIET_PLAN.sat, 0)) = 1
			)
			AND
			(
				(
					Round((Round(DATEDIFF('2019-1-6', nextDay)/7,0) Mod (DIET_PLAN.freq_weeks))+1,0) = DIET_PLAN.freq_rotation
				)
			)
		)
	GROUP BY SUBENCLOSURES.se_id,
			FOOD.food,
			DIET_PLAN.food_id,
			UNITS.unit,
			DIET_PLAN.unit_id,
			FOOD.meat,
			IF(FOOD.meat=1, 5, DIETS.table_id),
			DELIVERY_CONTAINERS.sort_order,
			DIET_PLAN.line_notes,
			DIETS.group_id,
			DIETS.`current`,
			DIETS.label,
			DIETS.nc_prepares,
			DIETS.table_id;
		
	CREATE TEMPORARY TABLE tTomorrowDietSubCopy
	AS
	SELECT * FROM tTomorrowDietSub;
	
	CREATE TEMPORARY TABLE tTomorrowDiet
	AS
	SELECT nextDay AS data_date,
			tTomorrowDietSub.diet_id as diet_id,
			SPECIES.species as species,
			DIETS.dc_id as dc_id,
			tTomorrowDietSub.target as target,
			DIETS.note_id as note_id,
			DIETS.label as label,
			DELIVERY_CONTAINERS.dc as dc,
			LOCATIONS.location as location,
			tTomorrowDietSub.sort_order as sort_order,
			DIETS.group_id as group_id,
			FALSE as nc_prepares 
	FROM (
			(
				(
					tTomorrowDietSub INNER JOIN DIETS
					ON tTomorrowDietSub.diet_id = DIETS.diet_id
				)
				INNER JOIN SPECIES
				ON DIETS.species_id = SPECIES.species_id
			)
			INNER JOIN DELIVERY_CONTAINERS
			ON DIETS.dc_id = DELIVERY_CONTAINERS.dc_id
		)
		INNER JOIN LOCATIONS
		ON DELIVERY_CONTAINERS.location_id = LOCATIONS.location_id
	GROUP BY tTomorrowDietSub.diet_id,
			SPECIES.species,
			DIETS.dc_id,
			tTomorrowDietSub.target,
			DIETS.note_id,
			DIETS.label,
			DELIVERY_CONTAINERS.dc,
			LOCATIONS.location,
			tTomorrowDietSub.sort_order,
			DIETS.group_id
	UNION
	SELECT nextDay AS data_date,
			tTomorrowDietSubCopy.diet_id as diet_id,
			"GROUP DIET" AS species,
			NULL as dc_id,
			tTomorrowDietSubCopy.target as target,
			"Group Diet" AS note_id,
			TRUE AS label,
			SUBENCLOSURES.subenclosure AS dc,
			LOCATIONS.location as location,
			tTomorrowDietSubCopy.sort_order as sort_order,
			SUBENCLOSURES.se_id,
			FALSE as nc_prepares
	FROM tTomorrowDietSubCopy INNER JOIN
			(
				LOCATIONS INNER JOIN SUBENCLOSURES
				ON LOCATIONS.location_id = SUBENCLOSURES.location_id
			)
			ON tTomorrowDietSubCopy.diet_id = SUBENCLOSURES.se_id
	GROUP BY tTomorrowDietSubCopy.diet_id,
			SUBENCLOSURES.subenclosure,
			LOCATIONS.location,
			tTomorrowDietSubCopy.target,
			tTomorrowDietSubCopy.sort_order,
			SUBENCLOSURES.se_id;

	SELECT FOOD.food as food,
			UNITS.unit as unit,
			tTomorrowDietSub.group_amount as group_amount,
			tTomorrowDietSub.target as target,
			FOOD.pre_chop as pre_chop,
			tTomorrowDiet.nc_prepares as nc_prepares,
			tTomorrowDietSub.meat as meat
	FROM UNITS RIGHT JOIN
			(
				FOOD RIGHT JOIN
				(
					tTomorrowDiet LEFT JOIN tTomorrowDietSub
					ON tTomorrowDiet.diet_id = tTomorrowDietSub.diet_id
				)
				ON FOOD.food_id = tTomorrowDietSub.food_id
			)
			ON UNITS.unit_id = tTomorrowDietSub.unit_id
	WHERE (
			((UNITS.unit)="g")
			AND
			((FOOD.pre_chop)=TRUE)
			AND
			((tTomorrowDiet.nc_prepares)=FALSE)
		)
	ORDER BY FOOD.food;
END