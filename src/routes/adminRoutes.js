import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadImageMiddleware } from '../middleware/upload.js';

import * as overview from '../controllers/admin/overviewController.js';
import * as pages from '../controllers/admin/pageController.js';
import * as sections from '../controllers/admin/sectionController.js';
import * as settings from '../controllers/admin/settingsController.js';
import * as menus from '../controllers/admin/menuController.js';
import * as media from '../controllers/admin/mediaController.js';
import * as submissions from '../controllers/admin/submissionController.js';
import {
  dishController,
  testimonialController,
  faqController,
  socialController,
} from '../controllers/admin/simpleResources.js';

import {
  reorderSchema,
  pageCreateSchema,
  pageUpdateSchema,
  dishCreateSchema,
  dishUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  faqCreateSchema,
  faqUpdateSchema,
  sectionUpdateSchema,
  socialCreateSchema,
  socialUpdateSchema,
  menuCreateSchema,
  menuUpdateSchema,
  menuItemCreateSchema,
  menuItemUpdateSchema,
  settingsBulkSchema,
  mediaUpdateSchema,
  submissionUpdateSchema,
} from '../validators/contentValidators.js';

const router = Router();

// Every admin route requires a valid session.
router.use(requireAuth);

/** Mount standard CRUD + reorder routes for a crudFactory controller. */
function mountCrud(base, controller, { createSchema, updateSchema }) {
  router.get(`${base}`, controller.list);
  router.get(`${base}/:id`, controller.getOne);
  router.post(`${base}`, validate({ body: createSchema }), controller.create);
  router.post(`${base}/reorder`, validate({ body: reorderSchema }), controller.reorder);
  router.patch(`${base}/:id`, validate({ body: updateSchema }), controller.update);
  router.delete(`${base}/:id`, controller.remove);
}

/* ---- Dashboard ---- */
router.get('/overview', overview.overview);

/* ---- Pages (custom controller: slug, publish, system guard) ---- */
router.get('/pages', pages.list);
router.get('/pages/:id', pages.getOne);
router.post('/pages', validate({ body: pageCreateSchema }), pages.create);
router.post('/pages/reorder', validate({ body: reorderSchema }), pages.reorder);
router.post('/pages/:id/publish', pages.setStatus('published'));
router.post('/pages/:id/unpublish', pages.setStatus('draft'));
router.patch('/pages/:id', validate({ body: pageUpdateSchema }), pages.update);
router.delete('/pages/:id', pages.remove);

/* ---- Simple CRUD resources ---- */
mountCrud('/dishes', dishController, { createSchema: dishCreateSchema, updateSchema: dishUpdateSchema });
mountCrud('/testimonials', testimonialController, {
  createSchema: testimonialCreateSchema,
  updateSchema: testimonialUpdateSchema,
});
mountCrud('/faqs', faqController, { createSchema: faqCreateSchema, updateSchema: faqUpdateSchema });
mountCrud('/social-links', socialController, {
  createSchema: socialCreateSchema,
  updateSchema: socialUpdateSchema,
});

/* ---- Sections (no create/delete; fixed set) ---- */
router.get('/sections', sections.list);
router.get('/sections/:id', sections.getOne);
router.post('/sections/reorder', validate({ body: reorderSchema }), sections.reorder);
router.patch('/sections/:id', validate({ body: sectionUpdateSchema }), sections.update);

/* ---- Settings ---- */
router.get('/settings', settings.list);
router.patch('/settings', validate({ body: settingsBulkSchema }), settings.bulkUpdate);

/* ---- Menus & items ---- */
router.get('/menus', menus.listMenus);
router.get('/menus/:id', menus.getMenu);
router.post('/menus', validate({ body: menuCreateSchema }), menus.createMenu);
router.patch('/menus/:id', validate({ body: menuUpdateSchema }), menus.updateMenu);
router.delete('/menus/:id', menus.deleteMenu);

router.post('/menu-items', validate({ body: menuItemCreateSchema }), menus.createItem);
router.post('/menu-items/reorder', validate({ body: reorderSchema }), menus.reorderItems);
router.patch('/menu-items/:id', validate({ body: menuItemUpdateSchema }), menus.updateItem);
router.delete('/menu-items/:id', menus.deleteItem);

/* ---- Media ---- */
router.get('/media', media.list);
router.post('/media', uploadImageMiddleware, media.upload);
router.patch('/media/:id', validate({ body: mediaUpdateSchema }), media.update);
router.delete('/media/:id', media.remove);

/* ---- Submissions ---- */
router.get('/submissions', submissions.list);
router.get('/submissions/:id', submissions.getOne);
router.patch('/submissions/:id', validate({ body: submissionUpdateSchema }), submissions.updateStatus);
router.delete('/submissions/:id', submissions.remove);

// Convert duplicate-slug DB errors on page routes into clean 409s.
router.use(pages.handleDuplicateSlug);

export default router;
