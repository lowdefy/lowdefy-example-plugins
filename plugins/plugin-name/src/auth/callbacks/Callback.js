// See https://next-auth.js.org/configuration/callbacks for more info

function Callback({ account, isNewUser, profile, properties, token, user }) {
  return token;
}

Callback.meta = {
  type: 'jwt', // One of jwt, session, redirect or signIn
};

export default Callback;
