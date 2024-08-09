import { getCodeById, searchCodesBySession } from "../service/codeService"
import { getGroupPassrate } from "../service/submissionService"

export const orderByNameAsc = (groups) => {
  return groups.sort((a, b) => {
    const numA = parseInt(a.name.split(' ')[1], 10)
    const numB = parseInt(b.name.split(' ')[1], 10)

    if (numA > numB) return -1
    else if (numA < numB) return 1
    else return 0
  })
}

export const orderByNameDesc = (groups) => {
  return groups.sort((a, b) => {
    const numA = parseInt(a.name.split(' ')[1], 10)
    const numB = parseInt(b.name.split(' ')[1], 10)

    if (numA < numB) return 1
    else if (numA > numB) return -1
    else return 0
  })
}


export const orderByConversationAsc = (groups) => {
  return groups.sort((a, b) => {
    if (a.passrate.conversation > b.passrate.conversation) return -1
    else if (a.passrate.conversation < b.passrate.conversation) return 1
    else return 0
  })
}

export const orderByConversationDesc = (groups) => {
  return groups.sort((a, b) => {
    if (a.passrate.conversation < b.passrate.conversation) return 1
    else if (a.passrate.conversation > b.passrate.conversation) return -1
    else return 0
  })
}

export const orderbyDirectMessages = (groups) => {
  return groups.sort((a, b) => {
    if (a.messages.length === 0 ||
      b.messages.length === 0)
      return a.messages.length - b.messages.length
    //console.log(a)
    let aTime = a.messages[a.messages.length - 1].created_time
    let bTime = b.messages[b.messages.length - 1].created_time
    return aTime - bTime
  })
}

export const orderByPassrateAsc = (groups) => {
  return groups.sort((a, b) => {
    return a.progress.passrate - b.progress.passrate
  })
}
export const orderByPassrateDesc = (groups) => {
  return groups.sort((a, b) => {
    return b.progress.passrate - a.progress.passrate
  })
}

export const searchByMsg = (groups, searchContent) => {
  const results = []

  groups.forEach((group, groupIndex) => {
    for (const [messageIndex, message] of group.messages.entries()) {
      if (message.content.includes(searchContent)) {
        results.push(group)
        break
      }
    }
  })

  return results
}




export const searchByCode = async (groups, searchContent, sessionId) => {
  const results = []
  let codes = []
  codes = await searchCodesBySession(sessionId, searchContent)
  //console.log(codes)
  if (codes === null || codes === undefined || codes.length === 0) {
    return []
  }

  const users = codes.map(code => code.creater_id)
  groups.forEach((group) => {
    for (const user of group.user_ids) {
      if (users.includes(user)) {
        results.push(group)
        break
      }
    }
  })
  return results
}
export const orderById = (groups) => {
  return groups.sort((a, b) => {
    return a.id - b.id
  })
}

export const groupFilter = async (submissions, groups, filter, sessionId) => {
  if (!groups) return []
  let res = orderById([...groups])

  if (filter.searchContent !== '') {
    if (filter.searchType === 'msg') {
      res = searchByMsg(groups, filter.searchContent)
    } else if (filter.searchType === 'code') {
      res = await searchByCode(groups, filter.searchContent, sessionId)
    }
  }

  groups.map((group) => {
    group.progress.passrate = getGroupPassrate(submissions, group)
  })

  if (filter.sortType === 'nameAsc') {
    res = orderByNameAsc(res)
  } else if (filter.sortType === 'nameDesc') {
    res = orderByNameDesc(res)
  } else if (filter.sortType === 'conversationAsc') {
    res = orderByConversationAsc(res)
  } else if (filter.sortType === 'conversationDesc') {
    res = orderByConversationDesc(res)
  } else if (filter.sortType === 'passrateAsc') {
    res = orderByPassrateAsc(res)
  } else if (filter.sortType === 'passrateDesc') {
    res = orderByPassrateDesc(res)
  } else if (filter.sortType === 'directmessage') {
    res = orderbyDirectMessages(res)
  }
  return res
}

