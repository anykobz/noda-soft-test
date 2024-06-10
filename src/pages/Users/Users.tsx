import React, { useState, useRef } from "react";
import { useThrottle } from "../../hooks";
import { Button, UserInfo } from "./local-components";

export type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

export type Address = {
  city: string;
  geo: { lat: string; lng: string };
  street: string;
  suite: string;
  zipcode: string;
};
export type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: Address;
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
