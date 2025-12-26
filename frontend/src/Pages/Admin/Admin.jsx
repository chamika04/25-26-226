import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';
import axios from 'axios';

function Admin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [editId, seteditId] = useState(-1);
    const [uusername, usetUsername] = useState('');
    const [uemail, usetEmail] = useState('');
    const [ufirstName, usetfirstName] = useState('');
    const [uRole, usetRole] = useState('');

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8070/api/getUsers')
            .then(users => setUsers(users.data))
            .catch(err => console.log(err));
    }, []);

    const handleEdit = (username) => {
        axios.get(`http://localhost:8070/api/user/${username}`)
            .then(res => {
                usetUsername(res.data.username);
                usetEmail(res.data.email);
                usetfirstName(res.data.firstName);
                usetRole(res.data.role);
            })
            .catch(er => console.log(er));
        seteditId(username);
    };

    const handleUpdate = () => {
        axios.put('http://localhost:8070/api/update', { username: uusername, email: uemail, firstName: ufirstName, role: uRole })
            .then(res => {
                window.location.reload();
                seteditId(-1);
            })
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        const data = await axios.delete(`http://localhost:8070/api/delete/${id}`);
        alert(data.data.message);
        window.location.reload();
    };

    return (
        <div className="min-h-screen w-screen bg-cover bg-center flex justify-center items-center p-5" 
            style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2024/05/31/14/36/ai-generated-8800694_1280.png')` }}>
            <div className="w-full max-w-6xl bg-white bg-opacity-60 rounded-lg shadow-lg p-6"> {/* Outer box with low opacity */}
                <h2 className="text-center text-4xl font-bold text-grey-500 mb-6">User Details</h2>

                <div className="flex justify-center mb-6">
                    <input
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search here"
                        className="border-2 border-[#a07628] bg-[#f9f9e9] h-11 w-[500px] pl-5 pr-16 rounded-[14px] text-[13pt] focus:outline-none"
                    />
                </div>

                <div className="w-full flex justify-center items-center px-4 overflow-hidden">
                    <table className="w-full max-w-5xl bg-black bg-opacity-40 border-collapse rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-orange-800 text-white">
                                <th className="p-4 text-sm font-semibold text-left">Id</th>
                                <th className="p-4 text-sm font-semibold text-left">Username</th>
                                <th className="p-4 text-sm font-semibold text-left">Email</th>
                                <th className="p-4 text-sm font-semibold text-left">First Name</th>
                                <th className="p-4 text-sm font-semibold text-left">Role</th>
                                <th className="p-4 text-sm font-semibold text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(user =>
                                (user.username && user.username.toLowerCase().includes(search.toLowerCase())) ||
                                (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
                                (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
                                (user.role && user.role.toLowerCase().includes(search.toLowerCase()))
                            ).map((user) => (
                                user.username === editId ?
                                    <tr key={user._id} className="border-b border-gray-700 h-16">
                                        <td className="text-white p-4 text-sm font-bold">{user._id}</td>
                                        <td className="text-white p-4 text-sm">{user.username}</td>
                                        <td className="p-4 text-sm">
                                            <input className="bg-gray-800 text-white p-2 rounded" type="text" value={uemail} onChange={e => usetEmail(e.target.value)} />
                                        </td>
                                        <td className="p-4 text-sm">
                                            <input className="bg-gray-800 text-white p-2 rounded" type="text" value={ufirstName} onChange={e => usetfirstName(e.target.value)} />
                                        </td>
                                        <td className="p-4 text-sm">
                                            <input className="bg-gray-800 text-white p-2 rounded" type="text" value={uRole} onChange={e => usetRole(e.target.value)} />
                                        </td>
                                        <td>
                                            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg" onClick={handleUpdate}>Update</button>
                                        </td>
                                    </tr>
                                    :
                                    <tr key={user._id} className="border-b border-gray-700 h-16">
                                        <td className="text-white p-4 text-sm font-bold">{user._id}</td>
                                        <td className="text-white p-4 text-sm">{user.username}</td>
                                        <td className="text-white p-4 text-sm">{user.email}</td>
                                        <td className="text-white p-4 text-sm">{user.firstName}</td>
                                        <td className="text-white p-4 text-sm">{user.role}</td>
                                        <td className='space-x-3'>
                                            <button className="bg-green-600 text-white px-3 py-2 rounded-lg" onClick={() => handleEdit(user.username)}>Edit</button>
                                            <button className="bg-red-600 text-white px-3 py-2 rounded-lg" onClick={() => handleDelete(user._id)}>Delete</button>
                                        </td>
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Admin;
