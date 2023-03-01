var gulpversion    = '4'; // Gulp version: 3 or 4

// Подключаем Gulp и все необходимые библиотеки
var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass')(require('sass')),
		browserSync    = require('browser-sync'),
		cleanCSS       = require('gulp-clean-css'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('bourbon'),
		ftp            = require('vinyl-ftp');

// Обновление страниц сайта на локальном сервере
gulp.task('browser-sync', function() {
	browserSync({
		proxy: "Landing2",
		notify: false
	});
});

// Компиляция stylesheet.css
gulp.task('sass', function() {
	return gulp.src('css/sass/stylesheet.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('code', function() {
	return gulp.src(['*.html'])
	.pipe(browserSync.reload({ stream: true }))
});

// Выгрузка изменений на хостинг
gulp.task('deploy', function() {
	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});
	var globs = [
	''
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));
});

// Наблюдение за файлами

if (gulpversion == 3) {
	gulp.task('watch', ['sass', 'browser-sync'], function() {
		gulp.watch('css/sass/stylesheet.sass', ['sass']);
		gulp.watch('*.html', browserSync.reload);
	});
	gulp.task('default', ['watch']);
}

if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('css/sass/stylesheet.sass', gulp.parallel('sass'));
		gulp.watch('*.html', gulp.parallel('code'));
	});
	gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));
}
