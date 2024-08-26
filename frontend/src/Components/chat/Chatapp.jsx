import  { useContext, useState } from "react";
import Public from "./Public";
import UserCreate from "./UserCreate";
import { UserProvider, UserContext } from "./UserProvider";
import HistoryPublic from "./HistoryPublic";
import PrivateChat from "./PrivateChat";
import GroupChat from "./GroupChat";

function Chatapp() {
  return (
    <UserProvider>
      <Content />
    </UserProvider>
  );
}

function Content() {
  const { user } = useContext(UserContext);
  const [tap,setTap]=useState('public');
  const renderContent = () => {
    switch (tap) {
      case 'historypublic':
        return <HistoryPublic />;
      case 'public':
        return <Public />;
      case 'private':
        return <PrivateChat/>;
      case 'group':
        return <GroupChat/>;
      default:
        return <div>Unknown tab</div>;
    }
  };
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setTap('public')}>Public</button>
        <button onClick={() => setTap('historypublic')}>History Public</button>
        <button onClick={() => setTap('private')}>Private</button>
        <button onClick={() => setTap('group')}>Group</button>
      </div>
      {user ? 
      // <Public /> 
      renderContent()
      
      : <UserCreate />}
    </div>
  );
}

export default Chatapp;
