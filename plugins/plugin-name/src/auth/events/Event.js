// See https://next-auth.js.org/configuration/events for more info

function Event({}) {
  return token;
}

Event.meta = {
  type: 'createUser', // One of createUser, linkAccount, session, signIn, signOut, updateUser
};

export default Event;
