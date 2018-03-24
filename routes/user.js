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
    
  app.post('/api/users', function (req, res) {
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
        const institution = new User(data);
        User
          .findOne({ email: data.email })
          .then(response => {
            if (response) {
              res.status(500).json({ error: 'A user with this email already exists.' });
            } else {
              institution.save(function (err, institution) {
                if (err) res.status(500).json({ error: 'Validation exception' });
                else res.json({success: true})
              });
            }
          });
      }
    });
  });
};