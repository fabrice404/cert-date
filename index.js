const fs = require('fs');
const path = require('path');
const tls = require('tls');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const getExpirationDate = (host, port) => new Promise((resolve) => {
  const client = tls.connect(port, host, undefined, () => {
    const certificate = client.getPeerCertificate();
    resolve(new Date(certificate.valid_to));
    client.destroy();
  });
});

const getHosts = () =>
  fs.readFileSync(path.join(__dirname, 'hosts'), 'utf-8')
    .split(/\n/)
    .filter((h) => h)
    .map((h) => h.trim());

const main = async () => {
  const hosts = getHosts();
  const results = await Promise.all(hosts.map((host) => getExpirationDate(host, 443)));

  const col1Length = Math.max(...hosts.map((h) => h.length));
  const col2Length = Math.max(...results.map((r) => `${r}`.length));

  console.log(`${"Host".padEnd(col1Length, " ")} | Expires`);
  console.log(`${"".padEnd(col1Length, "-")} | ${"".padEnd(col2Length, "-")}`);

  for (let i = 0; i < hosts.length; i += 1) {
    console.log(`${hosts[i].padEnd(col1Length, " ")} | ${results[i]}`);
  }
};

main();
