/**
Задача 1: Проста процедура
Напишіть процедуру, яка:

Приймає student_id як вхідний параметр.
Розраховує середній бал студента на основі його оцінок із таблиці grades.
Виводить середній бал у консоль.
Схема таблиць:

Таблиця students:
student_id (NUMBER, PRIMARY KEY)
name (VARCHAR2)
average_score (NUMBER)
Таблиця grades:
grade_id (NUMBER, PRIMARY KEY)
student_id (NUMBER, FOREIGN KEY)
score (NUMBER)
Підказка: Використайте курсор або агрегатні функції для обчислення середнього бала.

Коли будеш готовий, надішли свій код! 😊
*/


CREATE OR REPLACE FUNCTION get_student_average_grade (student_id IN NUMBER) RETURN NUMBER IS
  average NUMBER;
BEGIN
  SELECT AVG(score) INTO average FROM grades WHERE student_id =get_student_average_grade. student_id;

  RETURN average;
END