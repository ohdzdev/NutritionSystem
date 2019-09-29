CREATE DEFINER=`zoo`@`%` PROCEDURE `zoo`.`GetDietCostReport`(IN DietFilter INT)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tWeightGramCost;
	DROP TEMPORARY TABLE IF EXISTS tVolumeNullGroupAmountCost;
	DROP TEMPORARY TABLE IF EXISTS tVolumeGramCost;

	CREATE TEMPORARY TABLE tWeightGramCost
	AS
	SELECT
		D.diet_id as diet_id,
		F.food as food,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount*U.conversion_to_g), 2) AS AvgGPerDay,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount), 2) AS AvgSourceUnitPerDay,
		U.unit AS unit,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount*U.conversion_to_g)*F.cost_g, 2) AS CostGPerDay
	FROM
		DIETS D
	INNER JOIN DIET_PLAN DP ON D.diet_id = DP.diet_id
	INNER JOIN UNITS U ON U.unit_id = DP.unit_id
	INNER JOIN FOOD F ON DP.food_id = F.food_id
	GROUP BY
		D.diet_id,
		F.food,
		U.unit,
		U.unit_type,
		D.`current`,
		F.cost_g,
		U.conversion_to_g,
		DP.group_amount
	HAVING
		DP.group_amount IS NOT NULL
		AND U.conversion_to_g IS NOT NULL
		AND U.unit_type = "Weight";


	CREATE TEMPORARY TABLE tVolumeNullGroupAmountCost
	AS
	SELECT
		D.diet_id as diet_id,
		F.food as food,
		0 AS AvgGPerDay,
		0 AS AvgSourceUnitPerDay,
		U.unit as unit,
		0 as CostGPerDay
	FROM
		DIETS D
	INNER JOIN DIET_PLAN DP ON D.diet_id = DP.diet_id
	INNER JOIN UNITS U ON U.unit_id = DP.unit_id
	INNER JOIN FOOD F ON DP.food_id = F.food_id
	LEFT JOIN FOOD_WEIGHTS W ON F.food_id = W.food_id
	GROUP BY
		D.diet_id,
		F.food,
		U.unit,
		D.`current`,
		U.unit,
		U.unit_type,
		U.unit_id,
		F.cost_g,
		DP.group_amount
	HAVING
		U.unit_type = "Volume"
		AND DP.group_amount Is Null
		AND U.unit_id != 1;

	
	
	CREATE TEMPORARY TABLE tVolumeGramCost
	AS
	SELECT
		D.diet_id,
		F.food,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount/W.weight_amount*W.gm_weight), 2) As AvgGPerDay,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount), 2) AS AvgSourceUnitPerDay,
		U.unit as unit,
		ROUND(Sum((DP.sun+DP.mon+DP.tue+DP.wed+DP.thr+DP.fri+DP.sat)*(1/7)*DP.group_amount/W.weight_amount*W.gm_weight)*F.cost_g, 2) as CostGPerDay
	FROM
		DIETS D
	INNER JOIN DIET_PLAN DP ON D.diet_id = DP.diet_id
	INNER JOIN UNITS U ON U.unit_id = DP.unit_id
	INNER JOIN FOOD F ON DP.food_id = F.food_id
	LEFT JOIN FOOD_WEIGHTS W ON F.food_id = W.food_id
	GROUP BY
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
		AND U.unit_type = "Volume";



	SELECT
		RES.food,
		RES.diet_id,
		ROUND(SUM(RES.AvgGPerDay), 2) as AvgGPerDay,
		ROUND(SUM(RES.AvgSourceUnitPerDay), 2) as AvgSourceUnitPerDay,
		ROUND(SUM(RES.CostGPerDay), 2) as CostGPerDay,
		RES.unit
	FROM
		(select * from tWeightGramCost
		UNION ALL
		select * from tVolumeNullGroupAmountCost
		UNION ALL
		select * from tVolumeGramCost) RES
	WHERE
		IFNULL(DietFilter, 0) = 0
		OR RES.diet_id = IFNULL(DietFilter, 0)
	GROUP BY
		RES.diet_id,
		RES.food,
		RES.unit;
END