CREATE DEFINER=`zoo`@`%` PROCEDURE `zoo`.`GetFeedingCostReport`()
BEGIN
	
	DROP TEMPORARY TABLE IF EXISTS tWeightGramCost;
	DROP TEMPORARY TABLE IF EXISTS tVolumeNullGroupAmountCost;
	DROP TEMPORARY TABLE IF EXISTS tVolumeGramCost;

	CREATE TEMPORARY TABLE tWeightGramCost
	AS
	SELECT
		L.location AS location,
		DC.dc as dc,
		D.diet_id as diet_id,
		F.food as food,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount*U.conversion_to_g), 2) AS AvgGPerDay,
		"g" AS unit,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount*U.conversion_to_g)*F.cost_g, 2) AS CostGPerDay
	FROM
		DIETS D
	INNER JOIN DIET_PLAN DP ON D.diet_id = DP.diet_id
	INNER JOIN UNITS U ON U.unit_id = DP.unit_id
	INNER JOIN FOOD F ON DP.food_id = F.food_id
	INNER JOIN DELIVERY_CONTAINERS DC ON D.dc_id = DC.dc_id
	INNER JOIN LOCATIONS L ON DC.location_id = L.location_id
	GROUP BY
		L.location,
		DC.dc,
		D.diet_id,
		F.food,
		"g",
		U.unit_type,
		D.`current`,
		F.cost_g,
		DP.id,
		U.conversion_to_g,
		DP.group_amount
	HAVING
		DP.group_amount IS NOT NULL
		AND U.conversion_to_g IS NOT NULL
		AND U.unit_type = "Weight"
		AND D.`current` = 1;
	

	CREATE TEMPORARY TABLE tVolumeNullGroupAmountCost
	AS
	SELECT
		L.location as location,
		DC.dc as dc,
		D.diet_id as diet_id,
		F.food as food,
		0 AS AvgGPerDay,
		U.unit as unit,
		0 as CostGPerDay
	FROM
		DIETS D
	INNER JOIN DIET_PLAN DP ON D.diet_id = DP.diet_id
	INNER JOIN UNITS U ON U.unit_id = DP.unit_id
	INNER JOIN FOOD F ON DP.food_id = F.food_id
	LEFT JOIN FOOD_WEIGHTS W ON F.food_id = W.food_id
	INNER JOIN DELIVERY_CONTAINERS DC ON D.dc_id = DC.dc_id
	INNER JOIN LOCATIONS L ON DC.location_id = L.location_id
	GROUP BY
		L.location,
		DC.dc,
		D.diet_id,
		F.food,
		U.unit,
		D.`current`,
		U.unit_type,
		U.unit_id,
		F.cost_g,
		DP.group_amount
	HAVING
		D.`current` = 1
		AND U.unit_type = "Volume"
		AND DP.group_amount Is Null
		AND U.unit_id != 1;

	
	CREATE TEMPORARY TABLE tVolumeGramCost
	AS
	SELECT
		L.location,
		DC.dc,
		D.diet_id,
		F.food,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount/W.weight_amount*W.gm_weight), 2) As AvgGPerDay,
		U.unit as unit,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount/W.weight_amount*W.gm_weight)*F.cost_g, 2) as CostGPerDay
	FROM
		DIETS D
	INNER JOIN DIET_PLAN DP ON D.diet_id = DP.diet_id
	INNER JOIN UNITS U ON U.unit_id = DP.unit_id
	INNER JOIN FOOD F ON DP.food_id = F.food_id
	LEFT JOIN FOOD_WEIGHTS W ON F.food_id = W.food_id
	INNER JOIN DELIVERY_CONTAINERS DC ON D.dc_id = DC.dc_id
	INNER JOIN LOCATIONS L ON DC.location_id = L.location_id
	GROUP BY
		L.location,
		DC.dc,
		D.diet_id,
		F.food,
		"g",
		U.unit_type,
		D.`current`,
		F.cost_g,
		DP.group_amount,
		W.gm_weight,
		U.unit
	HAVING
		DP.group_amount IS NOT NULL
		AND W.gm_weight IS NOT NULL
		AND U.unit_type = "Volume"
		AND D.`current`= 1;
	
	SELECT
		RES.location,
		RES.dc,
		RES.diet_id,
		S.species,
		ROUND(SUM(RES.CostGPerDay), 2) as SumOfCostGPerDay,
		D.num_animals
	FROM
		(select * from tWeightGramCost
		UNION ALL
		select * from tVolumeNullGroupAmountCost
		UNION ALL
		select * from tVolumeGramCost) RES
	INNER JOIN DIETS D ON RES.diet_id = D.diet_id
	INNER JOIN SPECIES S ON D.species_id = S.species_id
	GROUP BY
		RES.location,
		RES.dc,
		RES.diet_id,
		S.species,
		D.num_animals
	ORDER BY
		RES.location;
	
END