# maru-mongo

Компонент, отвечающий за работу с базами данных Mongo.

## Как добавить

Установка

```sh
npm install --save github:ccet-projects/maru-mongo
```

Точка входа в приложение

```js
import maru from 'maru';
import mongo from '@maru/mongo';

const app = maru(import.meta.url, [mongo]);
app.start();
```

Используемые ключи конфига

| Название | Обязательно | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| host | Нет | 'localhost' | Хост сервера базы данных |
| port | Нет | 27017 | Порт сервера базы данных |
| user | Нет |  | Пользователь базы данных |
| password | Нет |  | Пароль пользователя базы данных |
| database | Да |  | Название базы данных |
| url | Нет | `mongodb://{host}:{port}` | URI сервера базы данных (см. https://www.mongodb.com/docs/manual/reference/connection-string/)  |
| mongoClientOptions | Нет |  | Параметры клиента (см. https://www.mongodb.com/docs/manual/reference/connection-string/) |

Если требуется подключение только к одной базе данных, ключи конфигурации можно указать в корневом уровне конфига.

Пример файла конфигурации

```json
{
    host: 'localhost',
    port: 27017,
    user: 'user',
    password: 'password',
    database: 'dbname'
}
```

В таком случае базаданных будет доступна через объект ```app.mongo ```

Если требуется подключение к нескольким базам, ключи можно перечислить на втором уровне конфига - внутри кастомного ключа. Название кастомного ключа при этом будет названием подключения, а подключение будет доступно через объект ```app.mongo.connectionName ```

Пример файла конфигурации для подключения к нескольким базам данных

```json
{
    connection1: {
        host: 'localhost',
        port: 27017,
        user: 'user1',
        password: 'password1',
        database: 'dbname1'
    },
    connection2: {
        host: 'localhost',
        port: 27017,
        user: 'user2',
        password: 'password2',
        database: 'dbname2'
    },
}
```

Если в конфигурации указано несколько подключений, но при этом на корневом уровне присутствуют стандартные ключи, их значения будут использованы как значения по умолчанию. При этом, если на корневом уровне указан ключ ```database```, кастомные ключи будут игнорироваться и будет подключена только одна база данных, данные которой указаны на корневом уровне.

Для работы с базами данных компонент использует MongoDB Node.js Driver. См. https://www.mongodb.com/docs/drivers/node
