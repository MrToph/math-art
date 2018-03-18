module.exports = function(grunt) {

grunt.initConfig({
    babel: {
        options: {
            "sourceMap": true
        },
        dist: {
            files: [{
                "expand": true,
                "cwd": "src/js",
                "src": ["**/*.jsx"],
                "dest": "src/js-compiled/",
                "ext": "-compiled.js"
            }]
        }
    },
    uglify: {
        all_src : {
            options : {
              sourceMap : true,
              sourceMapName : 'src/build/sourceMap.map'
            },
            src : 'src/js-compiled/**/*-compiled.js',
            dest : 'src/build/all.min.js'
        }
    },
    copy: {
        files: {
            cwd: 'src/',  // set working folder / root to copy
            src: '**/*.jsx',           // copy all files and subfolders
            dest: 'C:/',    // destination folder
            expand: true           // required when using cwd
        }
    }
});

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask("default", ["babel", "uglify"]);
};