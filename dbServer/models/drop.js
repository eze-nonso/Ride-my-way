import Seeders from '../seeders';

Seeders.drop((error) => {
  if (error) throw error;
  return Seeders.populate((error2) => {
    if (error2) throw error2;
  });
});
