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
      db.collection("counter").findOne(
        { name: "게시물 갯수" },
        function (err, result) {
          console.log(result.totalPost);
          var 총게시물갯수 = result.totalPost;

          db.collection("post").insertOne(
            { _id: 총게시물갯수 + 1, 제목: req.body.title, 날짜: req.body.day },
            function (에러, 결과) {
              console.log("저장완료");
              db.collection("counter").updateOne(
                { name: "게시물 갯수" },
                { $inc: { totalPost: 1 } },
                function (err, result) {
                  if (err) {
                    return console.log(에러);
                  }
                  result;
                }
              );
            }
          );
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
      res.render("list.ejs", { posts: result });
    });
});

app.get("/index", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/public/write.html");
});

app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);
  요청.body._id = parseInt(요청.body._id);
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료");
    응답.status(200).send({ message: "성공했습니다" });
  });
});
