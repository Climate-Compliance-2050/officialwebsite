/**
 * English dictionary — the source of truth for all user-facing copy.
 *
 * The copy still lives in the original per-area modules (`../site`, `../about`,
 * `../ecosystem`, the `globalPage` object in `../global`); this file aggregates
 * their value exports into one serializable bundle that `getDictionary` resolves
 * and `LocaleProvider` hands to components via `useContent()`.
 *
 * Data and types that are NOT copy (instrument types, `typeColor`, market /
 * coverage records, monitor sites, world geometry) stay importable directly from
 * their modules — they are the same in every locale and must not be translated.
 */
import * as siteCopy from "../site";
import * as aboutCopy from "../about";
import * as ecosystemCopy from "../ecosystem";
import { globalPage } from "../global";

const dictionary = {
  ...siteCopy,
  ...aboutCopy,
  ...ecosystemCopy,
  globalPage,
};

export type Dictionary = typeof dictionary;

export default dictionary;
