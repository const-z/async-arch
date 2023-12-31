# Урок 0

## Общая схема сервисов
![Общая схема сервисов](./assets/common_services.png)

## Взаимодействие между сервисами
Предполагается асинхронное взаимодействие между сервисами.  
Обмен данными будет происходить через очередь сообщений.  
Сообщения будут содержать всю необходимую информацию для использования в сервисах, поэтому не придется выполнять доп запросы напрямую к сервисам.

### Сервис авторизации
![Взаимодействие сервиса авторизации](./assets/iteractions_auth.png)

### Сервис задач
![Взаимодействие сервиса задач](./assets/iteractions_tasks.png)

### Сервис расчетов
![Взаимодействие сервиса расчетов](./assets/iteractions_accounting.png)

### Сервис аналитики
![Взаимодействие сервиса аналитики](./assets/iteractions_analytics.png)

## Структура данных сервисов

### Сервис авторизации
![Данные сервиса авторизации](./assets/data_auth.png)

### Сервис задач
![Данные сервиса задач](./assets/data_tasks.png)

### Сервис расчетов
![Данные сервиса расчетов](./assets/data_accounting.png)

### Сервис аналитики
![Данные сервиса аналитики](./assets/data_analytics.png)
