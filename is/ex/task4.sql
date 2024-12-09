/**
Завдання:
Створи таблицю employees, яка містить наступні поля:

employee_id (NUMBER, PRIMARY KEY)
first_name (VARCHAR2)
last_name (VARCHAR2)
hire_date (DATE)
salary (NUMBER)
Напиши триггер на вставку (AFTER INSERT), який автоматично обчислює і додає до таблиці
нову колонку salary_grade, де:

Якщо зарплата більше або дорівнює 5000, то salary_grade має значення 'High'.
Якщо зарплата від 3000 до 4999, то salary_grade має значення 'Medium'.
Якщо зарплата менша за 3000, то salary_grade має значення 'Low'.
Напиши процедуру, яка:

Приймає employee_id як параметр.
Повертає ім'я працівника, його зарплату та salary_grade.
Тобі потрібно реалізувати створення таблиці, триггер і процедуру для цієї задачі.
*/

CREATE TABLE employees (employee_id NUMBER PRIMARY KEY, first_name VARCHAR2, last_name VARCHAR2, hire_date DATE, salary NUMBER);

INSERT INTO employees (employee_id, first_name, last_name, hire_date, salary) VALUES
(1, 'John', 'Doe', TO_DATE('2020-01-15', 'YYYY-MM-DD'), 5500),
(2, 'Jane', 'Smith', TO_DATE('2019-11-25', 'YYYY-MM-DD'), 4500),
(3, 'Alice', 'Johnson', TO_DATE('2021-06-10', 'YYYY-MM-DD'), 2800),
(4, 'Bob', 'Williams', TO_DATE('2018-08-30', 'YYYY-MM-DD'), 6000);

CREATE OR REPLACE FUNCTION get_salary_grade(salary IN NUMBER) RETURN VARCHAR2 IS
grade VARCHAR2(10);
BEGIN
    IF salary > 5000 THEN
      grade:= 'High';

    ELSIF salary > 3000 AND salary < 5000 THEN
      grade:= 'Medium';

    ELSIF salary < 3000 THEN
      grade:= 'Low';
    END IF;
  
  RETURN grade;

END;


CREATE OR REPLACE TRIGGER check_salary_grade
AFTER INSERT OR UPDATE ON employees
FOR EACH ROW
DECLARE
  grade VARCHAR2;
BEGIN

END