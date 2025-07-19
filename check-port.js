const net = require('net');

/**
 * Check if a port is available
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is available, false otherwise
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    
    server.on('error', () => resolve(false));
  });
}

/**
 * Find the next available port starting from a given port
 * @param {number} startPort - Starting port number
 * @param {number} maxAttempts - Maximum number of ports to check
 * @returns {Promise<number|null>} - Available port number or null if none found
 */
async function findAvailablePort(startPort = 3000, maxAttempts = 100) {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await checkPort(port)) {
      return port;
    }
  }
  return null;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const startPort = parseInt(args[0]) || 3000;
  
  console.log(`🔍 Checking port availability starting from ${startPort}...`);
  
  findAvailablePort(startPort).then(port => {
    if (port) {
      console.log(`✅ Port ${port} is available!`);
      console.log(`🚀 You can start your app with: PORT=${port} npm run dev`);
    } else {
      console.log(`❌ No available ports found in range ${startPort}-${startPort + 99}`);
    }
  }).catch(err => {
    console.error('❌ Error checking ports:', err);
  });
}

module.exports = { checkPort, findAvailablePort };
