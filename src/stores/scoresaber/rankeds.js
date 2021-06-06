import {writable} from 'svelte/store'
import createRankedsService from '../../services/scoresaber/rankeds'
import eventBus from '../../utils/broadcast-channel-pubsub'

let store = null;

export default async (refreshOnCreate = false) => {
  if (store) return store;

  const rankedsService = createRankedsService();

  let rankeds = refreshOnCreate ? {} : await rankedsService.getRankeds();

  const {subscribe, set} = writable(rankeds);

  const get = () => rankeds;
  const refresh = async (forceUpdate = false) => {
    await rankedsService.refreshRankeds(forceUpdate);
  }

  if (refreshOnCreate) await refresh();

  rankeds = await rankedsService.getRankeds();
  set(rankeds);

  eventBus.on('rankeds-changed', ({allRankeds}) => {
    if (allRankeds && Object.keys(allRankeds).length) set(allRankeds);
  })

  store = {
    subscribe,
    get,
    refresh
  }

  return store;
}