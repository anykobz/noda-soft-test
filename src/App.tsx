// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, { useState, useRef } from "react";
import { useThrottle } from "./hooks";

// eslint-disable-next-line no-lone-blocks
{
  /*
Решение задачи:

1. Перенесла константу URL в функцию, где она непосредственно используется.
2. Переделала вид функциональных компонентов на стрелочные функции.

3. Для улучшения пользовательского опыта, добавила обработку загрузки и ошибок с помощью стейтов:
   - Добавила отлавливание ошибок внутри функции receiveRandomUser.
   - Чтобы отлавливать ошибки запросов, использую условие if (!response.ok) {...} с ранним ретёрном.
   - Для дополнительной защиты от сетевых ошибок добавила обёртку try/catch/finally.

4. Ошибки типов:
   - В стейте item не было никакой причины использовать тип Record<number, User>. Компонент UserInfo ожидает тип User и setItem также передаёт объект типа User.
   - Поменяла в стейте тип на User и добавила, что значение также может быть null, поскольку это начальное значение.
   - Добавила тип Address и подставила его вместо any в интерфейсе User.

5. Добавила обработку null в компоненту UserInfo, а также опциональную цепочку чтобы избежать ошибок при user === null.

6. Кеширование пользователя:
   - Внутри компонента с использованием хука useRef, чтобы сохранять кеш в течение жизни компонента.
   - Для этой цели обычно использую React TanstackQuery, но для текущей задачи это оправдано.

7. Реализовала кастомный хук useThrottle, положила его в общедоступную папку hooks:
   - Использование возможно в любом компоненте приложения.
   - В App прикрутила его к функции, срабатывающей при нажатии кнопки, и поставила таймер 0,5 сек.
   - Если пользователь пытается получить данные раньше - выводится уведомление и оставшееся время до следующего запроса.

8. В useThrottle реализовала хук useCallback для того, чтобы функция пересоздавалась только при изменении одной из зависимостей: [func, timer, delay]. Если их не использовать - могут быть вызваны лишние рендеры дочерних компонентов и эффектов от неё зависящих.

9. Компоненты не нуждаются в оборачивании хуком useMemo, так как они не содержат сложных вычислений и визуально нет никаких лишних перерисовок компонентов.
*/
}

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type Address = {
  city: string;
  geo: { lat: string; lng: string };
  street: string;
  suite: string;
  zipcode: string;
};
type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: Address;
};

interface IButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface IUserInfoProps {
  user: User | null;
  isLoading: boolean;
  isError?: boolean;
}

const UserInfo = ({ user, isLoading, isError }: IUserInfoProps) => {
  const Data = () => {
    if (isLoading) {
      return (
        <tr>
          <td>...Loading</td>
        </tr>
      );
    }
    if (isError) {
      return (
        <tr>
          <td>X Error!</td>
        </tr>
      );
    }
    return (
      <tr>
        {isError}
        <td>{user?.name ?? "Name will be here"}</td>
        <td>{user?.phone ?? "Phone number will be here"}</td>
        <td>{user?.company?.name ?? "Company name will be here"}</td>
      </tr>
    );
  };
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
          <th>Company name</th>
        </tr>
      </thead>
      <tbody>
        <Data />
      </tbody>
    </table>
  );
};

const Button = ({ onClick }: IButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      get random user
    </button>
  );
};

const App = () => {
  const [item, setItem] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const cache = useRef<Record<number, User>>({});

  const receiveRandomUser = async () => {
    const URL = "https://jsonplaceholder.typicode.com/users";
    const id = Math.floor(Math.random() * (10 - 1)) + 1;
    if (cache.current[id]) {
      setItem(cache.current[id]);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${URL}/${id}`);
      const _user = (await response.json()) as User;

      if (!response.ok) {
        return setIsError(true);
      }
      cache.current[id] = _user;
      response.ok ? setItem(_user) : setItem(null);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setItem(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = useThrottle(
    (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event?.stopPropagation();
      setIsLoading(true);
      setIsError(false);
      receiveRandomUser();
    },
    500
  );

  return (
    <div>
      <header>Get a random user</header>
      <Button onClick={handleButtonClick} />
      <UserInfo isLoading={isLoading} isError={isError} user={item} />
    </div>
  );
};

export default App;
