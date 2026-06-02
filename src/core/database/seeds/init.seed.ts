import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import { AbilitySeed1734390419270 } from './1734390419270-ability.seed';
import { RoleSeed1734391606183 } from './1734391606183-role.seed';
import { UserSeed1734394989295 } from './1734394989295-user.seed';
import { EventSeed1760000000006 } from './1760000000006-event.seed';
import { TicketTypeSeed1760000000007 } from './1760000000007-ticket-type.seed';
import { OrderSeed1760000000008 } from './1760000000008-order.seed';
import { TicketSeed1760000000009 } from './1760000000009-ticket.seed';

export class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await runSeeders(dataSource, {
      seeds: [
        AbilitySeed1734390419270,
        RoleSeed1734391606183,
        UserSeed1734394989295,
        EventSeed1760000000006,
        TicketTypeSeed1760000000007,
        OrderSeed1760000000008,
        TicketSeed1760000000009,
      ],
    });

    console.log('Seeds executadas com sucesso!');
  }
}
