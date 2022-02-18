const { src, dest, watch, parallel, series } = require('gulp');

const scss              = require('gulp-sass')(require('sass'));
const concat            = require('gulp-concat');
const autoprefixer      = require('gulp-autoprefixer');
const uglify            = require('gulp-uglify');
const imagemin          = require('gulp-imagemin');
// const svgSprite         = require('gulp-svg-sprite');
// const svgmin            = require('gulp-svgmin');
// const cheerio           = require('gulp-cheerio');
const del               = require('del');
const browserSync       = require('browser-sync').create();




// const svgSprites = () => {
//   return src('app/images/icons**/*.svg')
//     .pipe(
//       svgmin({
//         js2svg: {
//           pretty: true,
//         },
//       })
//     )
//     .pipe(
//       cheerio({
//         run: function ($) {
//           $('[fill]').removeAttr('fill');
//           $('[stroke]').removeAttr('stroke');
//           $('[style]').removeAttr('style');
//         },
//         parserOptions: {
//           xmlMode: true
//         },
//       })
//     )
//     .pipe(svgSprite({
//       mode: {
//         stack: {
//           sprite: "../sprite.svg"
//         }
//       },
//     }))
//     .pipe(dest('dist/images/icons'));
// }

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notofy: false
  })

}

function styles() {
  return src('app/scss/style.scss')
  .pipe(scss({outputStyle: 'expanded'}))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())

}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/fancybox/dist/js/jquery.fancybox.js',
    'node_modules/mixitup/dist/mixitup.min.js',
    'node_modules/slick-carousel/slick/slick.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/images/icons**/*.svg')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	  imagemin.mozjpeg({quality: 75, progressive: true}),
	  imagemin.optipng({optimizationLevel: 5}),
	  imagemin.svgo({
	  	plugins: [
			  {removeViewBox: true},
			  {cleanupIDs: false}
		  ]
	  })
  ]))
  .pipe(dest('dist/images'))
}




function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist(){
  return del('dist')

}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  // watch(['app/images/icons/*.svg'], svgSprites);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}





exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
// exports.svgSprites = svgSprites;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);


exports.default = parallel(styles, scripts, browsersync, watching);

