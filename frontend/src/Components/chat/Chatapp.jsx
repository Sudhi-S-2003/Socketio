import React, { useContext } from "react";
import Public from "./Public";
import UserCreate from "./UserCreate";
import { UserProvider, UserContext } from "./UserProvider";
import HistoryPublic from "./HistoryPublic";

function Chatapp() {
  return (
    <UserProvider>
      <Content />
    </UserProvider>
  );
}

function Content() {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user ? 
      // <Public /> 
      <HistoryPublic/>
      
      : <UserCreate />}
    </div>
  );
}

export default Chatapp;
