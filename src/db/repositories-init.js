import cacheRepository from './repository/cache';
import keyValueRepository from './repository/key-value';
import playersRepository from './repository/players';
import twitchRepository from './repository/twitch';
import log from '../utils/logger';


export default () => {
  log.debug('Initialize DB repositories');

  // initialize all repositories in order to create cache to sync
  [cacheRepository, keyValueRepository, playersRepository, twitchRepository].map(repository => repository());
}