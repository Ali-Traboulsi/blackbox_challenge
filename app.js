const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ! extract these to .env file
// const clientId = "6bf7e36ed4914f349a1e3ae6fff609a9";
// const clientSecret = "cd2046defae649069188bbd8e6d9a9e7";
// const appId = "26a9377b4ef0455d960620021392571e";

const clientId = "2d54912154ca44498317c7a7efa458dc";
const clientSecret = "eabe7a760e6b4b6eb01660bc3a73696a";
const appId = "070b880df7f14686a5a04fcbdb81b76f";
// const sid = "e66cf8ff6049820f3177c9b7125f289b";



console.log(`${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`);

app.get("/", (req, res) => res.send("Agora Cloud Recording Server"));

app.post("/acquire", async (req, res) => {
  const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  console.log(Authorization);
  let acquire;
  console.log(req.body);
  try {
    acquire = await axios.post(
      `https://api.agora.io/v1/apps/${appId}/cloud_recording/acquire`,
      {
        cname: req.body.channel,
        uid: req.body.uid,
        clientRequest: {
          resourceExpiredHour: 24,
        },
      },
      { headers: { Authorization } }
    );
  } catch (e) {
    return res.send(e);
  }

  res.send(acquire.data);
});

app.post("/start", async (req, res) => {
  const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  const appID = appId;
  const resource = req.body.resource;
  const mode = req.body.mode;
  console.log(req.body);
  const start = await axios.post(
    `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
    {
      cname: req.body.channel,
      uid: req.body.uid,
      clientRequest: {
        recordingConfig: {
          maxIdleTime: 60,
          streamTypes: 2,
          channelType: 0,
          videoStreamType: 0,
          transcodingConfig: {
            height: 640,
            width: 360,
            bitrate: 500,
            fps: 15,
            mixedVideoLayout: 1,
            backgroundColor: "#FFFFFF",
          },
        },
        recordingFileConfig: {
          avFileType: ["hls"],
        },
        storageConfig: {
          vendor: 1,
          region: 13,
          bucket: "testbucket11209",
          accessKey: "AKIAW7ERLPPVFKR5R3OC",
          secretKey: "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",
          fileNamePrefix: ["directory1", "directory2"],
        },
      },
    },
    { headers: { Authorization } }
  );

  res.send(start.data);
});


app.get("/query", async (req, res) => {
  try {
    const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
    console.log(Authorization);
    const appID = appId;
    const resource = req.body.resource;
    const sid = req.body.sid;
    const mode = req.body.mode;
  
    const query = await axios.get(
      `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
      { headers: { Authorization } }
    );

  } catch (e) {
    return res.send(e);
  }


  res.send(query.data);
});

// app.post("/stop", async (req, res) => {
//   try {
//     const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
//     const appID = appId;
//     console.log(req.body);
//     const resource = req.body.resource;
//     const sid = req.body.sid;
//     const mode = req.body.mode;

//     const stop = await axios.post(
//         // `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
//       `https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
//       {
//         cname: req.body.channel,
//         uid: req.body.uid,
//         clientRequest: {},
//       },
//       { headers: { Authorization } }
//     );
//   } catch (e) {
//     return res.send(e);
//   }

//   res.send(stop.data);
// });

app.post("/stop", async (req, res) => {
  const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  const appID = appId;
  const resource = req.body.resource;
  const sid = req.body.sid;
  const mode = req.body.mode;

  const stop = await axios.post(
    `https://api.agora.io/v1/apps/${appId}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
    {
      cname: req.body.channel,
      uid: req.body.uid,
      clientRequest: {},
    },
    { headers: { Authorization } }
  );
  res.send(stop.data);
});




const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Agora Cloud Recording Server listening at Port ${port}`));
