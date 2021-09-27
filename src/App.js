import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import {
  createNewGuestinAPI,
  deleteGuestFromAPI,
  getAllGuestsfromAPI,
  updateGuestFromAPI,
} from './APIClient';

const pageContainer = css`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: rgb(255, 254, 252);
  height: 100vh;
`;
const appContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 700px;
  margin-top: 100px;
`;

const createButton = css`
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  height: 25px;
  padding: 0 12px;
  color: rgb(255, 255, 255);
  background: rgb(58, 160, 218);
  border: 1px solid rgb(48, 139, 191);
  box-shadow: rgba(15, 15, 15, 0.1) 0px 1px 2px;
  cursor: pointer;
`;

const removeButton = css`
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  height: 16px;
  padding: 0 12px;
  color: #ffffff;
  background: rgb(225, 98, 89);
  border: 1px solid rgb(190, 86, 67);
`;

const formStyled = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 640px;
`;

const listOfGuestsContainerStyled = css`
  width: 100%;
`;
const listOfGuestsStyled = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  border-bottom: 2px solid #ededed;
  height: 30px;

  div {
    flex: 1;
    margin-left: 10px;
  }
`;

const listOfAttendingGuestsStyled = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  border-bottom: 2px solid #ededed;
  background: #b4d0c3;
  height: 30px;

  div {
    flex: 1;
    margin-left: 10px;
  }
`;

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState();
  const [loaded, setLoaded] = useState(false);

  // Calling the API GET method to fetch all guests from APIClient. Using state variable guestList to store the response
  async function getAllGuests() {
    setGuestList(await getAllGuestsfromAPI());
    setLoaded(true);
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

  // Creating async function that after the click on attending checkbox, calls back the updateGuestFromAPI function
  async function showAttendingGuest(updatedGuestID, checkedStatus) {
    await updateGuestFromAPI(updatedGuestID, checkedStatus).then(() => {
      getAllGuests();
    });
  }

  return (
    <div css={pageContainer}>
      <div css={appContainer}>
        <h1>Guest list</h1>
        <div>
          <form
            css={formStyled}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label htmlFor="firstName">First name:</label>
            <input
              id="firstName"
              value={firstName}
              disabled={!loaded}
              onChange={(event) => setFirstName(event.currentTarget.value)}
            />
            <label htmlFor="lastName">Last name:</label>
            <input
              id="lastName"
              value={lastName}
              disabled={!loaded}
              onChange={(event) => setLastName(event.currentTarget.value)}
            />
            <button
              css={createButton}
              onClick={() => {
                createNewGuest();
                setFirstName('');
                setLastName('');
              }}
            >
              Add new guest
            </button>
          </form>
        </div>
        <ul css={listOfGuestsContainerStyled}>
          {!loaded ? (
            <p>..loading</p>
          ) : (
            guestList.map((guest) => (
              <li
                key={guest.id}
                css={
                  !guest.attending
                    ? listOfGuestsStyled
                    : listOfAttendingGuestsStyled
                }
              >
                <input
                  type="checkbox"
                  checked={guest.attending}
                  onChange={(event) => {
                    showAttendingGuest(guest.id, event.currentTarget.checked);
                  }}
                />
                <div>
                  <span>
                    {guest.firstName} {guest.lastName}
                  </span>
                </div>
                <button
                  css={removeButton}
                  onClick={() => showGuestListAfterDelete(guest.id)}
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
