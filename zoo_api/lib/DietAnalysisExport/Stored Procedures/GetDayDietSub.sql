CREATE DEFINER=`zoo`@`%` PROCEDURE `zoo`.`GetDayDietSub`(IN dayWanted VARCHAR(255))
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tTodayDietSub;

	CREATE TEMPORARY TABLE tTodayDietSub
	AS
	SELECT DISTINCT DIETS.diet_id,
					DIET_PLAN.food_id,
					DIET_PLAN.group_amount,
					DIET_PLAN.unit_id,
					DIET_PLAN.sort,
					DIET_PLAN.tote,
					FOOD.food,
					UNITS.unit,
					DIET_PLAN.line_notes,
					DIETS.table_id,
					FOOD.meat as meat,
					if(FOOD.meat=1,5,DIETS.table_id) AS target,
					DELIVERY_CONTAINERS.sort_order
	FROM (
			(
				LOCATIONS RIGHT JOIN 
				(
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
		LEFT JOIN UNITS
		ON DIET_PLAN.unit_id = UNITS.unit_id
	WHERE (
			(
				(DIET_PLAN.line_notes Not Like "%ZK%")
				OR
				(DIET_PLAN.line_notes is null)
			)
			AND
			(
				(IF(DAYOFWEEK(dayWanted) = 1, DIET_PLAN.sun, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 2, DIET_PLAN.mon, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 3, DIET_PLAN.tue, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 4, DIET_PLAN.wed, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 5, DIET_PLAN.thr, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 6, DIET_PLAN.fri, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 7, DIET_PLAN.sat, 0)) = 1
			) 
			AND
			DIETS.`current` = True
			AND
			DIETS.nc_prepares = True
			AND
			DIETS.group_id = 1
			AND
			(
				(
					Round((Round(DATEDIFF('2019-1-6', dayWanted)/7,0) Mod (DIET_PLAN.freq_weeks))+1,0) = DIET_PLAN.freq_rotation
				)
			)
		)
	UNION
	SELECT DISTINCT SUBENCLOSURES.group_id as diet_id,
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
					if(FOOD.meat = 1, 5, DIETS.table_id) as target,
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
				(DIET_PLAN.line_notes NOT LIKE "%ZK%")
				OR
				(DIET_PLAN.line_notes IS NULL)
			)
			AND
			DIETS.group_id <> 1
			AND
			DIETS.`current` = True
			AND
			DIETS.nc_prepares = True
			AND
			(
				(IF(DAYOFWEEK(dayWanted) = 1, DIET_PLAN.sun, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 2, DIET_PLAN.mon, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 3, DIET_PLAN.tue, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 4, DIET_PLAN.wed, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 5, DIET_PLAN.thr, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 6, DIET_PLAN.fri, 0)) = 1
				OR
				(IF(DAYOFWEEK(dayWanted) = 7, DIET_PLAN.sat, 0)) = 1
			) 
			AND
			(
				(
					Round((Round(DATEDIFF('2019-1-6', dayWanted)/7,0) Mod (DIET_PLAN.freq_weeks))+1,0) = DIET_PLAN.freq_rotation
				)
			)
		)
	GROUP BY SUBENCLOSURES.group_id,
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

	SELECT * from tTodayDietSub;
END