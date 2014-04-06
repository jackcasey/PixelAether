Package.describe({
  summary: 'A rectangular bite of a Beautiful map',
  internal: false
});

Package.on_use(function(api){
  api.use('meteor', ['client', 'server']);
  api.export('Chunks');
  api.add_files('Chunks.js', ['client', 'server']);
  api.add_files('shared.js', ['client', 'server']);
  api.add_files('server.js', 'server');
});
