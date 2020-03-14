import { get } from './helper'

const BASE_URL = 'https://yun.ahbys.com/MiniAPI'

export const getJobList = ({ wkind, pageindex, key }, { year, code }) =>
  get(
    `${BASE_URL}/${code}/Graduate/Activity/JobList.ashx?rand=${Math.random()}`,
    {
      action: 'list',
      code,
      year,
      wkind,
      pageindex,
      key
    }
  )

export const getJobDetailById = (jid, { code, gid }) =>
  get(
    `${BASE_URL}/${code}/Graduate/Activity/JobList.ashx?rand=${Math.random()}`,
    {
      action: 'info',
      code,
      gid,
      jid
    }
  )

export const applyJob = (
  { code, year, gid, college, openid },
  { jobid, cid }
) =>
  get(`${BASE_URL}/${code}/Graduate/Activity/JobList.ashx`, {
    action: 'jobapply',
    year,
    code,
    gid,
    college,
    jid: jobid,
    cid,
    openid
  })

export const setFavorite = ({ code, gid }, { jobid, cid }) =>
  get(`${BASE_URL}/${code}/Graduate/Activity/JobList.ashx`, {
    action: 'favorites',
    code,
    gid,
    jid: jobid,
    cid
  })
