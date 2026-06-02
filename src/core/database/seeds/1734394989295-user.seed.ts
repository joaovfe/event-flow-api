import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RoleEntity } from '@modules/role/domain/entities/role.entity';
import { PasswordHelper } from '@modules/user/domain/helpers/password.helper';
import { ERoleReference } from '@modules/role/domain/enums/role-reference.enum';

export class UserSeed1734394989295 implements Seeder {
  track = false;

  private readonly seedUsers = [
    {
      name: 'Master',
      email: 'master@email.com',
      password: 'master1234',
      role: ERoleReference.MASTER,
    },
    {
      name: 'Administrador',
      email: 'admin@email.com',
      password: 'admin1234',
      role: ERoleReference.ADMIN,
    },
  ];

  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UserEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);

    const existingUsers = await userRepository.find({
      where: this.seedUsers.map((user) => ({ email: user.email })),
    });

    if (existingUsers.length >= this.seedUsers.length) {
      console.log('Seed de user executada anteriormente.');
      return;
    }

    const existingEmails = new Set(existingUsers.map((user) => user.email));

    for (const seedUser of this.seedUsers) {
      if (existingEmails.has(seedUser.email)) {
        continue;
      }

      const role = await roleRepository.findOne({
        where: { reference: seedUser.role },
      });

      const password = await PasswordHelper.hash(seedUser.password);

      await userRepository.save({
        name: seedUser.name,
        email: seedUser.email,
        password,
        role,
      });
    }

    console.log('Seed de user executada com sucesso!');
  }
}
