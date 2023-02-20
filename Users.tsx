import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addUser, deleteUser, updateUser } from '../store/user';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Users() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.user.users);
    const error = useSelector((state: RootState) => state.user.error);

    useEffect(() => {
        dispatch({ type: 'GET_USERS' });
    }, []);

    const handleAddUser = (user: User) => {
        dispatch(addUser(user));
    };

    const handleUpdateUser = (user: User) => {
        dispatch(updateUser(user));
    };

    const handleDeleteUser = (id: number) => {
        dispatch(deleteUser(id));
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                        <button onClick={() => handleUpdateUser(user)}>
                            Edit
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const name = (
                        event.target.elements.namedItem(
                            'name',
                        ) as HTMLInputElement
                    ).value;
                    const email = (
                        event.target.elements.namedItem(
                            'email',
                        ) as HTMLInputElement
                    ).value;
                    handleAddUser({ name, email, id: Date.now() });
                }}>
                <input type="text" name="name" placeholder="Name" />
                <input type="email" name="email" placeholder="Email" />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}
