DELIMITER $$
CREATE DEFINER=`zoo`@`%` PROCEDURE `GetFoodsInG`(IN DietId INT)
BEGIN
DROP TEMPORARY TABLE IF EXISTS UQryDietWeightsInG;
DROP TEMPORARY TABLE IF EXISTS QryDietInG;

CREATE TEMPORARY TABLE UQryDietWeightsInG
AS
SELECT 
	FOOD.food, 
	Sum((sun + mon + tue + wed + thr + fri + sat ) * (1/7) * (group_amount) * (conversion_to_g)) AS AvgGPerDay, 
	"g" AS unit, 
	DIET_PLAN.diet_id
FROM 
	UNITS 
	INNER JOIN (FOOD 
				INNER JOIN DIET_PLAN 
					ON FOOD.food_id = DIET_PLAN.food_id
				) 
		ON UNITS.unit_id = DIET_PLAN.unit_id
WHERE 
	UNITS.unit_type = "Weight"
GROUP BY 
	FOOD.food, 
	"g", 
	DIET_PLAN.diet_id, 
	UNITS.unit_type
	
UNION ALL

SELECT 
	FOOD.food, 
	(sun + mon + tue + wed + thr + fri + sat ) * (1/7) * group_amount AS AvgGPerDay, 
	UNITS.unit AS unit, 
	DIET_PLAN.diet_id
FROM 
	(UNITS 
	INNER JOIN (FOOD INNER JOIN DIET_PLAN ON FOOD.food_id = DIET_PLAN.food_id) 
		ON UNITS.unit_id = DIET_PLAN.unit_id) 
	LEFT JOIN FOOD_WEIGHTS 
		ON FOOD.food_id = FOOD_WEIGHTS.food_id
WHERE 
	(UNITS.unit_type = "Volume") 
	AND FOOD_WEIGHTS.weight_amount IS NULL 
	AND UNITS.unit_id <> 1		
	
UNION ALL

SELECT 
	FOOD.food, 
	(sun + mon + tue + wed + thr + fri + sat ) * (1/7) * group_amount / weight_amount * gm_weight AS AvgGPerDay, 
	"g" AS unit, 
	DIET_PLAN.diet_id
FROM 
	(UNITS 
	RIGHT JOIN (FOOD RIGHT JOIN DIET_PLAN ON FOOD.food_id = DIET_PLAN.food_id) 
		ON UNITS.unit_id = DIET_PLAN.unit_id) 
	LEFT JOIN FOOD_WEIGHTS 
		ON (DIET_PLAN.food_id = FOOD_WEIGHTS.food_id) AND (DIET_PLAN.unit_id = FOOD_WEIGHTS.unit_id_num)
WHERE 
	(sun + mon + tue + wed + thr + fri + sat ) * (1/7) * (group_amount / weight_amount * gm_weight) IS NOT NULL
	AND UNITS.unit_type = "Volume";

CREATE TEMPORARY TABLE QryDietInG
AS       
SELECT
	UQryDietWeightsInG.food, 
	UQryDietWeightsInG.diet_id,
	Sum(UQryDietWeightsInG.AvgGPerDay) AS SumOfAvgGPerDay, 
	Sum(cost_g * AvgGPerDay) AS COST,
	UQryDietWeightsInG.UNIT
FROM 
	UNITS
	INNER JOIN UQryDietWeightsInG ON UNITS.unit = UQryDietWeightsInG.unit 
	LEFT JOIN FOOD ON UQryDietWeightsInG.food = FOOD.food
GROUP BY 
	UQryDietWeightsInG.food, 
	UQryDietWeightsInG.diet_id,
	UQryDietWeightsInG.unit,
	UNITS.unit_id
ORDER BY 
	UNITS.unit_id;
    
SELECT
	QryDietInG.food,
    QryDietInG.SumOfAvgGPerDay
FROM
	QryDietInG
	INNER JOIN DIETS
		ON QryDietInG.diet_id = DIETS.diet_id
WHERE
	QryDietInG.unit = "g"
    AND DIETS.diet_id = DietId;

END$$
DELIMITER ;
