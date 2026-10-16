/**
 * Seed script.
 *
 *   npm run seed          -> upserts content, leaves existing docs alone where possible,
 *                            and ensures the default admin exists.
 *   npm run seed:fresh    -> wipes content collections first, then re-seeds (destructive).
 *
 * The admin account is created ONLY from environment variables and its password
 * is bcrypt-hashed. No plain-text credentials are ever stored.
 */
import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import {
  AdminUser,
  Page,
  Menu,
  MenuItem,
  SiteSetting,
  SocialLink,
  Section,
  Dish,
  Testimonial,
  Faq,
} from '../models/index.js';
import { toSlug } from '../utils/slug.js';
import * as data from './data.js';

const fresh = process.argv.includes('--fresh');

function log(...args) {
  // eslint-disable-next-line no-console
  console.log('[seed]', ...args);
}

async function seedAdmin() {
  const { name, email, password } = env.admin;
  const existing = await AdminUser.findOne({ email });
  if (existing) {
    log(`admin "${email}" already exists — leaving password untouched.`);
    return;
  }
  if (!password) {
    log(
      `WARNING: no ADMIN_PASSWORD set in .env — skipping admin creation. ` +
        `Set ADMIN_PASSWORD and re-run "npm run seed".`
    );
    return;
  }
  const passwordHash = await AdminUser.hashPassword(password);
  await AdminUser.create({ name, email, passwordHash, role: 'admin' });
  log(`created admin account: ${email}`);
}

async function seedSettings() {
  for (const s of data.siteSettings) {
    await SiteSetting.updateOne(
      { key: s.key },
      { $set: s },
      { upsert: true }
    );
  }
  log(`site settings: ${data.siteSettings.length} upserted`);
}

async function seedSocial() {
  for (const s of data.socialLinks) {
    await SocialLink.updateOne({ platform: s.platform }, { $set: s }, { upsert: true });
  }
  log(`social links: ${data.socialLinks.length} upserted`);
}

async function seedSections() {
  for (const s of data.sections) {
    await Section.updateOne({ key: s.key }, { $set: s }, { upsert: true });
  }
  log(`sections: ${data.sections.length} upserted`);
}

async function seedPages() {
  for (const p of data.pages) {
    await Page.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  }
  log(`pages: ${data.pages.length} upserted`);
}

async function seedDishes() {
  const all = [...data.salads, ...data.lunches, ...data.wraps];
  for (const d of all) {
    const slug = toSlug(d.name);
    await Dish.updateOne({ slug }, { $set: { ...d, slug } }, { upsert: true });
  }
  log(`menu items: ${all.length} upserted (${data.salads.length} salad, ${data.lunches.length} lunch, ${data.wraps.length} wrap)`);
}

async function seedTestimonials() {
  // Testimonials have no natural unique key; use name+sortOrder for idempotency.
  for (const t of data.testimonials) {
    await Testimonial.updateOne(
      { name: t.name, sortOrder: t.sortOrder },
      { $set: t },
      { upsert: true }
    );
  }
  log(`testimonials: ${data.testimonials.length} upserted`);
}

async function seedFaqs() {
  for (const f of data.faqs) {
    await Faq.updateOne({ question: f.question }, { $set: f }, { upsert: true });
  }
  log(`faqs: ${data.faqs.length} upserted`);
}

async function seedMenus() {
  // Header menu.
  const header = await Menu.findOneAndUpdate(
    { location: 'header' },
    { $set: { name: 'Main Navigation', location: 'header' } },
    { upsert: true, new: true }
  );
  // Footer menu.
  const footer = await Menu.findOneAndUpdate(
    { location: 'footer' },
    { $set: { name: 'Footer Navigation', location: 'footer' } },
    { upsert: true, new: true }
  );

  // Rebuild items so seeding stays deterministic.
  await MenuItem.deleteMany({ menu: { $in: [header._id, footer._id] } });

  for (const item of data.headerMenuItems) {
    await MenuItem.create({ ...item, menu: header._id, parent: null });
  }

  for (const col of data.footerMenuTree) {
    const parent = await MenuItem.create({
      menu: footer._id,
      parent: null,
      label: col.label,
      url: col.url,
      linkType: col.linkType,
      sortOrder: col.sortOrder,
    });
    for (const child of col.children || []) {
      await MenuItem.create({ ...child, menu: footer._id, parent: parent._id });
    }
  }
  log('menus: header + footer rebuilt');
}

async function wipeContent() {
  log('--fresh: wiping content collections (admins are preserved)...');
  await Promise.all([
    Page.deleteMany({}),
    Menu.deleteMany({}),
    MenuItem.deleteMany({}),
    SiteSetting.deleteMany({}),
    SocialLink.deleteMany({}),
    Section.deleteMany({}),
    Dish.deleteMany({}),
    Testimonial.deleteMany({}),
    Faq.deleteMany({}),
  ]);
}

async function main() {
  await connectDB();
  if (fresh) await wipeContent();

  await seedAdmin();
  await seedSettings();
  await seedSocial();
  await seedSections();
  await seedPages();
  await seedDishes();
  await seedTestimonials();
  await seedFaqs();
  await seedMenus();

  log('done ✅');
  await disconnectDB();
  process.exit(0);
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', err);
  await disconnectDB();
  process.exit(1);
});
