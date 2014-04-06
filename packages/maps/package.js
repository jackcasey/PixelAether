Package.describe({
  summary:'Metadata for Beautiful Map - a collection of chunks',
  internal: false,
});

Package.on_use(function(api){
  api.use('meteor', ['client', 'server']);
  api.export('Maps');
  api.add_files('Maps.js', ['client', 'server']);
});
