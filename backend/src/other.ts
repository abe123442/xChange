import { setData } from './dataStore';

export function clear() {
  setData({ profiles: [] });
  return {};
}
