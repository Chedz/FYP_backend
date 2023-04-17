To Run: in base dir of '/RestApi' run 'node .' in terminal without quotes.

This will start a localhost server on port 6968. Data can be uploaded or fetched from server using API calls via HTTP.
This can be demoed using Insomnia as a REST client or another similar program like PostMan.

Note: this server needs to be running with the web application in order for the web app to have any map data to render.

Rest APIs are defined in index.js, using Express.js framework and Node.js
Post-processing scripts written in vanilla python are stored in "/scripts" folder.
inputData folder contains input data received from raspberry pi via /upload api.
processedData folder contains map data in form of 3d vertices stored in .txt files.