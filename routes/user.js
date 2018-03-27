const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {

  const UserSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: String
  });
    
  const User = mongoose.model('User', UserSchema);
  
  // Register a new user
  app.post('/api/users', function (req, res) {
    const data = {
      name: req.body.name || '',
      email: req.body.email || '',
      password: req.body.password || '',
      phoneNumber: req.body.phoneNumber || ''
    };
    bcrypt.hash(data.password, 10, function(err, hash) {
      if (err) {
        res.status(500).json({ error: 'Error occured while saving user.' });
      } else {
        data.password = hash;
        const user = new User(data);
        User
          .findOne({ email: data.email })
          .then(response => {
            if (response) {
              res.status(200).json({ error: 'A user with this email already exists.' });
            } else {
              user.save(function (err, user) {
                if (err) res.status(200).json({ error: 'Validation exception' });
                else res.json({success: true, user: user})
              });
            }
          });
      }
    });
  });

  // Get the user based on ID
  app.get('/api/user/:id', function (req, res) {
    console.log(req.params.id);
    var id = req.params.id;

    User
    .findOne({ _id: id })
    .then(user => {
      if (user) {
        res.json({success: true, user: user})
      }
    });
  });

  // Login User
  app.post('/api/user', function (req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;

    User
      .findOne({ email: email})
      .then(function (user) {
        
        console.log(user);
        if(!user) {
          res.status(200).json({ error: 'No user with this email exists.' });
        } else {
          const result = bcrypt.compareSync(password, user.password);
          if (result){
            res.json({success: true, user: user});
          } else {
            res.status(200).json({ error: "Password doesn't match." });
          }
        }
      }, function (error) {
        res.status(500).json({ error: 'Error occured while logining.' });
      });
  });

};