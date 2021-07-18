const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Static File
const MongoClient = require("mongodb").MongoClient;
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/image", express.static(__dirname + "public/image"));

//Set Views
app.set("views", "./views");
app.set("view engine", "ejs");

// 변수 하나 사용
var db;

MongoClient.connect(
  "mongodb+srv://cksdn:cksdn13241324@firstcluster.ix0ed.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  function (err, client) {
    if (err) {
      console.log(err);
    }
    // 데이터 todo_list 이라는 database폴더에 연결 좀요
    db = client.db("todo_list");

    app.post("/add", function (req, res) {
      res.send("전송완료");
      db.collection("post").insertOne(
        { 제목: req.body.title, 날짜: req.body.day },
        function (에러, 결과) {
          console.log("저장완료");
        }
      );
    });

    app.listen(port, function () {
      console.log("listening on 8080");
    });
  }
);
app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (err, result) {
      console.log(result);
      res.render("list.ejs", { posts : result });
    });
 
});

app.get("", function (req, res) {
  res.send(__dirname + "index.html");
});

app.get("/write", function (요청, 응답) {
  응답.sendFile(__dirname + "/write.html");
});
