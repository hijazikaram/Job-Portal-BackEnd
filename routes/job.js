const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {

  const JobSchema = mongoose.Schema({
    job_category : String,
    job_type: String,
    job_title: String,
    job_description : String,
    location_country: String,
    location_state: String,
    salary_min: String,
    salary_max: String,
    salary_negotiable: String,
    application_deadline: String,
    experience: String,
    job_function: String,

    company_industry: String,
    company_name:String,
    company_email:String,
    company_mobile: String,
    company_address:String,

    post_premium: String
  });
    
  const Job = mongoose.model('Job', JobSchema);
  
  // Register a new user
  app.post('/api/jobs', function (req, res) {
    const data = {
      job_category : req.body.job_category || '',
      job_type : req.body.job_type || '',
      job_title : req.body.job_title || '',
      job_description : req.body.job_description  || '',
      location_country : req.body.location_country || '',
      location_state : req.body.location_state || '',
      salary_min : req.body.salary_min || '',
      salary_max : req.body.salary_max || '',
      salary_negotiable : req.body.false,
      application_deadline : req.body.application_deadline || '',
      experience : req.body.experience || '',
      job_function : req.body.job_function || '',

      company_industry : req.body.company_industry || '',
      company_name : req.body.company_name || '',
      company_email : req.body.company_email || '',
      company_mobile : req.body.company_mobile || '',
      company_address : req.body.company_address || '',

      post_premium : req.body.post_premium || ''
    };

    const job = new Job(data);

    job.save(function (err, job) {
      if (err) res.status(200).json({ error: 'Validation exception' });
      else res.json({success: true, job: job})
    });
  });

  // // Login User
  // app.post('/api/user', function (req, res) {
  //   var email = req.body.email;
  //   var password = req.body.password;

  //   User
  //     .findOne({ email: email})
  //     .then(function (user) {
        
  //       if(!user) {
  //         res.status(200).json({ error: 'No user with this email exists.' });
  //       } else {
  //         const result = bcrypt.compareSync(password, user.password);
  //         if (result){
  //           res.json({success: true, user: user});
  //         } else {
  //           res.status(200).json({ error: "Password doesn't match." });
  //         }
  //       }
  //     }, function (error) {
  //       res.status(500).json({ error: 'Error occured while logining.' });
  //     });
  // });

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