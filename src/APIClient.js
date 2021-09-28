const guestApiUrl = 'https://react-guest-list-ec.herokuapp.com';

// API GET method to fetch all guests. Returns allGuests
export async function getAllGuestsfromAPI() {
  const response = await fetch(`${guestApiUrl}/`);
  const allGuests = await response.json();
  return allGuests;
}

// Creating async function for API POST method, when adding/updating a guest. It return the new createdGuest object. It receives a newGuest object.

export async function createNewGuestinAPI(newGuest) {
  const response = await fetch(`${guestApiUrl}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: newGuest.firstName,
      lastName: newGuest.lastName,
    }),
  });
  const createdGuest = await response.json();
  return createdGuest;
}

// Creating async function for API DELETE method, that receives an object guest ID and returns the deleted object
export async function deleteGuestFromAPI(deletedGuestID) {
  const response = await fetch(`${guestApiUrl}/${deletedGuestID}`, {
    method: 'DELETE',
  });
  const deletedGuest = await response.json();
  return deletedGuest;
}

// Creating async function for API PATCH method
export async function updateGuestFromAPI(updatedGuestID, attending) {
  const response = await fetch(`${guestApiUrl}/${updatedGuestID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attending: attending }),
  });
  const updatedGuest = await response.json();
  return updatedGuest;
}
