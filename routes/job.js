const mongoose = require('mongoose');

module.exports = (app) => {

  const JobSchema = mongoose.Schema({
    institution_id: String,
    job_category : String,
    job_type: String,
    job_title: String,
    job_description : String,
    job_key_responsibilities : String,
    job_minimum_requirements : String,
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
      institution_id: req.body.institution_id,
      job_category : req.body.job_category || '',
      job_type : req.body.job_type || '',
      job_title : req.body.job_title || '',
      job_description : req.body.job_description  || '',
      job_key_responsibilities : req.body.job_key_responsibilities || '',
      job_minimum_requirements : req.body.job_minimum_requirements || '',
      location_country : req.body.location_country || '',
      location_state : req.body.location_state || '',
      salary_min : req.body.salary_min || '',
      salary_max : req.body.salary_max || '',
      salary_negotiable : req.body.salary_negotiable || '',
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

  // Get the jobs with institution id
  app.get('/api/jobs/:institution_id', function (req, res) {
    var institution_id = req.params.institution_id;

    Job
    .find({ institution_id: institution_id })
    .then(jobs => {
      if (jobs) {
        res.json({success: true, jobs: jobs});
      }
    });
  });

  // Get the jobs with job id
  app.get('/api/jobsWithId/:job_id', function (req, res) {
    var job_id = req.params.job_id;

    Job
    .findOne({ _id: job_id })
    .then(job => {
      if (job) {
        res.json({success: true, job: job});
      }
    });
  });


  //Get all the jobs
  app.get('/api/jobs', function (req, res) {

    Job.find({}, function(err, jobs) {
      res.send(jobs);
    });
  });

  // Get the job with job id
  app.get('/api/job/:job_id', function (req, res) {
    var job_id = req.params.job_id;

    Job
    .findOne({ _id: job_id })
    .exec()
    .then((job) => {
      res.json(job);
    });
  });

  // Delete the jobs with job id
  app.delete('/api/jobs/:job_id', function (req, res) {
    var job_id = req.params.job_id;

    Job
    .findOne({ _id: job_id })
    .remove()
    .then(() => {
      res.json({success: true});
    });
  });


  // Update the user with ID
  app.put('/api/job/:id', function (req, res) {
    var id = req.params.id;
    var body = req.body;
    Job
    .findOne({ _id: id })
    .then(job => {
      if (job) {
        job.institution_id = body.institution_id;
        job.job_category  = body.job_category;
        job.job_type  = body.job_type;
        job.job_title  = body.job_title;
        job.job_description  = body.job_description ;
        job.job_key_responsibilities = body.job_key_responsibilities;
        job.job_minimum_requirements = body.job_minimum_requirements;
        job.location_country  = body.location_country;
        job.location_state  = body.location_state;
        job.salary_min  = body.salary_min;
        job.salary_max  = body.salary_max;
        job.salary_negotiable  = body.salary_negotiable;
        job.application_deadline  = body.application_deadline;
        job.experience  = body.experience;
        job.job_function  = body.job_function;

        job.company_industry  = body.company_industry;
        job.company_name  = body.company_name;
        job.company_email  = body.company_email;
        job.company_mobile  = body.company_mobile;
        job.company_address  = body.company_address;

        job.post_premium = body.post_premium;

        job.save(function (err, data) {
          if(err) {
            res.status(500).send({message: "Could not update user with id " + req.params.id});
          } else {
            res.json({success: true, job: job});
          }
        });
      }
    });
  });
};
