exports.config =
  paths:
    public: 'public'

  files:
    javascripts:
      joinTo:
        'js/app.js': /^app\/(?!assets)/
    stylesheets:
      joinTo:
        'ss/app.css': /^app\/styles/

  sourceMaps: true
