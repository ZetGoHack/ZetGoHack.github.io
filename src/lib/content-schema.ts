import { z } from 'astro/zod';

const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);

export const photoSchema = z.object({
  id,
  src: z.string().regex(/^\/(photos|media)\/[a-z0-9-]+\.jpg$/),
  alt: z.string().max(300),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  focus: z
    .string()
    .regex(/^center \d{1,3}%$/)
    .optional(),
  hidden: z.boolean(),
});

export const albumSchema = z.object({
  id,
  slug: id,
  title: z.string().min(1).max(80),
  coverId: id.nullable(),
  photoIds: z.array(id),
  hidden: z.boolean(),
});

export const pricingPackageSchema = z.object({
  name: z.string().max(80),
  price: z.string().max(40),
  features: z.array(z.string().max(200)).max(20),
  highlighted: z.boolean(),
});

export const contentSchema = z
  .object({
    version: z.literal(1),
    revision: z.number().int().nonnegative().default(0),
    site: z.object({
      tagline: z.string().max(300),
      phone: z.string().max(40),
      email: z.string().max(120),
      instagram: z.string().max(200).regex(/^(https?:\/\/\S+)?$/, 'Ссылка на Instagram должна начинаться с https://'),
      telegram: z.string().max(200).regex(/^(https?:\/\/\S+)?$/, 'Ссылка на Telegram должна начинаться с https://'),
      handle: z.string().max(80),
    }),
    about: z.object({
      bio: z.string().max(4000),
      awards: z.array(z.string().max(200)).max(30),
    }),
    pricing: z.object({
      intro: z.string().max(400),
      packages: z.array(pricingPackageSchema).max(8),
    }),
    home: z.object({
      heroPhotoId: id.nullable(),
      showCarousel: z.boolean(),
      autoplaySeconds: z.number().int().min(0).max(60),
    }),
    photos: z.array(photoSchema),
    albums: z.array(albumSchema),
    featured: z.array(id),
  })
  .superRefine((c, ctx) => {
    const photoIds = new Set<string>();
    for (const p of c.photos) {
      if (photoIds.has(p.id)) ctx.addIssue({ code: 'custom', message: `Duplicate photo id ${p.id}` });
      photoIds.add(p.id);
    }
    const slugs = new Set<string>();
    const albumIds = new Set<string>();
    const placed = new Set<string>();
    for (const a of c.albums) {
      if (albumIds.has(a.id)) ctx.addIssue({ code: 'custom', message: `Duplicate album id ${a.id}` });
      albumIds.add(a.id);
      if (slugs.has(a.slug)) ctx.addIssue({ code: 'custom', message: `Duplicate album slug ${a.slug}` });
      slugs.add(a.slug);
      for (const pid of a.photoIds) {
        if (!photoIds.has(pid)) ctx.addIssue({ code: 'custom', message: `Album ${a.slug} references unknown photo ${pid}` });
        if (placed.has(pid)) ctx.addIssue({ code: 'custom', message: `Photo ${pid} is in more than one album` });
        placed.add(pid);
      }
      if (a.coverId && !a.photoIds.includes(a.coverId)) {
        ctx.addIssue({ code: 'custom', message: `Cover of ${a.slug} is not in that album` });
      }
    }
    for (const pid of c.featured) {
      if (!photoIds.has(pid)) ctx.addIssue({ code: 'custom', message: `Carousel references unknown photo ${pid}` });
    }
    if (c.home.heroPhotoId && !photoIds.has(c.home.heroPhotoId)) {
      ctx.addIssue({ code: 'custom', message: 'Hero photo does not exist' });
    }
  });

export type Photo = z.infer<typeof photoSchema>;
export type Album = z.infer<typeof albumSchema>;
export type PricingPackage = z.infer<typeof pricingPackageSchema>;
export type Content = z.infer<typeof contentSchema>;
