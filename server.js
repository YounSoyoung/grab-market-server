const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models'); //sequlize 사용을 가능하게 한다.
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads/')
        },
        filename: function(req, file, cb){
            cb(null, file.originalname);
        }
    })
});
const port = 8080;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get("/products", (req, res) => {
    models.Product.findAll({
        //limit: 1 //보여줄 상품의 개수를 정한다. 1개로 제한
        order : [['createdAt', 'DESC']],
        attributes : [ //불러올 정보를 제한
            'id',
            'name',
            'price',
            'createdAt',
            'seller',
            'imageUrl'
        ]
    }).then((result) => {
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

app.get("/products/:id", (req, res) => {
    const params = req.params;
    const {id} = params;
    models.Product.findOne({
        where : {
            id : id
        }
    }).then((result) => {
        console.log("PRODUCT: ", result);
        res.send({
            product : result
        })
    }).catch((error) => {
        console.error(error);
        res.send("상품 조회에 에러가 발생했습니다.");
    })
});

// upload.single() 이미지 파일을 하나 보냈을 때 처리, 파일을 보낼 때 키가 필요한데 () 안에 키값을 넣어준다
app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl : file.path
    })
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