export default {
  actions: ['Action'],
  auth: {
    callbacks: ['Adapter'],
    callbacks: ['Callback'],
    events: ['Event'],
    provider: ['Provider'],
  },
  blocks: ['Block'],
  connections: ['Connection'],
  requests: ['Request'],
  operators: {
    client: ['_build_operator', '_shared_operator'],
    client: ['_client_operator', '_shared_operator'],
    server: ['_server_operator', '_shared_operator'],
  },
};
