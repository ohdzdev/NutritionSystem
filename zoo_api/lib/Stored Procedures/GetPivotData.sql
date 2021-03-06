CREATE DEFINER=`zoo`@`%` PROCEDURE `GetPivotData`()
BEGIN
	SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
    
	SELECT
		NUTR_DEF.bgt_Name,
		FOOD.food,
		avg(NUT_DATA.nutr_val) AS AvgOfNutr_Val
	FROM
		NUTR_DEF
		LEFT JOIN (FOOD RIGHT JOIN NUT_DATA ON FOOD.food_id = NUT_DATA.food_id)
			ON NUTR_DEF.nutr_no = NUT_DATA.nutr_no
	WHERE
		FOOD.food IS NOT NULL
		AND NUTR_DEF.bgt_Name IS NOT NULL
	GROUP BY 
		FOOD.food,
		NUTR_DEF.bgt_Name
	ORDER BY
		NUTR_DEF.sr_order,
        FOOD.food;
END
