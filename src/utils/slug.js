import slugify from 'slugify';

export function toSlug(input = '') {
  return slugify(String(input), { lower: true, strict: true, trim: true });
}

/**
 * Produce a slug that is unique within a collection.
 * `existsFn(candidate)` should resolve truthy if the slug is already taken.
 */
export async function uniqueSlug(base, existsFn) {
  const root = toSlug(base) || 'item';
  let candidate = root;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await existsFn(candidate)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

export default toSlug;
