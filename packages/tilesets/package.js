Package.describe({
  summary: 'Metadata for a Tileset',
  internal: false
});

Package.on_use(function(api){
  api.use('meteor', ['client', 'server']);
  api.export('Tilesets');
  api.add_files('Tilesets.js', ['client', 'server']);
});
