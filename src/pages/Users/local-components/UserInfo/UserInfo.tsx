import { User } from "../../Users";
import React from "react";

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

export default UserInfo;
