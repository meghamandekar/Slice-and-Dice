import { useState } from 'react';

const initialFriends = [
	{
		id: 118836,
		name: 'John',
		image: 'https://i.pravatar.cc/150?img=40',
		balance: 30,
	},
	{
		id: 933372,
		name: 'Marie',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: -10,
	},
	{
		id: 499476,
		name: 'Jack',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 0,
	},
];

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
}

function App() {
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((show) => !show);
	}

	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}

	function handleSelection(friend) {
		// setSelectedFriend(friend);
		setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	}

	function handleSubmitBill(newFriend) {
		setFriends((friends) => {
			// console.log(friends);
			return friends.map((friend) =>
				friend.id === newFriend.id
					? { ...friend, balance: newFriend.balance }
					: friend
			);
			// friends.map((friend) => {
			// 	if (friend.id === newFriend.id)
			// 		return { ...friend, balance: newFriend.balance };
			// 	else return friend;
			// });
		});
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendList
					friends={friends}
					onSelection={handleSelection}
					selectedFriend={selectedFriend}
				/>

				{showAddFriend && (
					<FormAddFriend onAddFriend={handleAddFriend} />
				)}

				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? 'Close' : ' Add Friend'}
				</Button>
			</div>
			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSubmitBill}
				/>
			)}
		</div>
	);
}

function FriendList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;

	return (
		<li className={isSelected ? 'selected' : ''}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} {Math.abs(friend.balance)}${' '}
				</p>
			)}
			{friend.balance === 0 && <p>You are even with {friend.name}</p>}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owes you {Math.abs(friend.balance)}${' '}
				</p>
			)}
			<Button onClick={() => onSelection(friend)}>
				{isSelected ? 'Close' : 'Select'}
			</Button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('https://i.pravatar.cc/48');

	function handleSubmit(e) {
		e.preventDefault();

		if (!name || !image) return;

		const id = crypto.randomUUID();
		const newFriend = {
			name,
			image: `${image}?=${id}`,
			balance: 0,
			id: id,
		};
		onAddFriend(newFriend);

		setName('');
		setImage('https://i.pravatar.cc/48');
	}
	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>🧑‍💻Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<label>📷 Image URL</label>
			<input
				type="text"
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>
			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState('110');
	const [paidByUser, setPaidByUser] = useState('12');
	const [whoIsPaying, setWhoIsPaying] = useState('user');

	function handleSubmit(e) {
		e.preventDefault();

		let balance = 0;

		if (whoIsPaying === 'user') {
			balance = bill - paidByUser;
		} else {
			balance = -paidByUser;
		}
		// console.log({ ...selectedFriend });
		const newFriend = {
			...selectedFriend,
			balance: selectedFriend.balance + balance,
		};

		onSplitBill(newFriend);
		// console.log(newFriend);
	}

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split a bill with {selectedFriend.name}</h2>
			<label>💸 Bill Value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(Number(e.target.value))}
			/>
			<label>♟️ Your expense</label>
			<input
				type="text"
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						Number(e.target.value) > bill
							? paidByUser
							: Number(e.target.value)
					)
				}
			/>
			<label>🍟 {selectedFriend.name}'s expense</label>
			<input type="text" disabled value={bill ? bill - paidByUser : ''} />

			<label>😜 Who is paying the bill?</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>
			<Button>Split Bill</Button>
		</form>
	);
}

export default App;
