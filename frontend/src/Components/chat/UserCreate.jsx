import { useContext, useState } from "react";
import { UserContext } from './UserProvider'; 

export default function UserCreate() {
    const { user, setUser } = useContext(UserContext);
    const [inputValue, setInputValue] = useState(user ? user.username : '');

    const handleUpdateUser = () => {
        setUser({ username: inputValue });
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleUpdateUser}>Update User</button>
        </div>
    );
}
