import ngrok from 'ngrok';

(async function() {
  try {
    // Kill any old connections first to prevent collisions
    await ngrok.kill();

    const url = await ngrok.connect({
      proto: 'http',
      addr: 5000,
      authtoken: '3FsrM3q3ZMWyntOznXUaX0AKGrS_3i4zXJAzFHsXVP78tWeJb',
    });
    console.log(`your url is: ${url}`);
  } catch (error) {
    console.error('Failed to start ngrok:', error);
    process.exit(1);
  }
})();
