CREATE DEFINER=`zoo`@`%` PROCEDURE `zoo`.`GetLastDietChanges`(IN num int(10))
BEGIN
	SELECT dc1.diet_id, dc1.diet_change_reason, dc1.diet_change_date
	FROM DIET_CHANGES as dc1
	LEFT JOIN DIET_CHANGES as dc2
	ON dc1.diet_id = dc2.diet_id AND dc1.diet_change_date < dc2.diet_change_date
	GROUP BY dc1.diet_id, dc1.diet_change_reason, dc1.diet_change_date
	HAVING COUNT(dc1.diet_id) < num
	ORDER BY dc1.diet_id, dc1.diet_change_date DESC;
END