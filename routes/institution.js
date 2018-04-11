const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {

  const InstitutionSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: String,
    address: String,
    expertise: String,
    comments_enable : false,
    receive_newsletter: false,
    receive_advice: false
  });
    
  const Institution = mongoose.model('Institution', InstitutionSchema);
  
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

  // // Get the user with ID
  // app.get('/api/user/:id', function (req, res) {
  //   var id = req.params.id;

  //   User
  //   .findOne({ _id: id })
  //   .then(user => {
  //     if (user) {
  //       res.json({success: true, user: user})
  //     }
  //   });
  // });

  // // Update the user with ID
  // app.put('/api/user/:id', function (req, res) {
  //   var id = req.params.id;
  //   var body = req.body;
  //   User
  //   .findOne({ _id: id })
  //   .then(user => {
  //     if (user) {
  //       if(body.name) {
  //         user.name = body.name;  
  //       }
        
  //       if(body.email) {
  //         user.email = body.email;  
  //       }

  //       user.phoneNumber = body.phoneNumber;
  //       user.address = body.address;
  //       user.expertise = body.expertise;
  //       user.comments_enable = body.comments_enable;
  //       user.receive_newsletter = body.receive_newsletter;
  //       user.receive_advice = body.receive_advice;

  //       if(body.oldPassword) {
  //         const result = bcrypt.compareSync(body.oldPassword, user.password);
  //         if (result){
  //           // Old password is correct
  //           bcrypt.hash(body.newPassword, 10, function(err, hash) {
  //             if (err) {
  //               res.status(500).json({ error: 'Error occured while saving user.' });
  //             } else {
  //               user.password = hash;
  //               user.save(function (err, data) {
  //                 if(err) {
  //                   res.status(500).send({message: "Could not update user with id " + req.params.id});
  //                 } else {
  //                   res.status(200).send(data);
  //                 }
  //               });
  //             }
  //           });
  //         } else {
  //           // Old password is not correct
  //           res.status(200).json({ error: "Old Password is not correct." });
  //         }
  //       } else {
  //         user.save(function (err, data) {
  //           if(err) {
  //             res.status(200).send({message: "Could not update user with id " + req.params.id});
  //           } else {
  //             res.status(200).send(data);
  //           }
  //         });
  //       }
  //     }
  //   });
  // });
};