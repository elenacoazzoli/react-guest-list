import './App.css';
import { useEffect, useState } from 'react';
import {
  createNewGuestinAPI,
  deleteGuestFromAPI,
  getAllGuestsfromAPI,
} from './APIClient';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState();

  // Calling the API GET method to fetch all guests from APIClient. Using state variable guestList to store the response
  async function getAllGuests() {
    setGuestList(await getAllGuestsfromAPI());
  }

  // Calling the getAllGuests function on page load
  useEffect(() => {
    getAllGuests();
  }, []);

  // Calling async function for API POST method from APIClient, when adding/updating a guest. It also pushes the new guest object into the guestList array with Spread method

  async function createNewGuest() {
    const newGuest = {
      firstName: firstName,
      lastName: lastName,
    };
    const createdGuest = await createNewGuestinAPI(newGuest);
    const updatedGuestList = [...guestList];
    updatedGuestList.push(createdGuest);
    setGuestList(updatedGuestList);
  }

  // Creating async function that after the deletion of an object from the guestList, calls back the getAllGuests function
  async function showGuestListAfterDelete(deletedID) {
    await deleteGuestFromAPI(deletedID).then(() => {
      getAllGuests();
    });
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="firstName">First name:</label>
        <input
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <br />
        <label htmlFor="lastName">Last name:</label>
        <input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
      </form>
      <button
        onClick={() => {
          createNewGuest();
          setFirstName('');
          setLastName('');
        }}
      >
        Display new guest
      </button>
      <div>
        All guests:
        {!guestList ? (
          <p>..loading</p>
        ) : (
          guestList.map((guest) => (
            <div key={guest.id}>
              <div>{guest.firstName}</div>

              <div>{guest.lastName}</div>
              <button onClick={() => showGuestListAfterDelete(guest.id)}>
                Remove guest
              </button>
              <br />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
