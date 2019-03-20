var app = require("http").createServer(handler);
const path = require("path");

const cv = require("opencv4nodejs");
var io = require("socket.io")(app);
var fs = require("fs");

//Background Subtractor
var bg = new cv.BackgroundSubtractorMOG2(400, 50, false);

//Stream video from main camera
const wCap = new cv.VideoCapture(0);
//Frame per second
const FPS = 60;
function handler(req, res) {
  fs.readFile(__dirname + "/index.html", function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading index.html");
    }
    res.writeHead(200);
    res.end(data);
  });
}

//Every
setInterval(() => {
  const frame = wCap.read();
  //appling background subtractor
  var Mat = bg.apply(frame, 0.001);
  // console.log("frame", frame);
  // console.log("remove background", Mat);

  const image = cv.imencode(".jpg", Mat).toString("base64");

  io.emit("image", image);
}, 1000 / FPS);

const PORT = process.env.PORT || 3000;
//Server Listening
app.listen(PORT, () => console.log(`Server running on port  ${PORT}`));

// //Use Routes
// // app.use("/", user);
// //Capturing video from the camera in the front

// wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
// wCap.set(cv.CAP_PROP_FRAME_HIGHT, 300);
