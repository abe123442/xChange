import { setData } from './dataStore';

export function clear() {
  setData({ profiles: [], users: [], comments: [], deletedProfiles: 0, deletedComments: 0 });
  return {};
}
