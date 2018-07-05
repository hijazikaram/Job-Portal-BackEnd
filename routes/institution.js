const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Institution = require('../model/institution');
var Transaction = require('../model/transaction');
var Job = require('../model/job');
const multer = require('multer');
const upload = multer({ dest: 'logo/' });
const fs = require('fs');
const mongose = require('mongoose');
const ObjectId = mongose.Types.ObjectId;


module.exports = (app) => {

  // Register a new institution
  app.post('/api/institutions', function (req, res) {
    const data = {
      name: req.body.name || '',
      email: req.body.email || '',
      password: req.body.password || '',
      phoneNumber: req.body.phoneNumber || ''
    };
    bcrypt.hash(data.password, 10, function(err, hash) {
      if (err) {
        res.status(500).json({ error: 'Error occured while saving institution.' });
      } else {
        data.password = hash;
        const institution = new Institution(data);
        Institution
          .findOne({ email: data.email })
          .then(response => {
            if (response) {
              res.status(200).json({ error: 'An institution with this email already exists.' });
            } else {
              institution.save(function (err, institution) {
                if (err) res.status(200).json({ error: 'Validation exception' });
                else res.json({success: true, institution: institution})
              });
            }
          });
      }
    });
  });

  // Login institution
  app.post('/api/institution', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    Institution
      .findOne({ email: email})
      .then(function (institution) {

        if(!institution) {
          res.status(200).json({ error: 'No institution with this email exists.' });
        } else {
          const result = bcrypt.compareSync(password, institution.password);
          if (result){
            res.json({success: true, institution: institution});
          } else {
            res.status(200).json({ error: "Password doesn't match." });
          }
        }
      }, function (error) {
        res.status(500).json({ error: 'Error occured while logining.' });
      });
  });

  // Get the institution with ID
  app.get('/api/institution/:id', function (req, res) {
    var id = req.params.id;

    Institution
    .findOne({ _id: id })
    .then(institution => {
      if (institution) {
        res.json({success: true, institution: institution})
      }
    });
  });

  // Update the institution with ID
  app.put('/api/institution/:id', upload.single('logo'), (req, res) => {
    var id = req.params.id;
    var body = req.body;
    console.log(body);
    Institution
    .findOne({ _id: id })
    .then(institution => {
      if (institution) {
        const fileId = new ObjectId();
        if(body.name) {
          institution.name = body.name;
        }

        if(body.email) {
          institution.email = body.email;
        }

        // institution.logo = body.logo;
        institution.phoneNumber = body.phoneNumber;
        institution.address = body.address;
        institution.facebook = body.facebook;
        institution.twitter = body.twitter;
        institution.google = body.google;
        institution.linkedin = body.linkedin;
        institution.type = body.type;


        if(req.file){
            const writestream = gfs.createWriteStream({
                _id: fileId
            });

            writestream.on('close', function(savedFile) {
              console.log(savedFile);
                institution.logoId = savedFile._id;


                if(body.oldPassword !== '') {
                  const result = bcrypt.compareSync(body.oldPassword, institution.password);
                  if (result){
                    // Old password is correct
                    bcrypt.hash(body.newPassword, 10, function(err, hash) {
                      if (err) {
                        res.status(500).json({ error: 'Error occured while saving institution.' });
                      } else {
                        institution.password = hash;
                        institution.save((err, data) => {
                          console.log(data, "2");
                          if(err) {
                            console.log(err);
                            res.status(500).send({message: "Could not update institution with id " + req.params.id});
                          } else {
                            res.status(200).send(data);
                          }
                        });
                      }
                    });
                  } else {
                    // Old password is not correct
                    res.status(200).json({ error: "Old Password is not correct." });
                  }
                } else {
                  console.log("here");
                  institution.save((err, data) => {
                    console.log(data, "2");
                    if(err) {
                      res.status(200).send({message: err + req.params.id});
                    } else {
                      res.status(200).send(data);
                    }
                  });
                }

            });

            // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
            fs.createReadStream("logo/" + req.file.filename)
                .on("end", function() {
                    fs.unlink("logo/" + req.file.filename, (err) => {
                      console.log(err);
                    });
                })
                .on("err", function() {
                    console.log("err");
                })
                .pipe(writestream);
          }
      }
    });
  });

  app.get('/api/institution/logo/:id', (req, res) => {
    console.log(req.params.id);
    let readstream = gfs.createReadStream({
       _id: req.params.id
    });
    console.log("hitting");
   readstream.on("error", (err) => {
      console.log(err);
       res.send("No image found with that title");
   });
   readstream.pipe(res);
})
  // Add available jobs with ID
  app.put('/api/institutionPlusJobs/:id', function (req, res) {
    var id = req.params.id;
    var body = req.body;

    if (body.token && parseInt(body.count)>0) {
      // Set your secret key: remember to change this to your live secret key in production
      // See your keys here: https://dashboard.stripe.com/account/apikeys
      var stripe = require("stripe")("sk_test_roGywqSpiWuSSQLPrZFFrLPu");

      // Token is created using Checkout or Elements!
      // Get the payment token ID submitted by the form:
      const token = body.token; // Using Express

      stripe.charges.create({
        amount: body.count*150,
        currency: 'usd',
        description: 'Available Jobs Charge',
        source: token,
      }, function(err, charge) {
        if (err) {
          res.status(200).send({message: "Stripe operation error", err: err});
        } else {
          Institution
          .findOne({ _id: id })
          .then(institution => {
            if (institution) {
              if (!institution.availableJobs)
                institution.availableJobs = 0;
              institution.availableJobs = parseInt(institution.availableJobs, 10) + parseInt(body.count, 10);

              institution.save(function (err, instituion_data) {
                if(err) {
                  res.status(200).send({message: "Could not increase available jobs count with id " + req.params.id});
                } else {
                  Job
                  .find({ institution_id: id })
                  .then(jobs => {
                    if (jobs) {
                      const data = {
                        id : "IS" + Math.random().toString(10).substring(4, 10),
                        institution_id : institution.id,
                        total : jobs.length + institution.availableJobs,
                        used : jobs.length,
                        remaining : institution.availableJobs
                      };
                      const transaction = new Transaction(data);
                      transaction.save(function (err, transaction_data) {
                        if (err) {
                          res.status(200).send({message: "Transaction error"});
                        } else {
                          res.status(200).send(instituion_data);
                        }
                      });
                    } else {
                      res.status(200).send({message: "Posted jobs error"});
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      res.status(200).send({message: "Invalid request"});
    }
  });

  // Minus available jobs with ID
  app.put('/api/institutionMinusJobs/:id', function (req, res) {
    var id = req.params.id;
    var body = req.body;
    Institution
    .findOne({ _id: id })
    .then(institution => {
      if (institution) {
        if (!institution.availableJobs)
          institution.availableJobs = 0;
        institution.availableJobs = parseInt(institution.availableJobs, 10) - 1;

        institution.save(function (err, data) {
          if(err) {
            res.status(200).send({message: "Could not decrease available jobs count with id " + req.params.id});
          } else {
            res.status(200).send(data);
          }
        });
      }
    });
  });

  // Get the transactions with institution id
  app.get('/api/transactions/:institution_id', function (req, res) {
    var institution_id = req.params.institution_id;

    Transaction
    .find({ institution_id: institution_id })
    .then(transactions => {
      if (transactions) {
        res.json({success: true, transactions: transactions});
      }
    });
  });
};
