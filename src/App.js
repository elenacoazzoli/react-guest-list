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

// styling with Emotion
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
  background: #99abb6;
  border: 1px solid #738088;
  box-shadow: rgba(15, 15, 15, 0.1) 0px 1px 2px;
  cursor: pointer;
`;

const removeButton = css`
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  height: 16px;
  padding: 0 12px;
  color: #000;
  background: #ededed;
  border: 1px solid #d5d5d5;
  cursor: pointer;
`;

const formStyled = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 700px;
`;

const listOfGuestsContainerStyled = css`
  width: 100%;
  padding-inline-start: 10px;
`;
const listOfGuestsStyled = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  border-bottom: 2px solid #ededed;
  height: 30px;
  padding-right: 10px;

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
  padding-right: 10px;

  div {
    flex: 1;
    margin-left: 10px;
  }
`;

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState();
  const [filteredGuestList, setFilteredGuestList] = useState();
  const [loaded, setLoaded] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Calling the API GET method to fetch all guests from APIClient. Using state variable guestList to store the response with all the guests and the filteredGuestList for later visualisation
  async function getAllGuests() {
    setGuestList(await getAllGuestsfromAPI());
    setFilteredGuestList(await getAllGuestsfromAPI());
    setLoaded(true);
  }

  // Calling the getAllGuests function on page load
  useEffect(() => {
    getAllGuests();
  }, []);

  // Calling async function for API POST method from APIClient, when adding/updating a guest. It also pushes the new guest object into the guestList array with Spread method. If we are not in the filtering attending guests, the new guest will be displayed

  async function createNewGuest() {
    const newGuest = {
      firstName: firstName,
      lastName: lastName,
    };
    const createdGuest = await createNewGuestinAPI(newGuest);
    const updatedGuestList = [...guestList];
    updatedGuestList.push(createdGuest);
    setGuestList(updatedGuestList);
    if (filterStatus !== 'positivereply') {
      setFilteredGuestList(updatedGuestList);
    }
  }

  // Creating async function that after the click on attending checkbox, calls back the updateGuestFromAPI function
  async function showAttendingGuest(updatedGuestID, checkedStatus) {
    await updateGuestFromAPI(updatedGuestID, checkedStatus).then(() => {
      getAllGuests();
    });
  }

  // filteredGuestList resets to the whole guestList
  const removeFilters = () => {
    setFilteredGuestList(guestList);
    setFilterStatus('all');
  };

  // filteredGuestList gets only the non attending guests from guestList
  const showNonAttendingGuests = () => {
    setFilterStatus('noreply');
    setFilteredGuestList(
      guestList.filter((guest) => guest.attending === false),
    );
  };

  // filteredGuestList gets only the guests attending from guestList
  const showAllAttendingGuests = () => {
    setFilterStatus('positivereply');
    setFilteredGuestList(guestList.filter((guest) => guest.attending === true));
  };

  // Creating  function that after the deletion of an object from the guestList and remains in filter mode
  const showGuestListAfterDelete = (deletedID) => {
    deleteGuestFromAPI(deletedID);

    const deletedIndex = guestList.findIndex((guest) => guest.id === deletedID);
    const deletedFilteredIndex = filteredGuestList.findIndex(
      (guest) => guest.id === deletedID,
    );

    const tempGuestList = [...guestList];
    tempGuestList.splice(deletedIndex, 1);
    setGuestList(tempGuestList);

    const tempFilteredGuestList = [...filteredGuestList];
    tempFilteredGuestList.splice(deletedFilteredIndex, 1);
    setFilteredGuestList(tempFilteredGuestList);
  };

  // Creating a function that goes through guestList array and if the attending key is true, it calls the deleteGuestsFromAPI function
  const removeAllAttendingGuests = () => {
    const tempGuestList = [];
    guestList.forEach((guest) => {
      if (guest.attending === true) {
        deleteGuestFromAPI(guest.id);
      } else {
        tempGuestList.push(guest);
      }
    });
    setGuestList(tempGuestList);
    setFilteredGuestList(tempGuestList);
  };

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
            filteredGuestList.map((guest) => (
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
                  X Remove
                </button>
              </li>
            ))
          )}
        </ul>
        <div>
          <button onClick={() => removeFilters()}>Remove filter </button>
          <button onClick={() => showNonAttendingGuests()}>
            Non-attending guests
          </button>
          <button onClick={() => showAllAttendingGuests()}>
            Attending guests
          </button>
          <button onClick={() => removeAllAttendingGuests()}>
            Clear all attending guests
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
