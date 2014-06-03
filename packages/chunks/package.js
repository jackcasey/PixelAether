Package.describe({
  summary: 'A rectangular bite of a Beautiful map',
  internal: false
});

Package.on_use(function(api){
  api.use('meteor', ['client', 'server']);
  api.use('rift', 'client');

  api.export('Chunks', 'server');
  api.export('getChunks', 'client');
  api.add_files('client.js', 'client');
  api.add_files('server.js', 'server');
  api.add_files('shared.js', ['client', 'server']);
});
