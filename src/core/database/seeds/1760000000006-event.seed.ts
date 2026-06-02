import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { EventEntity } from '@modules/event/domain/entities/event.entity';
import { SlugHelper } from '@modules/event/domain/helpers/slug.helper';
import { EStatus } from '@shared/enums/status.enum';

const SEED_EVENTS: Array<{
  title: string;
  description: string;
  location: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  status: EStatus;
}> = [
  {
    title: 'Festival Synapse 2026',
    description:
      'O maior festival de tecnologia e música do ano. Palestras, workshops e shows ao vivo com artistas nacionais e internacionais.',
    location: 'Arena Synapse — São Paulo, SP',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf52929825?w=800',
    startDate: new Date('2026-08-15T20:00:00.000Z'),
    endDate: new Date('2026-08-16T04:00:00.000Z'),
    status: EStatus.ACTIVE,
  },
  {
    title: 'Tech Meetup EventFlow',
    description:
      'Encontro mensal da comunidade de desenvolvedores. Networking, lightning talks e demo do EventFlow.',
    location: 'Synapse Studios — Florianópolis, SC',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    startDate: new Date('2026-05-20T19:00:00.000Z'),
    endDate: new Date('2026-05-20T22:00:00.000Z'),
    status: EStatus.ACTIVE,
  },
  {
    title: 'Workshop Design Systems',
    description:
      'Aprenda a construir e manter design systems escaláveis com Figma e React. Vagas limitadas.',
    location: 'Online via Zoom',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    startDate: new Date('2026-06-10T14:00:00.000Z'),
    endDate: new Date('2026-06-10T18:00:00.000Z'),
    status: EStatus.INACTIVE,
  },
];

export class EventSeed1760000000006 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(EventEntity);

    const slugs = SEED_EVENTS.map((event) => SlugHelper.generate(event.title));
    const existing = await repository.find({ where: slugs.map((slug) => ({ slug })) });

    if (existing.length === SEED_EVENTS.length) {
      console.log('Seed de event executada anteriormente.');
      return;
    }

    const existingSlugs = new Set(existing.map((event) => event.slug));

    const toInsert = SEED_EVENTS.filter(
      (event) => !existingSlugs.has(SlugHelper.generate(event.title)),
    ).map((event) =>
      repository.create({
        ...event,
        slug: SlugHelper.generate(event.title),
      }),
    );

    if (toInsert.length === 0) {
      console.log('Seed de event executada anteriormente.');
      return;
    }

    await repository.save(toInsert);

    console.log(`Seed de event executada com sucesso! (${toInsert.length} evento(s))`);
  }
}
