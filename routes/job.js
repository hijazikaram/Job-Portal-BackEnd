const Job = require('../model/job');
const Application = require('../model/application');
const Bookmark = require('../model/bookmark');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = (app) => {

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
      company_facebook: req.body.company_facebook || '',
      company_twitter: req.body.company_twitter || '',
      company_google: req.body.company_google || '',
      company_linkedin: req.body.company_linkedin || '',

      post_premium : req.body.post_premium || ''
    };

    const job = new Job(data);

    job.save(function (err, job) {
      if (err) res.status(400).json({ error: 'Validation exception' });
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
    var today = new Date();
    var ago_30 = new Date(today - 1000 * 60 * 60 * 24 * 30);

    Job.find({ created_at: {
      $gte: ago_30.toISOString(),
      $lt: today.toISOString()
    }}, function(err, jobs) {
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

  app.get('/api/job/getJobIds', function (req, res) {
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

  // Get job search options
  app.get('/api/job_search_options', function (req, res) {
    var today = new Date();
    var ago_30 = new Date(today - 1000 * 60 * 60 * 24 * 30);

    Job.find({ created_at: {
      $gte: ago_30.toISOString(),
      $lt: today.toISOString()
    }},
    'job_category location_state location_country',
    function(err, jobs) {
      var jobCategoryOptions = ["Job Category"], jobLocationOptions = ["Job Location"];
      jobs.map(function (job) {
        if (job.job_category && !jobCategoryOptions.includes(job.job_category)) {
          jobCategoryOptions.push(job.job_category);
        }
        var job_location = job.location_state;
        if (job_location)
          job_location += ", ";
        job_location += job.location_country;
        if (job_location && !jobLocationOptions.includes(job_location)) {
          jobLocationOptions.push(job_location);
        }
      });
      res.json({jobCategoryOptions : jobCategoryOptions, jobLocationOptions : jobLocationOptions});
    });
  });

  // Update the user with ID
  app.put('/api/job/:id', function (req, res) {
    console.log(req.file);
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

  app.post('/api/jobs/:jobId/apply', upload.single('resume'), (req, res) => {
    const { phoneNumber, email, userId } = req.body;
    var fileId = new ObjectId();
    const data = {
      phoneNumber,
      email,
      userId,
      resumePath: req.file && req.file.path,
      jobId: req.params.jobId
    };
    if(req.file){
        var writestream = gfs.createWriteStream({
            filename: req.file.filename,
            _id: fileId
        });

        writestream.on('close', function(savedFile) {
            data.resumeName = savedFile.filename;
            data.resumeId = savedFile._id;
            const application = new Application(data);
            application.save((err, result) => {
              if (err) {
                console.log(err);
                res.status(400).json({ error: 'Validation exception' });
              }
              else res.json({success: true, application: result})
            })

        });

        // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
        fs.createReadStream("uploads/" + req.file.filename)
            .on("end", function() {
                fs.unlink("uploads/" + req.file.filename, (err) => {
                  console.log(err);
                });
            })
            .on("err", function() {
                console.log("err");
            })
            .pipe(writestream);
      }

  });

  app.get('/api/job/resume/:id', (req, res) => {
    let readstream = gfs.createReadStream({
       _id: req.params.id
    });
   readstream.on("error", function(err) {
       res.send("No image found with that title");
   });
   readstream.pipe(res);
})

  app.post('/api/jobs/:jobId/bookmark', (req, res) => {
    const { jobId, userId } = req.body;
    const data = {
      userId,
      jobId
    }
    const bookmarkedJobs = new Bookmark(data);
    bookmarkedJobs.save((err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: 'Validation exception' });
      }
      else res.json({success: true, bookmarkedJobs: result})
    })
  });
  app.get('/api/jobs/:jobId/applications', (req, res) => {
    const jobId = req.params.jobId;
    Job
    .findOne({ _id: jobId })
    .then(job => {
      Application
        .find({ jobId: job._id })
        .then(apps => res.json({ applications: apps }))
    })
    .catch(err => {
      res.status(404).json({ error: `A job with id ${jobId} does not exist.` })
    })
  });
};
