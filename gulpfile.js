"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	livereload = require("gulp-livereload"),
	sass = require('gulp-sass')(require('node-sass')),
	notify = require("gulp-notify"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	cleanCSS = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	imagemin = require("gulp-imagemin"),
	del = require("del"),
	sassLint = require("gulp-sass-lint"),
	newer = require("gulp-newer"),
	sourcemaps = require("gulp-sourcemaps"),
	babel = require("gulp-babel"),
	plumber = require("gulp-plumber"),
	cp = require("child_process");

/** 
 * Unify all scripts to work with source and destination paths.
 * For more custom paths, please add them in this object
 */
const paths = {
	source: {
		scripts: "src/scripts/",
		sass: "src/sass/",
		images: "src/images/",
		fonts: "src/fonts/",
	},
	destination: {
		scripts: "dist/scripts/",
		css: "dist/css/",
		images: "dist/images/",
		fonts: "dist/fonts/",
	},
};

gulp.task("sass", function() {
	return (
		gulp
		.src(paths.source.sass + "**/*.scss")
		.pipe(
			sass({
				includePaths: [
					"node_modules/foundation-sites/scss/",
				],
			})
		)
		.pipe(sourcemaps.init())
		.pipe(
			sassLint({
				files: {
					ignore: [
						paths.source.sass + "/**/*.css",
						paths.destination.css + "/**/*.css",
					],
				},
			})
		)
		.pipe(sassLint.format())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(paths.destination.css))
		//.pipe(
		//	notify({
		//		onLast: true,
		//
		//	})
		//)
	);
});

gulp.task("cssmin", function() {
	return gulp
		.src(paths.destination.css + "master.css")
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(cleanCSS({ compatibility: "ie8" }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(paths.destination.css))
		.pipe(
			notify({

				onLast: true,
			})
		);
});

// The files to be watched for minifying. If more dev js files are added this
// will have to be updated.
gulp.task("watch", function() {
	livereload.listen();

	gulp.watch(paths.source.sass + "**/*.scss", gulp.series("sass"));
	gulp.watch(paths.source.scripts + "**/*.js", gulp.series("minifyScripts"));
	gulp.watch(paths.source.images + "**/*", gulp.series("optimizeImages"));

	// Once the CSS file is build, minify it.
	gulp.watch(paths.destination.css + "master.css", gulp.series("cssmin"));
});

gulp.task("minifyScripts", function() {
	// Add separate folders if required.
	return gulp
		.src([
			paths.source.scripts + "vendor/*.js",
			paths.source.scripts + "scripts.js",
		])
		.pipe(
			plumber({
				handleError: function(error) {
					console.log(error);
					this.emit("end");
				},
			})
		)
		.pipe(concat("bundle.js"))
		.pipe(gulp.dest(paths.destination.scripts))
		.pipe(concat("bundle.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest(paths.destination.scripts));
});

gulp.task("optimizeImages", function() {
	// Add separate folders if required.
	return gulp
		.src(paths.source.images + "**/*")
		.pipe(newer(paths.destination.images))
		.pipe(imagemin())
		.pipe(gulp.dest(paths.destination.images));
});


// This will take care of rights permission errors if any
gulp.task("cleanup", function() {
	del(paths.destination.scripts + "bundle.min.js");
	del(paths.destination.css + "*.css");
});

// Will delete .git files so that you can use it on your own repository
gulp.task("reset", function() {
	del(".git");
	del(".DS_Store");

	// @TODO: create a command that will rename all functions and comments
	// to use the one the developer needs.
});

// What will be run with simply writing "$ gulp"
gulp.task(
	"default",
	gulp.series(
		"sass",
		gulp.parallel("minifyScripts", "cssmin", "optimizeImages"),
		"watch"
	)
);