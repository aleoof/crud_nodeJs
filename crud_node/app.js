const express = require('express');
const app = express();
const port = '3000';
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;

const uri =
  'mongodb+srv://test-crud:88028851Aa@crud-test-rxmpz.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

client.connect(err => {
  if (err) return console.log(err);
  db = client.db('crud-test');

  app.listen(port, () => {
    console.log('server start on localhost:' + port);
  });
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/', (req, res) => {
  let cursor = db.colection('data').find();
});

app.post('/save', (req, res) => {
  db.collection('data').insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('salvo no banco');
    res.redirect('/show');
  });
});

app.get('/show', (req, res) => {
  db.collection('data')
    .find()
    .toArray((err, results) => {
      if (err) return console.log(err);
      res.render('show.ejs', { data: results });
    });
});

app
  .route('/edit/:id')
  .get((req, res) => {
    let id = req.params.id;

    db.collection('data')
      .find(ObjectId(id))
      .toArray((err, result) => {
        if (err) {
          return res.send(err);
        }
        res.render('edit.ejs', { data: result });
      });
  })
  .post((req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let surname = req.body.surname;

    db.collection('data').updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          name: name,
          surname: surname,
        },
      },
      (err, result) => {
        if (err) return res.send(errr);

        res.redirect('/show');
        console.log('atualizado');
      }
    );
  });

app.route('/delete/:id').get((req, res) => {
  let id = req.params.id;

  db.collection('data').deleteOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) return res.send(500, err);
    console.log('Banco deletado');
    res.redirect('/show');
  });
});
