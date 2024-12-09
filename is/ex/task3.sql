/**
Ось наступна задача:

**Задача:**

Створити тригер, який автоматично оновлює поле `status` в таблиці `orders` на значення "processed", коли сума всіх товарів в замовленні стає більшою або рівною 1000. Якщо сума товарів в замовленні змінюється, потрібно перевірити, чи потрібно змінювати статус на "processed".

**Таблиці:**
- **orders**:
  - order_id (NUMBER, PRIMARY KEY)
  - customer_id (NUMBER, FOREIGN KEY)
  - status (VARCHAR2)
- **order_items**:
  - order_item_id (NUMBER, PRIMARY KEY)
  - order_id (NUMBER, FOREIGN KEY)
  - product_id (NUMBER, FOREIGN KEY)
  - quantity (NUMBER)
  - price (NUMBER)

**Умови**:
1. Тригер повинен спрацьовувати після зміни запису в таблиці `order_items`.
2. Якщо сума для відповідного замовлення перевищує або дорівнює 1000, статус замовлення має бути оновлений на "processed".

Напиши код тригера, і я перевірю його для тебе!
*/

CREATE OR REPLACE TRIGGER update_order_status
AFTER INSERT OR UPDATE ON order_items
  FOR EACH ROW
DECLARE
  order_total NUMBER;
BEGIN
  SELECT SUM(price * quantity) INTO order_total FROM order_items WHERE order_id = :NEW.order_id;

  IF order_total > 1000 THEN
    UPDATE orders SET status = 'processed' WHERE order_id = :NEW.order_id;
  END IF;

END;