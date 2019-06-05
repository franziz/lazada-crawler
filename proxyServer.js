const ProxyChain = require("proxy-chain");

const server = new ProxyChain.Server({ port: 8080 });
server.listen(() => console.log(`Proxy server is listening on port ${8080}`))