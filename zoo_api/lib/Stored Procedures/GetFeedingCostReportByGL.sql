CREATE DEFINER=`zoo`@`%` PROCEDURE `zoo`.`GetFeedingCostReportByGL`()
BEGIN
	
	DROP TEMPORARY TABLE IF EXISTS tWeightGramCostByGL;
	DROP TEMPORARY TABLE IF EXISTS tVolumeNullGroupAmountCostByGL;
	DROP TEMPORARY TABLE IF EXISTS tVolumeGramCostByGL;

	CREATE TEMPORARY TABLE tWeightGramCostByGL
	AS
	SELECT
		L.location AS location,
		DC.dc as dc,
		D.diet_id as diet_id,
		F.food as food,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount*U.conversion_to_g), 2) AS AvgGPerDay,
		"g" AS unit,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount*U.conversion_to_g)*F.cost_g, 2) AS CostGPerDay,
		F.budget_id as budget_id
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
		DP.group_amount,
		F.budget_id
	HAVING
		DP.group_amount IS NOT NULL
		AND U.conversion_to_g IS NOT NULL
		AND U.unit_type = "Weight"
		AND D.`current` = 1;
	

	CREATE TEMPORARY TABLE tVolumeNullGroupAmountCostByGL
	AS
	SELECT
		L.location as location,
		DC.dc as dc,
		D.diet_id as diet_id,
		F.food as food,
		0 AS AvgGPerDay,
		U.unit as unit,
		0 as CostGPerDay,
		F.budget_id as budget_id
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
		DP.group_amount,
		F.budget_id
	HAVING
		D.`current` = 1
		AND U.unit_type = "Volume"
		AND DP.group_amount Is Null
		AND U.unit_id != 1;

	
	CREATE TEMPORARY TABLE tVolumeGramCostByGL
	AS
	SELECT
		L.location,
		DC.dc,
		D.diet_id,
		F.food,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount/W.weight_amount*W.gm_weight), 2) As AvgGPerDay,
		U.unit as unit,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount/W.weight_amount*W.gm_weight)*F.cost_g, 2) as CostGPerDay,
		F.budget_id as budget_id
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
		U.unit,
		F.budget_id
	HAVING
		DP.group_amount IS NOT NULL
		AND W.gm_weight IS NOT NULL
		AND U.unit_type = "Volume"
		AND D.`current`= 1;
		
	SELECT
		RES.location,
		B.budget_code as budgetId,
		ROUND(Sum(RES.CostGPerDay), 2) AS SumOfCostGPerDay
	FROM
		(select * from tWeightGramCostByGL
		UNION ALL
		select * from tVolumeNullGroupAmountCostByGL
		UNION ALL
		select * from tVolumeGramCostByGL) RES
		INNER JOIN BUDGET_IDS B ON RES.budget_id = B.budget_id
	GROUP BY
		RES.location,
		B.budget_code
	ORDER BY RES.LOCATION;
	
END