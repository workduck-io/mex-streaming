import fetch from 'node-fetch';
import socketIOClient from 'socket.io-client';

function invokeAgent(requestBody, responseStream) {
  console.log('--------------Inside Invoke Agent Function------------');
  // Connect to Flowise
  const socket = socketIOClient('https://flowise.workduck.io'); // Replace with your Flowise URL

  socket.on('connect', () => {
    //console.log('Connected to Flowise with ID:', socket.id);

    // Send a query with the socket ID
    const data = {
      question: JSON.parse(requestBody).question,
      socketIOClientId: socket.id,
    };

    fetch(
      'https://flowise.workduck.io/api/v1/prediction/a91453f1-c678-4369-b5c8-08050a305690',
      {
        // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
      //.then(response => response.json())
      //.then(result => console.log("------ FINAL RESULT ----" + result))
      .catch(error => console.error('Error:', error));
  });

  // Listen for events
  socket.on('start', () => {
    //console.log('Start event received');
  });

  socket.on('token', token => {
    responseStream.write(token);
    //process.stdout.write(token);
  });

  socket.on('sourceDocuments', sourceDocuments => {
    console.log('SourceDocuments event received:', sourceDocuments);
  });

  socket.on('end', () => {
    socket.disconnect();
    responseStream.write('\n');
    responseStream.end();
  });
}

export { invokeAgent };
