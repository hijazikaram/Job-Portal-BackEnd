const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {

  const InstitutionSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    logo : String,
    phoneNumber: String,
    address: String,
    facebook: String,
    twitter: String,
    google: String,
    linkedin: String, 
    availableJobs: { type: Number, default: 0 }
  });

  const Institution = mongoose.model('Institution', InstitutionSchema);

  // Register a new institution
  app.post('/api/institutions', function (req, res) {
    console.log("hitting");
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
  app.put('/api/institution/:id', function (req, res) {
    var id = req.params.id;
    var body = req.body;
    console.log(body);
    Institution
    .findOne({ _id: id })
    .then(institution => {
      if (institution) {
        if(body.name) {
          institution.name = body.name;
        }

        if(body.email) {
          institution.email = body.email;
        }

        institution.logo = body.logo;
        institution.phoneNumber = body.phoneNumber;
        institution.address = body.address;
        institution.facebook = body.facebook;
        institution.twitter = body.twitter;
        institution.google = body.google;
        institution.linkedin = body.linkedin;
        institution.type = body.type;

        if(body.oldPassword) {
          const result = bcrypt.compareSync(body.oldPassword, institution.password);
          if (result){
            // Old password is correct
            bcrypt.hash(body.newPassword, 10, function(err, hash) {
              if (err) {
                res.status(500).json({ error: 'Error occured while saving institution.' });
              } else {
                institution.password = hash;
                institution.save(function (err, data) {
                  if(err) {
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
          institution.save(function (err, data) {
            if(err) {
              res.status(200).send({message: "Could not update institution with id " + req.params.id});
            } else {
              res.status(200).send(data);
            }
          });
        }
      }
    });
  });

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

              institution.save(function (err, data) {
                if(err) {
                  res.status(200).send({message: "Could not increase available jobs count with id " + req.params.id});
                } else {
                  res.status(200).send(data);
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
};
