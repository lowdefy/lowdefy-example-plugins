import schema from '../schema.js';

async function Request({ request, connection }) {
  return null
}

Request.schema = schema;
Request.meta = {
  checkRead: false,
  checkWrite: false,
};

export default Request;
