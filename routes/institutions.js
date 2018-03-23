const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {

    const InstitutionSchema = mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        phoneNumber: String
      });
      
      const Institution = mongoose.model('Institution', InstitutionSchema);
      
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
              .findOne({ name: data.name })
              .then(response => {
                if (response) {
                  res.status(500).json({ error: 'An institution with this name already exists.' });
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