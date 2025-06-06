import { appDataSource } from './datasource.js';
import User from './entities/user.js';

appDataSource.initialize().then(async () => {
  const usersRepo = appDataSource.getRepository(User);
  await usersRepo.save([
    { email: 'rayann.bentounes@theodo.com', firstname: 'Rrayann', lastname: 'bentounes.' },
    { email: 'thomas.eudes@theodo.com', firstname: 'Thomas', lastname: 'Eudes.' },
    { email: 'un@example.com', firstname: 'Invité', lastname: 'C.' }
  ]);
  console.log('Utilisateurs créés !');
  process.exit(0);
});