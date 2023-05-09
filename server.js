const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models'); //sequlize 사용을 가능하게 한다.
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
    models.Product.findAll().then((result) => {
        console.log("PRODUCTS: ", result);
        res.send({
            products: result
        })
    }).catch((error) => {
        console.error(error);
        res.send("에러 발생");
    })
})



app.post("/products", (req, res) => {
    const body = req.body;
    const {name, description, price, seller} = body;
    if(!name || !description || !price || !seller){ //방어 코드
        res.send("모든 필드를 입력해주세요");
    }
    models.Product.create({
        name,
        description,
        price,
        seller
    }).then((result) => {
        console.log("상품 생성 결과", result);
        res.send({
            result,
        })
    }).catch((error) => {
        console.log(error);
        res.send("상품 업로드에 문제가 발생했습니다.");
    })
    
});

app.get("/products/:id/event/:eventId", (req, res) => {
    const params = req.params;
    const {id, eventId} = params;
    res.send(`id는 ${id}와 ${eventId}입니다`);
})

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다"); 
  //sync: models에 테이블 관련된 정보를 넣을 것인데 그 때 동기화를 하겠다는 뜻이다.
  // models/index.js에 입력한 정보를 DB와 동기화시켜준다.
  models.sequelize.sync().then(() => {
    console.log('DB 연결 성공!');
  }).catch((err) => {
    console.error(err);
    console.log('DB 연결 에러');
    process.exit();
  })
});