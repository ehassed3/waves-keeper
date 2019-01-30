# Waves Keeper v1.0.8

Приложение для хранения данных пользователя  
и проведения транзакций в блокчейн сети Waves.  
[Информация о сети Waves](https://docs.wavesplatform.com/en/)

## Waves Keeper API

На страницах броузера с установленным расширением 
становятся доступным глобальный объект WavesKeeper 
в котором вы найдете следующие методы:
`auth`, `publicState`, `signAndPublishCancelOrder`, `signAndPublishOrder`, 
`signAndPublishTransaction`, `signCancelOrder`, `signOrder`, 
`signTransaction`, `signRequest`, `signTransactionPackage`, `on`.  
> Все методы кроме `on` работают асинхронно и возвращают [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### publicState
Если сайт доверенный, возвращает публичные данные кипера.

Пример:
```
    WavesKeeper.publicState()
        .then(state => {
            console.log(state); //вывод в консоль результата
            /*...обработка данных */
        }).catch(error => {
            console.error(error); //вывод в консоль результата
            /*...обработка ошибок */
        })
      
```
или
```
    const getPublicState = async () => {
        try {
            const state = await WavesKeeper.publicState();
            console.log(state); //вывод в консоль результата
            /*...обработка данных */
        } catch(error) {
            console.error(error); //вывод в консоль результата
            /*...обработка ошибок */
        }
      }
      
      const result = await getPublicState();
```

ОТВЕТ
```
{
    "initialized": true,
    "locked": true,
    "account": {
        "name": "foo",
        "publicKey": "bar",
        "address": "waves адресс",
        "networkCode": "байт сети",
        "balance": {
            "available": "баланс в waves",
            "leasedOut": "баланс в лизинге"
        }
    },
    "network": {
        "code": "W",
        "server": "https://nodes.wavesplatform.com/",
        "matcher": "https://matcher.wavesplatform.com/"
    },
    "messages": [],
    "txVersion": {
        "3": [ 2 ],
        "4": [ 2 ],
        "5": [ 2 ],
        ...
    }
}
```
+ `initialized` - boolean кипер проинициализирован   
+ `locked` - boolean кипер в режиме ожидания  
+ `account` - текущий аккаунт, если пользователь разрешит сайту доступ, или null  
+ `network` - текущая сеть waves, адрес ноды и матчера    
+ `messages` - статусы запросов на подпись    
+ `txVersion` - доступные версии транзакций для каждого типа   


ОШИБКИ

+ `{ message: "Init Waves Keeper and add account" }` - кипер не проинициализирован 
+ `{ message: "Add Waves Keeper account" }` - вход в кипер произведен, но нет аккаунтов  
+ `{ message: "User denied message" }` -  пользователь запретил сайту работать с кипером  

### on
Позволяет подписаться на евенты из кипера.  

Поддерживает события:
* `update` - подписаться на изменения стейта

Пример:
```
   WavesKeeper.on('update', state => {
        //state бъект как из WavesKeeper.publicState
   });
```
Если сайт не доверенный события приходить не будут.


### auth
Метод, для получения подписи авторизационных данных при подтверждении пользователя Waves.
Работает аналогично протоколу авторизации [waves](https://docs.wavesplatform.com/en/development-and-api/client-api/auth-api.html).

Пример:
```
    const authData = { data: "Auth on my site" };
    Waves.auth(authData)
        .then(auth => {
            console.log(state); //вывод в консоль результата
            /*...обработка данных */
        }).catch(error => {
            console.error(error); //вывод в консоль результата
            /*...обработка ошибок */
        })
      
```
или
```
    const getAuthData = async authData => {
        try {
            const state = await WavesKeeper.auth(authData);
            console.log(state); //вывод в консоль результата
            /*...обработка данных */
        } catch(error) {
            console.error(error); //вывод в консоль результата
            /*...обработка ошибок */
        }
    }
    
    const authData = { data: "Auth on my site" };
    getAuthData(authData);
```

`auth` может принимать на вход следующие данные
+ `name` - название сервиса (не обязательное поле)
+ `data` - строка с любыми данными (обязательное поле)
+ `referrer` - полный url до сайта для редиректа (не обязательное поле)
+ `icon` - путь до лого, относительно `referrer` или origin сайта (не обязательное поле)
+ `successPath` - относительный путь до апи аунтификации сайта (не обязательное поле)

Например
```
    const authData = { 
        data: "Generated string from server",
        name: "My test App",
        icon: "/img/icons/waves_logo.svg",
        referrer: "https://client.wavesplatform.com/",
        successPath: "login"
    };
    
    WavesKeeper.auth(authData).then((data) => {
        //data - данные от кипера
        //проверка подписи и сохранение адреса...
        console.log(data);
    }).catch((error) => {
        //обработка ошибки
    });
    
    
```
При удачном подтверждении кипер в происе вернет объект содержащий данные для проверки подписи:
+ `host` - хост, запросивший подпись
+ `name` - название приложения запрашивающее подпись
+ `prefix` - префикс учавствующий в подписи
+ `address` - адрес в сети Waves
+ `publicKey` - публичный ключ пользователя
+ `signature` - подпись
+ `version` - версия апи

Как [проверить подпись](https://docs.wavesplatform.com/en/development-and-api/client-api/auth-api.html#section-2adf854e6133a03ce3003956df1f5c3b)?

ОШИБКИ

+ ``{message: "Invalid data", data: "[{"field":"data","type":"string","message":"field is required"}]", code: 9}`` - в данных на подпись есть ошибки  
+ ``{message: "User denied message", code: 10}`` - пользователь отклонил запрос  
+ ``{message: "Api rejected by user", code: 12}``сайт не является доверенным


### signTransaction
Метод для подписи транзакций в сети Waves. 

Пример:
```
    const txData = {
        type: 4,
        data: {
            amount: {
               assetId: 'WAVES',
               tokens: "1.567"
            },
            fee: {
                assetId: 'WAVES',
                tokens: "0.001"
            },
            recipient: 'test'
        }
    };
    WavesKeeper.signTransaction(txData).then((data) => {
        //data - строка готовая для отсылки на ноду(сервер) сети Waves
    }).catch((error) => { 
        //Обработка ошибок
    });
```
>  
> Апи возвращает строки, а не объект, так как в javascript при работе с 8 байтными целыми происходит потеря точности.
> 
> Описание поддерживаемых типов транзакций вы найдете ниже

В примере мы подписываем транзакцию на перевод токенов Waves на алиас `test` в сети Waves.  

ОТВЕТ
``{"version":2,"assetId":"", "amount":156700000,"feeAssetId":"","fee":100000, "recipient":"получатель","attachment":"", "timestamp":1548770230589,"senderPublicKey":"публичный ключ","proofs":["подпись"],"type":4}``

ОШИБКИ
+ ``{message: "User denied message", code: 10}`` - пользователь отклонил запрос
+ ``{message: "Api rejected by user", code: 12}`` - Сайт является не доверенным
+ ``{message: "Invalid data", data: "Причина", code: 9}`` - неверные/неполные данные запроса


### signAndPublishTransaction
Аналогичен `signTransaction`, но плюс еще отправляет транзакцию в блокчейн.

Пример:
```
   const txData = {
           type: 4,
           data: {
               amount: {
                  assetId: 'WAVES',
                  tokens: "1.567"
               },
               fee: {
                   assetId: 'WAVES',
                   tokens: "0.001"
               },
               recipient: 'test'
           }
       };
       WavesKeeper.signAndPublishTransaction(txData).then((data) => {
           //data - строка готовая для отсылки на ноду(сервер) сети Waves
       }).catch((error) => { 
           //Обработка ошибок
       });
```

ОТВЕТ
Возвращается строкой ответ от сети Waves - полное содержание прошедшей транзакции

ОШИБКИ    
``{message: "Filed request", data: "Описание ошибки", code: 15}`` - реквест подписали, но не смогли отправить дальше


### signTransactionPackage
Пакетная подпись транзакций.
Иногда надо подписать сразу несколько транзакций, для удобства пользователя, 
допускается подписывать до 7 транзакций одновременно, и разрешены только 
определенные типы транзакций:  

```
    3 - выпуск токена
    2 - перевод токенов
    5 - перевыпуск токенов
    6 - сжигание токенов
    10 - создaние алиса на адрес в сети waves
    11 - массовый перевод
    12 - транзакция с данными
```

Пример:

```
    const name = 'For Test';
    const tx = [{
        type: 4,
        data: {
            amount: {
               assetId: 'WAVES',
               tokens: "1.567"
            },
            fee: {
                assetId: 'WAVES',
                tokens: "0.001"
            },
            recipient: 'test'
    }},{
        type: 4,
        data: {
            amount: {
               assetId: 'WAVES',
               tokens: "0.51"
            },
            fee: {
                assetId: 'WAVES',
                tokens: "0.001"
            },
            recipient: 'merry'
        }
    }];
    
    WavesKeeper.signTransactionPackage(tx, name)
```

Подписать 2 транзакции:
+ перевода на алиас test 1.567 Waves
+ перевода на алиас merry 0.1 Waves
    
    
ОТВЕТ

массив из 2-х строк, подписанных и готовых к отправке транзакций.

ОШИБКИ
Аналогично `signTransaction`.


## Транзакции
У каждого пользователя в сети waves есть стейт (балансы, ассеты, данные, скрипты), 
любая прошедшая транзакция меняет эти данные.  
В wavesKeeper API - отличается от [NODE REST API](https://docs.wavesplatform.com/en/development-and-api/waves-node-rest-api.html).  
`signTransaction`, `signAndPublishTransaction` принимают транзакцию в следующем виде 
```
{
    type: number //тип транзакции,
    data: {
        ... //данные транзакции
    }
}
```

Условные обозначения

> \* - необязательное поле, данные подставятся автоматически из WavesKeeper.  
> [x,y] - oграничение длины от x, до y.   
> [,x] - oграничение длины до x.  
> [y,] - oграничение длины от y.  
> [x-y] - число от x до y.
> x/y - x или y.
> (JLM) - JAVA LONG MAX =  9 223 372 036 854 775 807  
> MoneyLike - цена

MoneyLike может иметь вид:  
* ``{ tokens: 1, assetid: 'WAVES' }``
* ``{ coins: 100000000, assetid: 'WAVES' }``; 
  
В обоих записях указана одинаковая цена 1 WAVES. Можно свободно перевести `coins` в `tokens` и  обратно,
зная в каком ассете указана цена и получив его точность `tokens = coins / (10 ** precision)`
  
***

### [Тип 3 ISSUE - выпуск токена](https://docs.wavesplatform.com/en/platform-features/assets-custom-tokens.html#section-8b6593d26c82bcc46ea77e373128b6f3)  

+ `name` [4, 16] строка - Название токена,
+ `description` [0, 1000] строка - Описание токена,
+ `quantity` [0 - (JLM)]  число/строка - количество,
+ `precision`  [0 - 8]  число - точность,
+ `reissuable` true|false - возможно перевыпускать,
+ `fee` MoneyLike -комиссия 
+ `*script`: строка - Asset script
+ `*senderPublicKey` строка - публичный ключ отправителя в base58
+ `*timestamp` число/строка - время в мс

 
ПРИМЕР:

```
   WavesKeeper.signAndPublishTransaction({
        type: 3,
        data: {
             "name": "Best Token",
             "description": "Greate token",
             "quantity": 1000000,
             "precision": 2,
             "reissuable": true,
             "fee": {
                 "tokens": "1",
                 "assetId": "WAVES"
             }
        }
   }).then((tx) => {
        console.log('Ура я создал свой ассет!!!');
   }).catch((error) => {
        console.error('Что-то пошло не так', error);
   });
```

В случае успеха мы выпускаем новыйй ассет в количестве 1000000 шт.
которые будут на вашем балансе 10000.00 Best Token


### [Тип 4 TRANSFER - передача токена](https://docs.wavesplatform.com/en/development-and-api/waves-node-rest-api/asset-transactions/public-functions.html#section-0c8edc11ae61814aebb41d3eeccbb831)  

+ `amount` MoneyLike - количество,
+ `recipient` string - адрес получателя или алиас
+ `attachment`[,140 bytes в base58] string - доп информация
+ `fee` MoneyLike - комиссия 
+ `*senderPublicKey` строка - публичный ключ отправителя в base58
+ `*timestamp` число/строка - время в мс


ПРИМЕР:

```
    WavesKeeper.signAndPublishTransaction({
        type: 4,
        data: {
            amount: { tokens: "3.3333333", assetId: "WAVES" },
            fee: { tokens: "0.001", assetId: "WAVES"},
            recipient: "merry"
        }
    }).then((tx) => {
         console.log('Ура я довыпустил токен!!!');
    }).catch((error) => {
         console.error('Что-то пошло не так', error);
    });

```

### [Тип 5 REISSUE - довыпуск токенов](https://docs.wavesplatform.com/en/platform-features/assets-custom-tokens.html#section-2afead90ebe874ae06338a9253b0dc9d)  

+ `assetId` строка - "Id ассета",
+ `quantity` [0 - (JLM)]  число/строка/MoneyLike - количество,
+ `reissuable` false - запретить перевыпускать
+ `fee` MoneyLike -комиссия 
+ `*senderPublicKey` строка - публичный ключ отправителя в base58
+ `*timestamp` число/строка - время в мс

 
ПРИМЕР:

```
      WavesKeeper.signAndPublishTransaction({
           type: 5,
           data: {
                "quantity": 1000,
                "assetId": "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS",
                "fee": {
                    "tokens": "1",
                    "assetId": "WAVES"
                }
           }
      }).then((tx) => {
           console.log('Ура я довыпустил токен!!!');
      }).catch((error) => {
           console.error('Что-то пошло не так', error);
      });
```

В случае успеха мы выпускаем новыйй ассет в количестве 1000000 шт.
которые будут на вашем балансе 10000.00 Best Token


### [Тип 6 BURN - сжигание токена](https://docs.wavesplatform.com/en/platform-features/assets-custom-tokens.html#section-423d9cffbd0e1a0b1298bf22c176fac3)  

+ `assetId` строка - Id ассета,
+ `quantity` [0 - (JLM)]  число/строка/MoneyLike - количество,
+ `fee` MoneyLike -комиссия 
+ `*senderPublicKey` строка - публичный ключ отправителя в base58
+ `*timestamp` число/строка - время в мс

 
ПРИМЕР:

```
   WavesKeeper.signAndPublishTransaction({
        type: 6,
        data: {
             "quantity": 1000,
             "assetId": "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS",
             "fee": {
                 "tokens": "0.001",
                 "assetId": "WAVES"
             }
        }
   }).then((tx) => {
        console.log('Ура я сжег токен!!!');
   }).catch((error) => {
        console.error('Что-то пошло не так', error);
   });
```

В случае успеха сжигается 1000 шт. 


