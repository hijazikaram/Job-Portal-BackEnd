var mongoose = require('mongoose');

var JobSchema = mongoose.Schema({
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
    company_facebook: String,
    company_twitter: String,
    company_google: String,
    company_linkedin: String,

    post_premium: String,

    created_at: Date,
    updated_at: Date
});

// on every save, add the date
JobSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
});

module.exports = mongoose.model('Job', JobSchema);
