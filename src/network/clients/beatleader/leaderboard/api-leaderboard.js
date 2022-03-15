import queue from '../../../queues/queues'
import createClient from '../../generic'
import {opt} from '../../../../utils/js'

const process = response => {
  if (!opt(response, 'scores') || !Array.isArray(response.scores)) return null;

  const scores = response.scores.map(s => {
    let {unmodififiedScore: unmodifiedScore, mods, ...score} = s.score;

    if (mods && typeof mods === 'string') mods = mods.split(',').map(m => m.trim().toUpperCase()).filter(m => m.length);
    else if (!mods) mods = null;

    const acc = unmodifiedScore && opt(score, 'maxScore') ? unmodifiedScore / score.maxScore * 100 : opt(score, 'acc', null);
    const percentage = opt(score, 'score') && opt(score, 'maxScore') ? score.score / score.maxScore * 100 : opt(score, 'percentage', null);

    const ppWeighted = opt(score, 'pp') && opt(score, 'weight') ? score.pp * score.weight : null;

    return {
      ...s,
      score: {...score, unmodifiedScore: unmodifiedScore || null, mods, acc, percentage, ppWeighted},
    };
  });

  return {
    ...response,
    scores
  }
}

const get = async ({leaderboardId, page = 1, filters = {ranked: 'true'}, priority = queue.PRIORITY.FG_HIGH, ...queueOptions} = {}) => queue.BEATLEADER_API.leaderboard(leaderboardId, page, filters, priority, queueOptions);

const client = createClient(get, process);

export default client;