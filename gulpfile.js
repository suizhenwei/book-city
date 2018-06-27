var gulp = require('gulp');
var server = require('gulp-webserver');
var mincss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var minjs = require('gulp-uglify');
var minhtml = require('gulp-htmlmin');
var babel = require('gulp-babel');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mock = require('./mock/');
var sass = require('gulp-sass');
var userData = require('./mock/login/data').userInfo;
gulp.task('sass', function() {
    gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
});
gulp.task('devserver', function() {
    gulp.src('src')
        .pipe(server({
            port: 6060,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                console.log(req.url)
                if (req.url === '/favicon.ico') {
                    return;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    if (pathname === '/api/login' || pathname === '/api/reglogin') {
                        var data = [];
                        req.on('data', function(chunk) {
                            data.push(chunk)
                        });
                        req.on('end', function() {
                            var buf = Buffer.concat(data).toString();
                            buf = require('querystring').parse(buf);
                            if (pathname === '/api/login') {
                                // 登录验证
                                var result = userData.some(function() {
                                    return userData.user == data.user && userData.pwd == data.pwd
                                });
                                if (result) {
                                    res.end('{"code":1,"mes":"登陆成功"}')
                                } else {
                                    res.end('{"code":1,"mes":"用户名或密码错误}')
                                }
                            } else {
                                // 注册
                                userData.push(data);
                                var userObj = {
                                    userInfo: userData
                                };
                                fs.writeFileSync('./mock/user/user.json', JSON.stringify(userObj));
                                res.end('{"code":1,"mes":"注册成功"}')
                            }
                        })
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
gulp.task('change', function() {
    gulp.watch('src/sass/*.scss', ['sass'])
});
gulp.task('dev', ['sass', 'change', 'devserver']);

//线上
gulp.task('mincss', function() {
    gulp.src('src/css/*.css')
        .pipe(mincss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('build/css'))
});
gulp.task('minjs', function() {
    gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(minjs())
        .pipe(gulp.dest('build/js'))
});
gulp.task('minhtml', function() {
    gulp.src('src/**/*.html')
        .pipe(minhtml({
            removeComments: false,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('build'))
});
gulp.task('buildserver', function() {
    gulp.src('build')
        .pipe(server({
            port: 6060,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                console.log(req.url)
                if (req.url === '/favicon.ico') {
                    return;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    if (pathname === '/api/login' || pathname === '/api/reglogin') {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk)
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(data).toString();
                            data = require('querystring').parse(dara);
                            if (pathname === '/api/login') {
                                // 登录验证
                                var result = userData.some(function() {
                                    return userData.user == data.user && userData.pwd == data.pwd
                                });
                                if (result) {
                                    res.end('{"code":1,"mes":"登陆成功"}')
                                } else {
                                    res.end('{"code":1,"mes":"用户名或密码错误}')
                                }
                            } else {
                                // 注册
                                userData.push(data);
                                var userObj = {
                                    userInfo: userdata
                                };
                                fs.writeFileSync('./mock/user/user.json', JSON.stringify(userObj));
                                res.end('{"code":1,"mes":"注册成功"}')
                            }
                        })
                        return false;
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
gulp.task('build', ['mincss', 'minjs', 'minhtml', 'buildserver'])