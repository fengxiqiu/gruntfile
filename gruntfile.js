module.exports = function (grunt) {
    var 
        GRUNT_PATH = './',
        PRO_PATH = './';

    var task_config = require(PRO_PATH+'task.json');

    var
        concat_config = {
            options: {
                separator: ';',
                stripBanners: true
            }
        },
        less_config = {},
        uglify_config = {},
        cssmin_config = {},
        imagemin_config = {},
        watch_config = {};

    for(var name in task_config) {

        var 
            _task = task_config[name],
            _path = _task.proPath || PRO_PATH,
            _opt = [];
        if(_task.less){
            less_config[name] = _task.less;
            _opt.push('less:'+name);
        }
        if(_task.concat) {
            concat_config[name] = fix_asset_path(_path, _task.concat);

            _opt.push('concat:'+name);
        }

        if(typeof _task.uglify == 'object') {
            uglify_config[name] = fix_asset_path(_path, _task.uglify);
        }else if(_task.uglify !== false &&_task.uglify !==undefined) {

            uglify_config[name] = {
                files: [{
                    src: _task.concat.dest,
                    dest: add_file_suffix(_task.concat.dest, 'min')
                }]
            }
        }

        if(uglify_config[name]) {
            _opt.push('uglify:'+name);
        }

        if(_task.cssmin) {
            cssmin_config[name] = fix_asset_path(_path, _task.cssmin);

            _opt.push('cssmin:'+name);
        }

        if(_task.imagemin) {
            imagemin_config[name] = fix_img_path(_path, _task.imagemin);

            _opt.push('imagemin:'+name);
        }

        if(_task.watch !== false) {
            watch_config[name] = {
                files: [PRO_PATH+'dev/css/**/*.css',PRO_PATH+'dev/js/**/*.js'],
                tasks: _opt,
                options: {
                  spawn: false
                }
            }

            _opt.push('watch:'+name);
        }

        console.log(name+':'+_opt);

        grunt.registerTask(name, _opt);
    }

    function fix_asset_path(prefix, task) {
        task.src.forEach(function(url, i) {
            task.src[i] = prefix+url;
        });

        task.dest = prefix + task.dest;

        return task;
    }

    function fix_img_path(prefix, task) {
        task.files.forEach(function(config, i) {
            config.cwd = prefix + config.cwd;
            config.dest = prefix + config.dest;
        });
        return task;
    }

    function add_file_suffix(file, suffix) {
        return file.replace(/(\.[^.]*)$/,'.'+suffix+'$1');
    }

    grunt.initConfig({
        //pkg: grunt.file.readJSON(PRO_PATH+'package.json'),
        less: less_config,
        concat: concat_config,
        uglify: uglify_config,
        cssmin: cssmin_config,
        imagemin: imagemin_config,
        watch: watch_config
    });
    grunt.loadNpmTasks(GRUNT_PATH+'grunt-contrib-less');
    grunt.loadNpmTasks(GRUNT_PATH+'grunt-contrib-concat');
    grunt.loadNpmTasks(GRUNT_PATH+'grunt-contrib-uglify');
    grunt.loadNpmTasks(GRUNT_PATH+'grunt-contrib-cssmin');
    grunt.loadNpmTasks(GRUNT_PATH+'grunt-contrib-imagemin');
    grunt.loadNpmTasks(GRUNT_PATH+'grunt-contrib-watch');
}
