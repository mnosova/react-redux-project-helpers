const DEBUG = process.env.NODE_ENV !== 'production';

const path             = require('path');
const gulp             = require('gulp');
const sass             = require('gulp-sass');
const clean            = require('gulp-clean');
const babel            = require('gulp-babel');
const plumber          = require('gulp-plumber');
const imagemin         = require('gulp-imagemin');
const imageminMozjpeg  = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo     = require('imagemin-svgo');

// const babelConf   = {
//   presets: ['@babel/preset-env', '@babel/preset-react'],
//   plugins: [
//     ["@babel/plugin-proposal-decorators", { "legacy": true }],
//     ["@babel/plugin-proposal-class-properties", { "loose": true }],
//     ["@babel/plugin-proposal-object-rest-spread", { "loose": true, "useBuiltIns": true }],
//     ["babel-plugin-transform-require-ignore", {"extensions": [".scss", ".css"]}]
//   ]
// };
const plumberConf = {
  handleError: function (err) {
    console.log(err);
    this.emit('end');
  }
};

const publicDir = 'public/';


// region Config/JSON task

const configSrcDir = ['config/**/*.json'];
const configPubDir = publicDir + 'config';

gulp.task('configs', function () {
  return gulp.src(configSrcDir)
    .pipe(gulp.dest(configPubDir));
});

//endregion

// region Backend/JS task

const backendJSSrcDir = ['backend/**/*.js'];
const backendJSPubDir = publicDir + 'backend';

gulp.task('backend-js', function () {
  return gulp.src(backendJSSrcDir)
    .pipe(plumber(plumberConf))
    .pipe(babel())
    .pipe(gulp.dest(backendJSPubDir));
});

//endregion

// region Modules/JS task

const modulesSrcDir = ['modules/**/*.js'];
const modulesPubDir = publicDir + 'modules';

gulp.task('modules', () =>
  gulp.src(modulesSrcDir)
    .pipe(plumber(plumberConf))
    .pipe(babel())
    .pipe(gulp.dest(modulesPubDir))
);

//endregion

// region Frontend/JS, JSX task

const frontendJSSrcDir = ['frontend/**/*.jsx', 'frontend/**/*.js'];
const frontendJSPubDir = publicDir + 'frontend';

gulp.task('frontend-js', () =>
  gulp.src(frontendJSSrcDir)
    .pipe(plumber(plumberConf))
    .pipe(babel())
    .pipe(gulp.dest(frontendJSPubDir))
);

//endregion

// region Backend/!JS task

const backendNonJSSrcDir = ['backend/**/*.*', '!backend/**/*.js'];
const backendNonJSPubDir = publicDir + 'backend';

gulp.task('backend-nonjs', () =>
  gulp.src(backendNonJSSrcDir)
    .pipe(gulp.dest(backendNonJSPubDir))
);

//endregion

// region Frontend/!JS, !JSX task

const frontendNonJSSrcDir = ['frontend/**/*.*', '!frontend/Images/**/*.*', '!frontend/CSS/**/*.*', '!frontend/**/*.js', '!frontend/**/*.jsx'];
const frontendNonJSPubDir = publicDir + 'frontend';

gulp.task('frontend-nonjs', () =>
  gulp.src(frontendNonJSSrcDir)
    .pipe(gulp.dest(frontendNonJSPubDir))
);

//endregion

//region BrowserSync

gulp.task('bs', function (done) {
  if (DEBUG) {
    const browserSync = require('browser-sync').create();

    browserSync.init({
      host: 'localhost',
      port: 3001,
      ui: {
        port: 3031
      },
      proxy: 'http://spb.sushiwok.ru/',
      //      logLevel: 'debug',
      open: false,
      files: [
        {
          match: [
            path.resolve(`${__dirname}/public/app/**/*.*`)
          ]
        }
      ]
    });

    const ConfigWatcher = gulp.watch(['public/config/**/*.json']);
    ConfigWatcher.on('change', () => {
      setTimeout(() => browserSync.reload(), 500);
    });

    const BackWatcher = gulp.watch(['public/backend/**/*.js']);
    BackWatcher.on('change', () => {
      setTimeout(() => browserSync.reload(), 500);
    });

    const ModulesWatcher = gulp.watch(['public/modules/**/*.js']);
    ModulesWatcher.on('change', () => {
      setTimeout(() => browserSync.reload(), 500);
    });

    const CSSWatcher = gulp.watch(['public/app/**/*.css']);
    CSSWatcher.on('change', (file) => {
      console.log('File ' + file + ' was changed');

      try {
        gulp.src([file]).pipe(browserSync.stream());
      } catch (e) {
        console.error(e);
      }
    });

    const JSWatcher = gulp.watch(['public/app/**/*.js']);
    JSWatcher.on('change', (file) => {
      console.log('File ' + file + ' was changed');

      try {
        gulp.src([file])
          .pipe(plumber(plumberConf))
          .pipe(browserSync.stream());
      } catch (e) {
        console.error(e);
      }
    });
  } else {
    done();
  }
});
//endregion

gulp.task('imagemin', () => {
  if(!DEBUG) {
    return gulp.src(['frontend/Images/**/*.*', '!frontend/Images/**/*.unmin.*'])
      .pipe(imagemin([
        imageminMozjpeg(),
        imageminPngquant({ quality: '0-80' }),
        imageminSvgo()
      ]))
      .pipe(gulp.dest('public/frontend/Images/'));
  } else {
    return gulp.src(['frontend/Images/**/*.*', '!frontend/Images/**/*.unmin.*'])
      .pipe(gulp.dest('public/frontend/Images/'));
  }
});

gulp.task('imageunmin', () => {
  return gulp.src('frontend/Images/**/*.unmin.*')
    .pipe(gulp.dest('public/frontend/Images/'));
});

gulp.task('sass', () => {
  return gulp.src('frontend/CSS/**/*.*')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/frontend/CSS/'));
});

gulp.task('clean', () => {
  return gulp.src(['public/*', '!public/app'])
    .pipe(clean());
});

gulp.task('default', gulp.series('clean', 'modules', 'configs', 'backend-js', 'backend-nonjs', 'frontend-js', 'frontend-nonjs', 'imagemin' , 'imageunmin', 'sass', function (done) {

  if (DEBUG) {
    //region Config/JSON watch

    const configWatcher = gulp.watch(configSrcDir);
    configWatcher.on('change', (file) => {
      if (file.includes('tmp')) return;
      console.log('File ' + file + ' was changed');

      gulp.src([file])
        .pipe(gulp.dest(publicDir + path.dirname(file)));
    });

    //endregion

    //region Backend/JS watch

    const backendJSWatcher = gulp.watch(backendJSSrcDir);
    backendJSWatcher.on('change', (file) => {
      if (file.includes('tmp')) return;
      console.log('File ' + file + ' was changed');

      gulp.src([file])
        .pipe(plumber(plumberConf))
        .pipe(babel())
        .pipe(gulp.dest(publicDir + path.dirname(file)));
    });

    //endregion

    //region Modules/JS watch

    const modulesWatcher = gulp.watch(modulesSrcDir);
    modulesWatcher.on('change', (file) => {
      console.log('File ' + file + ' was changed');
      gulp.src([file])
        .pipe(plumber(plumberConf))
        .pipe(babel())
        .pipe(gulp.dest(publicDir + path.dirname(file)));
    });

    //endregion

    //region Frontend/JS, JSX watch

    const frontendWatcher = gulp.watch(frontendJSSrcDir);
    frontendWatcher.on('change', (file) => {
      setTimeout(function () {
        if (file.includes('tmp')) return;
        console.log('File ' + file + ' was changed');

        gulp.src([file])
          .pipe(plumber(plumberConf))
          .pipe(babel())
          .pipe(gulp.dest(publicDir + path.dirname(file)));
      }, 1000);
    });

    //endregion

    //region Backend/!JS watch

    const backendNonJSWatcher = gulp.watch(backendNonJSSrcDir);
    backendNonJSWatcher.on('change', (file) => {
      if (file.includes('tmp')) return;
      console.log('File ' + file + ' was changed');

      gulp.src([file])
        .pipe(gulp.dest(publicDir + path.dirname(file)));
    });

    //endregion

    //region Frontend/!JS, !JSX watch

    const frontendNonWatcher = gulp.watch(frontendNonJSSrcDir);
    frontendNonWatcher.on('change', (file) => {
      if (file.includes('tmp')) return;
      console.log('File ' + file + ' was changed');

      gulp.src([file])
        .pipe(gulp.dest(publicDir + path.dirname(file)));
    });

    //endregion
  }

  done();
}, 'bs'));
