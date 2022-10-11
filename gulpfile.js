const { src, dest, watch, parallel } = require('gulp');


// JS --------------------------------------------
const terser = require('gulp-terser-js');


function javascript( done ){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
    done();
}

// CSS --------------------------------------------
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps')


function css (done){

    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe( plumber() )
        .pipe( sass() )
        .pipe( postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') )
    done()

}

function dev( done ){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

// Variant using gulp tasks -------------------------

// const gulp = require('gulp'),
//     sass = require('gulp-sass')(require('sass')),
//     autoprefixer = require('gulp-autoprefixer');

// gulp.task('sass', ()=> 
//     gulp.src('src/scss/**/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('build/css'))
// )

// Images --------------------------------------------
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require ('gulp-avif');

function images(done){
    const options = {
        optimizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(options) ) )
        .pipe( dest('build/img') );


    done();
}

function versionWebp( done ) {

    const options = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(options) )
        .pipe( dest('build/img') ) 

    done();
}

function versionAvif( done ) {

    const options = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(options) )
        .pipe( dest('build/img') ) 

    done();
}



//Exports --------------------------------------------
exports.css = css;
exports.js = javascript;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.images = parallel(images, versionAvif, versionWebp);
exports.dev = dev;
