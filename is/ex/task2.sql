/**
Створи тригер, який автоматично оновлює середній бал студента в
таблиці students при додаванні або зміні оцінки в таблиці grades.

Умови:

Якщо в таблиці grades додається новий запис або змінюється оцінка для
студента, потрібно перерахувати середній бал студента та оновити поле average_score в таблиці students.
Для перерахунку середнього балу використовуй функцію AVG().

Таблиці:
students:

student_id (NUMBER, PRIMARY KEY)
name (VARCHAR2)
average_score (NUMBER)
grades:

grade_id (NUMBER, PRIMARY KEY)
student_id (NUMBER, FOREIGN KEY)
score (NUMBER)
*/


CREATE OR REPLACE TRIGGER recalculate_student_average
AFTER INSERT OR UPDATE ON grades
FOR EACH ROW
DECLARE
  grades_average NUMBER;
BEGIN
  SELECT AVG(score) INTO grades_average FROM grades WHERE student_id = :NEW.student_id;
  UPDATE students SET average_score = grades_average WHERE student_id = :NEW.student_id;
END