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
};