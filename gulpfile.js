(function() {
  'use strict';

  /**
   *
   * Automatic tasks for project
   *
   */
  var exec = require('child_process').exec;
  var gulp = require('gulp');
  var goProcess = exec('go run main.go');
  
  gulp.task('go-reload', function() {
    gulp.watch(['**/*.go', '!public/**/*.js'], function(event) {
      exec('lsof -i :8000', function (err, stdout, stderr) {
        if ( ! stdout) {
          return;
        }

        var tempParts = stdout.split(" ");
        var parts = [];
        var count = 9;
        for (var i = 0; i < tempParts.length; i++) {
          if (tempParts[i] != '') parts.push(tempParts[i]);
        }

        while (parts[count]) {
          exec('kill -9 ' + parts[count]);
          count += 8;
        }
      });

      goProcess = exec('go run main.go', function (err, stdout, stderr) {
        if (err) {
          console.log(stderr);
        } else {
          console.log('File: ' + event.path + ' - ' + event.type);
        }
      }).stdout.pipe(process.stdout);
    });
  });
})();


