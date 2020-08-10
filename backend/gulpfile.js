const fs = require('fs')
const gulp = require('gulp')
const path = require('path')
const plugins = require('gulp-load-plugins')()
const file = require('gulp-file')

const functionsPath = 'lambda'
const buildDir = 'lambda-build'

const getFolders = (dir) => {
	return fs.readdirSync(dir).filter((fileName) => {
		return fs.statSync(path.join(dir, fileName)).isDirectory()
	})
}

gulp.task('clean', () => gulp.src(buildDir, { read: false, allowEmpty: true }).pipe(plugins.clean()))

gulp.task('build', (done) => {
	const folders = getFolders(functionsPath)

	const tasks = folders.map((folder) => {
		const buildPackage = () =>
			gulp
				.src([path.join(functionsPath, folder, '/**/*')], { ignore: ['/**/*test*/**'] })
				.pipe(file('.version', process.env.DRONE_BUILD_NUMBER || 'test1234'))
				.pipe(gulp.dest(path.join(buildDir, folder)))
				.pipe(
					plugins.install({
						commands: {
							'package.json': 'yarn',
						},
						yarn: ['--production'],
					}),
				)
				.once('error', () => {
					this.once('finish', () => process.exit(1))
				})

		buildPackage.displayName = folder
		return buildPackage
	})

	return gulp.series(...tasks, (buildDone) => {
		buildDone()
		done()
	})()
})

gulp.task('default', gulp.series('clean', 'build'))
