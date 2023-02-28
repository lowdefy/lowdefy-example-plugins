// See NextAuth documentation and examples

function Adapter({ properties }) {
  return {
    async createUser(data) {
      const user = {};
      return user;
    },

    async getUser(_id) {
      const user = {};
      return user;
    },

    async getUserByEmail(email) {
      const user = {};
      return user;
    },

    async getUserByAccount(provider_providerAccountId) {
      const user = {};
      return user;
    },

    async updateUser(data) {
      const user = {};
      return user;
    },

    async deleteUser(userId) {},

    linkAccount: async (account) => {
      return account;
    },

    async unlinkAccount(provider_providerAccountId) {
      const account = {};
      return account;
    },

    async getSessionAndUser(sessionToken) {
      const user = {};
      const session = {};
      return {
        user,
        session,
      };
    },

    async createSession(session) {
      return session;
    },

    async updateSession(data) {
      const session = {};
      return session;
    },

    async deleteSession(sessionToken) {
      const session = {};
      return session;
    },

    async createVerificationToken(data) {
      const verificationToken = {};
      return verificationToken;
    },

    async useVerificationToken(identifier_token) {
      // Delete used verification token
      const verificationToken = {};
      return verificationToken;
    },
  };
}

export default Adapter;
