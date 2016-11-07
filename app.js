var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var Datastore = require('nedb'),
  db = new Datastore({
   // filename: 'database/feedbackdatabase.db',
    autoload: true
  });

var app = express();
app.use(bodyParser.json());

db.remove({}, {
  multi: true
}, function(err, numRemoved) {
  console.log(numRemoved);
});
//luodaan pari kysymystä
var kysymys1 = {
  kysymys: 'Miten menee?',
  date: new Date(),
  vastauslista: []
};
var kysymys2 = {
  kysymys: 'Kuinka kulkee?',
  date: new Date(),
  vastauslista: []
};

db.insert(kysymys1, function(err, newDoc) { // Callback is optional
  var vastaus1 = {
    vastaus: 'apinaaaa'
  };
  newDoc.vastauslista.push(vastaus1);
  db.update({ _id: newDoc._id }, newDoc , {}, function(err, numReplaced) {
      console.log("korvattuja: ",numReplaced);
      // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
      // Note that the _id is kept unchanged, and the document has been replaced
      // (the 'system' and inhabited fields are not here anymore)
    });
});
db.insert(kysymys2, function(err, newDoc) { // Callback is optional
  var vastaus1 = {
    vastaus: 'apinaaaa'
  };
  newDoc.vastauslista.push(vastaus1);
  db.update({ _id: newDoc._id }, newDoc , {}, function(err, numReplaced) {
      console.log("korvattuja: ",numReplaced);
      // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
      // Note that the _id is kept unchanged, and the document has been replaced
      // (the 'system' and inhabited fields are not here anymore)
    });
});


app.get('/get.json', function(req, res) {

  db.find({}).sort({ date: 1 }).exec(function(err, docs) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(docs));
  })

})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/angular_form.html'));

})

app.post('/tallenna', function(req, res) {

    for(var i in req.body ){
      db.update({ _id: i }, { $push: { vastauslista: { vastaus: req.body[i] } }}, {}, function () {
      });
    };
    res.sendStatus(200);
})

app.post('/tallennakysymys', function(req, res) {
    var uusikysymys = {
      kysymys: req.body.kysymys,
      date: new Date(),
      vastauslista: []
    };
    db.insert(uusikysymys);
    db.find({}, function(err, docs) {
    console.log(docs);
   res.sendStatus(200);
  });

})
app.post('/poistakysymys', function(req, res) {
   
    db.remove({ _id: req.body.kysymys_id }, {}, function (err, numRemoved) {
      if (err) {
        console.log(err);
      }else{
      console.log("poistettu ", numRemoved);
    }});

    db.find({}, function(err, docs) {
    console.log(docs);
    res.sendStatus(200);
  });

})

app.listen(8080);