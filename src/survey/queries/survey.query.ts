export const READ_SURVEY = `SELECT
s.id as id,
s.title as title,
s.description as description, 
s.max_participants as max_participants,
s.now_participants as now_participants,
q.id as question_id,
q.title as question_title,
q.order as question_order,
c.id as choice_id,
c.content as choice_content,
c.content as choice_order
FROM survey s
LEFT JOIN question q ON q.survey_id = s.id
LEFT JOIN choice c ON c.question_id = q.id
WHERE s.id = ?
ORDER BY q.order, c.order
`;

export const GENDER_AND_AGE = `WITH AgeCategories AS (
    SELECT
      id AS user_id,
      FLOOR((YEAR(CURRENT_DATE()) - YEAR(birth)) / 10) * 10 AS age_category
    FROM user
  )
  
  SELECT
    US.survey_id AS survey_id,
    Q.id AS question_id,
    Q.title AS question_title,
    C.id AS choice_id,
    C.content AS choice_content,
    COUNT(*) AS total_responses,
    ROUND((SUM(CASE WHEN U.gender = 'F' THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS 'women',
    ROUND((SUM(CASE WHEN U.gender = 'M' THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS 'men',
    ROUND((SUM(CASE WHEN AC.age_category = 10 THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS '10_age',
    ROUND((SUM(CASE WHEN AC.age_category = 20 THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS '20_age',
    ROUND((SUM(CASE WHEN AC.age_category = 30 THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS '30_age',
    ROUND((SUM(CASE WHEN AC.age_category = 40 THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS '40_age',
    ROUND((SUM(CASE WHEN AC.age_category = 50 THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS '50_age',
    ROUND((SUM(CASE WHEN AC.age_category >= 60 THEN 1 ELSE 0 END) / COUNT(*) * 100), 2) AS '60_age_more'
  FROM
    user_survey US
    JOIN user U ON US.user_id = U.id
    JOIN user_answer UA ON US.id = UA.user_survey_id
    JOIN question Q ON Q.id = UA.question_id
    JOIN choice C ON C.id = UA.choice_id
    JOIN AgeCategories AC ON U.id = AC.user_id
  WHERE
      Q.survey_id = ?
  GROUP BY
    Q.id,
    C.id
  ORDER BY
    Q.id,
    C.id;
  `;
