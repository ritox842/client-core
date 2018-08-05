import { values } from '@datorama/utils';

/**
 * Normalize data
 * @param {T[]} data - data to normalize
 * @param {string} labelKey - key to use as label for groups in the normalized data
 * @param {string} groupByKey - key by which to normalize. If empty/undefined, normalization process is skipped.
 * @returns {T[] | R[]} - normalized data
 */
export function normalizeData<T, R>(data: T[], labelKey: string, groupByKey: string): T[] | R[] {
  if (!data || !groupByKey) {
    return data;
  }
  const groups = {};
  for (let datum of data) {
    const groupKey = datum[groupByKey].toString();
    if (groups[groupKey]) {
      groups[groupKey].children.push(datum);
    } else {
      groups[groupKey] = { children: [datum] };
      groups[groupKey][labelKey] = groupKey;
    }
  }
  return values(groups);
}
