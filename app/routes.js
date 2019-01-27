const passport    = require('passport');

module.exports = function (app, db) {
    
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
          return next();
      }
      res.redirect('/');
    };
    
    // SEND USER TO GITHUB FOR AUTHENTICATION
    app.route('/auth/github')
      .get(passport.authenticate('github'));
    
    // REDIRECT USER BACK TO THIS ROUTE TO PROCESS ONCE AUTHENTICATED
    app.route('/auth/github/callback')
      .get(passport.authenticate('github', { failureRedirect: '/' }), (req,res) => {
          req.session.user_id = req.user.id;
          res.redirect('/authenticated');
      });

    // SEND USER TO FACEBOOK FOR AUTHENTICATION
    app.route('/auth/facebook')
      .get(passport.authenticate('facebook'));

    // REDIRECT BACK SAME AS ABOVE
    app.route('/auth/facebook/callback')
      .get(passport.authenticate('facebook', { successRedirect: '/authenticated',
                                      failureRedirect: '/' }));  
  
    // GOOGLE AUTHENTICATION
    app.route('/auth/google')
      .get(passport.authenticate('google', { scope: ['profile'] }));  
  
    // GOOGLE REDIRECT
    app.route('/auth/google/callback').get( 
      passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/authenticated');
      });
  
    // PRIVACY POLICY
    app.route('/privacy-policy')
      .get((req, res) => {
        res.sendFile(process.cwd() + "/views/privacy-policy.html");
    });
  
    // RENDER INDEX.PUG
    app.route('/')
      .get((req, res) => {
        res.render(process.cwd() + '/views/pug/index');
      });
  
    // SUBMIT REVIEW
    app.route('/submitReview/')
      .post((req, res) => {
        let currentReviews = [{
          review: req.body.review,
          rating: req.body.rating,
          author: req.user.name,
          authorId: req.user.id,
          dateAdded: new Date()
        }];
        const query = {gameName: req.body.gameName};
        db.collection('reviews').findOne(query, (err, result) => {
          if (result !== null) {
            for (let i = 0; i < result.reviews.length; i++) {
              // Don't copy across reviews by the same user, new review will overwrite last one
              if (result.reviews[i].authorId !== req.user.id) {
                  currentReviews.push(result.reviews[i]);
              }
            }
          }
          db.collection('reviews').findAndModify(
            query,
            {},
            {$setOnInsert:{
              gameName: req.body.gameName,
            },$set:{
              reviews: currentReviews
            }},
            {upsert:true, new: true}, //Insert object if not found, Return new object after modify
            (err, doc) => {
              if (err) return console.error(err);
              return res.send(doc.value);
            }
          );
        });
    });
  
    // GET REVIEWS TO DISPLAY ON PAGE, MAIN CONTENT
    app.route('/allReviews')
      .get((req, res) => {
        db.collection('reviews').find({}).toArray((err, result) => {
          if (err) return console.error(err);
          res.json({data: result});
          // db.close();
        });
    });
  
    // GET USERNAME TO DISPLAY ON PAGE
    app.route('/username')
      .get((req, res) => {
        res.send(req.user.name);
    });
    
    // GO TO THE PAGE FOR AUTHENTICATED USERS WHERE THEY CAN LEAVE A REVIEW
    app.route('/authenticated')
      .get(ensureAuthenticated, (req, res) => {
        res.render(process.cwd() + '/views/pug/authenticated', {user: req.user});
      });
    
    // LOGOUT
    app.route('/logout')
      .get((req, res) => {
          req.logout();
          res.redirect('/');
      });

    // 404 ERROR
    app.use((req, res, next) => {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
  
}