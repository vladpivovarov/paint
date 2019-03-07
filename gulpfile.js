"use strict";

const gulp = require("gulp");
const gp = require("gulp-load-plugins")();
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const del = require('del');
const bs = require('browser-sync').create();
const fs = require('fs');

// ИЗМЕНЯЮЩИЙСЯ БЛОК --открыт
const src = "./src/";
const dist = "./dist/";

const srcPath = {
  pug:    `${src}template/pages/*.pug`,
  js:     `${src}scripts/main.js`,
  scss:   `${src}style/main.scss`,
  img:    `${src}images/**/*.*`,
  fonts:  `${src}fonts/**/*.*`,
  sprite: `${src}sprite/`
};

const distPath = {
  js:     `${dist}assets/scripts/`,
  css:    `${dist}assets/style/`,
  img:    `${dist}assets/images/`,
  fonts:  `${dist}assets/fonts/`,
  sprite: `${dist}assets/images/`
};
// ИЗМЕНЯЮЩИЙСЯ БЛОК --закрыт

// js 
// сторонние сss-библиотеки подключаем в style.js (преобразуется в foundation.css)
// сторонние js-библиотеки  подключаем в webpack.config.js (ProvidePlugin)
gulp.task("js", () => {
  return gulp.src(srcPath.js)
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(dist))
});

// pug
gulp.task("pug", () => {
  return gulp.src(srcPath.pug)
		.pipe(gp.pug({
			locals: JSON.parse(fs.readFileSync('./content.json', 'utf8')), 
			pretty: true 
		}))
		.on("error", gp.notify.onError((err) => {
			return {
				title: "Pug",
				message: err.message
			}
		}))
		.pipe(gulp.dest(dist))
});

// sass
gulp.task("sass", () => {
  return gulp.src(srcPath.scss)
		.pipe(gp.sourcemaps.init())
		.pipe(gp.sass())
		.on("error", gp.notify.onError((err) => {
			return {
				title: "Sass",
				message: err.message
			}
    }))
		.pipe(gp.autoprefixer({
			browsers: ["last 3 version", "> 1%", "ie 8", "ie 9"]
    }))
    .pipe(gp.csso())
    .pipe(gp.sourcemaps.write())
    .pipe(gp.rename({
      suffix: ".min",
    }))
		.pipe(gulp.dest(distPath.css))
});

// копирование шрифтов
gulp.task("font:copy", () => {
  return gulp.src(srcPath.fonts)
    .pipe(gulp.dest(distPath.fonts))
});

// копирование img
gulp.task("img:copy", () => {
  return gulp.src(srcPath.img)
    .pipe(gulp.dest(distPath.img))
})

// спрайт из png 
// использовать как <div class="icon-[imageName]"></div> 
// scss импортируем в main.scss
gulp.task('sprite:png', () => {
  var spriteData = gulp.src(`${srcPath.sprite}**/*.png`)
  .pipe(gp.spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssFormat: "css",
    padding: 100,
    imgPath: "../images/sprite.png" // виден в css
  }));
  var a = spriteData.img.pipe(gulp.dest(distPath.img));
  var b = spriteData.css.pipe(gulp.dest(`${src}style/sprite`));
  return(a,b);
})

// спрайт из svg
gulp.task('sprite:svg', () => {
  return gulp.src(`${srcPath.sprite}**/*.svg`)
    .pipe(gp.svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(gp.cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gp.replace('&gt;', '>'))
    .pipe(gp.svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(gulp.dest(distPath.img))
});

// удаление dist
gulp.task("clean", () => {
  return del(dist);
});

// слежка за изменениями в src и запуск задач
gulp.task("watch", () => {
  gulp.watch(`${src}style/**/*.*`, gulp.series("sass"));
  gulp.watch(`${src}template/**/*.*`, gulp.series("pug"));
  gulp.watch(`${src}scripts/**/*.*`, gulp.series("js"));
});

// запуск сервера на dist и перезагрузка сервера при изменениях в dist
gulp.task("serve", () => {
  bs.init({
    open: true,
    server: dist
  });
  bs.watch(`${dist}/**/*.*`).on("change", bs.reload);
});

gulp.task("default", gulp.series(
  "clean",
  "sprite:png",
	gulp.parallel(
    "pug",            
    "sass",
    "js",     
    "font:copy",
    "img:copy", 
    "sprite:svg",
	),
	gulp.parallel(
    "watch",
    "serve"
    )
));