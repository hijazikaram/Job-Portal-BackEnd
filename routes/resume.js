const mongoose = require('mongoose');

module.exports = (app) => {

  const ResumeSchema = mongoose.Schema({
    user_id : String,

    express_yourself_full_name: String,
    express_yourself_additional_information: String,
    express_yourself_photo_for_resume: String,
    career_objective: String,
    special_qualification: String,
    personal_details_full_name: String,
    personal_details_father_name: String,
    personal_details_mother_name: String,
    personal_details_dob: String,
    personal_details_birth_place: String,
    personal_details_nationality: String,
    personal_details_sex: String,
    personal_details_address: String,
    declaration : String,
    work_history : { type : Array , "default" : [] },
    education_background : { type : Array , "default" : [] },
    language_proficiency : { type : Array , "default" : [] }
  });
    
  const Resume = mongoose.model('Resume', ResumeSchema);
  
  // Register a new user
  app.post('/api/resume', function (req, res) {
    var data = req.body;

    var resume = new Resume(data);
    resume.save(function (err, resume) {
      if (err) res.status(200).json({ error: 'Validation exception' });
      else res.json({success: true, resume: resume})
    });
  });

  // Get the user with user ID
  app.get('/api/resume/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    console.log(user_id);
    Resume
    .findOne({ user_id: user_id })
    .then(resume => {
      if (resume) {
        res.json({success: true, resume: resume})
      } else {
        res.json({error : 'Not Found'});  
      }
    }, error => {
      res.json({error : 'Not Found'});
    });
  });

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