import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { SelectedCodeContext } from '../../context/SelectedCodeContext'
import { getCodeById } from '../../service/codeService'
import { getAvatar, getDateString, getTimeString } from '../../tool/Tools'
import { showToast } from '../commonUnit/Toast'
import { useState } from 'react'
import { filterProfanity } from '../../tool/profanityFilter'
import { getUserById } from '../../service/userService'
import { Menu } from '@mui/material'
import * as React from 'react'
import { SlackCounterGroup } from '@charkour/react-reactions'
import { addReaction } from '../../service/groupService'
import { SelectedGroupContext } from '../../context/SelectedGroupContext'
import { useEffect } from 'react'
import EmojiSelector from './EmojiSelector'

const Message = ({ message, user, isSelected, onSelect }) => {
  const { setSelectedCode } = useContext(SelectedCodeContext)
  const messageClass = isSelected ? 'message selected' : 'message'
  const { currentUser } = useContext(AuthContext)
  const { selectedGroup } = useContext(SelectedGroupContext)
  const [showReaction, setShowReaction] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [selectedEmoji, setSelectedEmoji] = React.useState([])
  const [emojiNames, setEmojiNames] = React.useState([[], [], [], []]) //[❤️],[✅],[👍]",[❔]
  const [emoji, setEmoji] = useState(null)

  useEffect(() => {
    const emojiObj = message.reactions
    if (!emojiObj) return
    const emojiArray = Object.entries(emojiObj).map(([key, value]) => ({
      by: key,
      emoji: value ? (Array.isArray(value) ? value : [value]) : [],
    }))
    emojiArray.forEach((obj) => {
      if (!obj.emoji) {
        const index = emojiArray.findIndex((emoji) => emoji === obj)
        emojiArray.splice(index, 1)
      }
      
    })
    setSelectedEmoji(emojiArray)
  }, [message])

  useEffect(() => {
    let names = new Array(4)
    names[0] = selectedEmoji
      .filter((reaction) => reaction.emoji.includes('❤️'))
      .map((reaction) => {
        return reaction.by
      })
    names[1] = selectedEmoji
      .filter((reaction) => reaction.emoji.includes('✅'))
      .map((reaction) => {
        return reaction.by
      })
    names[2] = selectedEmoji
      .filter((reaction) => reaction.emoji.includes('👍'))
      .map((reaction) => {
        return reaction.by
      })
    names[3] = selectedEmoji
      .filter((reaction) => reaction.emoji.includes('❔'))
      .map((reaction) => {
        return reaction.by
      })
    setEmojiNames(names)
  }, [selectedEmoji])

  const open = Boolean(anchorEl)
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
    setShowReaction(true)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setShowReaction(false)
  }

  const handleEmojiClick = (emoji, name) => {
    //search selectedEmoji and check if emoji name pair already exists
    //if exists, remove it
    //else add it
    const index = selectedEmoji.findIndex((obj) => obj.by === name)

    if (index === -1) {
      const emojiObj = {
        by: name,
        emoji: [emoji],
      }
      setSelectedEmoji([...selectedEmoji, emojiObj])
      addReaction(message.id, emojiObj)
      handleClose()
    } else {
      let newEmojis = [...selectedEmoji]
      let emoji_index = newEmojis[index].emoji.findIndex((obj) => obj === emoji)
      let emojiObj = { 
        by: name,
        emoji: newEmojis[index].emoji,
      }
      if (emoji_index !== -1) {
        emojiObj.emoji.splice(emoji_index, 1)
      } else {
        emojiObj.emoji.push(emoji)
      }
      setSelectedEmoji(newEmojis)
      addReaction(message.id, emojiObj)
    }
  }

  const handleClick = async () => {
    if( message.group_id !== -4) {
      if (onSelect) onSelect()
      const user_id = await getUserById(message.sender_id)
      const code = await getCodeById(user_id.code_id)
      if (!code && !showReaction)
        showToast('Code not found!', 'warning')
      if (code) setSelectedCode(code)
    }
  }


  if (currentUser?.id !== message?.sender_id) {
    const url = message.sender_id ===  -4 ? "https://cdn1.iconfinder.com/data/icons/data-science-flat-1/64/ai-customer-service-support-robot-artificial-intelligence-1024.png" : getAvatar(user?.avatar_url)
    const name = message.sender_id === -4 ? "AI assistant" : user?.first_name
    return (
      <div
        className={messageClass}
        style={{ justifyContent: 'left' }}
        onClick={
          currentUser?.id === user?.id || currentUser.role < 3
            ? handleClick
            : null
        }>
        <div className="messageInfo">
          <img src={getAvatar(url)} alt="" />
          <span className="info-user">{name}</span>
          <span>{getDateString(message.created_time)}</span>
          <span>{getTimeString(message.created_time)}</span>
        </div>
        <div className="messageContentWrapper">
          <div className="messageContent">
            <pre>{filterProfanity(message?.content)}</pre>
          </div>
          {message.receiver_id &&
            message.receiver_id !== 'all' &&
            message.receiver_id !== 'group' &&
            message.receiver_id !== 'class' && (
              <p className="dm">(Direct Message)</p>
            )}
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '4px' }} key={0}>
              <SlackCounterGroup
                emoji={'❤️'}
                count={emojiNames[0].length}
                names={emojiNames[0]}
                active={true}
                onSelect={(emoji) =>
                  handleEmojiClick(emoji, currentUser.first_name)
                }
              />
            </div>
            <div style={{ marginRight: '4px' }} key={0}>
              <SlackCounterGroup
                emoji={'✅'}
                count={emojiNames[1].length}
                names={emojiNames[1]}
                active={true}
                onSelect={(emoji) =>
                  handleEmojiClick(emoji, currentUser.first_name)
                }
              />
            </div>
            <div style={{ marginRight: '4px' }} key={0}>
              <SlackCounterGroup
                emoji={'👍'}
                count={emojiNames[2].length}
                names={emojiNames[2]}
                active={true}
                onSelect={(emoji) =>
                  handleEmojiClick(emoji, currentUser.first_name)
                }
              />
            </div>
            <div style={{ marginRight: '4px' }} key={0}>
              <SlackCounterGroup
                emoji={'❔'}
                count={emojiNames[3].length}
                names={emojiNames[3]}
                active={true}
                onSelect={(emoji) =>
                  handleEmojiClick(emoji, currentUser.first_name)
                }
              />
            </div>

            {/* <SlackCounter
              counters={selectedEmoji}
              onAdd={handleOpen}
              user={currentUser.first_name}
              onSelect={(emoji) =>
                handleEmojiClick(emoji, currentUser.first_name)
              }
            /> */}
          </div>
        </div>
        <div className="reaction">
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <EmojiSelector
              onClick={handleEmojiClick}
              user={currentUser.first_name}
            />
          </Menu>
        </div>
      </div>
    )
  }
  return (
    <div
      className={messageClass}
      onClick={
        currentUser?.id === user?.id || currentUser.role < 3
          ? handleClick
          : null
      }>
      <div className="reaction">
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <EmojiSelector
            onClick={handleEmojiClick}
            user={currentUser.first_name}
          />
        </Menu>
      </div>
      <div className="messageContentWrapper">
        <div className="messageContentRight">
          <pre>{filterProfanity(message?.content)}</pre>
        </div>
        {message.receiver_id &&
          message.receiver_id !== 'all' &&
          message.receiver_id !== 'group' &&
          message.receiver_id !== 'class' && (
            <p className="dm">(Direct Message)</p>
          )}
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '4px' }} key={0}>
            <SlackCounterGroup
              emoji={'❤️'}
              count={emojiNames[0].length}
              names={emojiNames[0]}
              active={true}
              onSelect={(emoji) =>
                handleEmojiClick(emoji, currentUser.first_name)
              }
            />
          </div>
          <div style={{ marginRight: '4px' }} key={0}>
            <SlackCounterGroup
              emoji={'✅'}
              count={emojiNames[1].length}
              names={emojiNames[1]}
              active={true}
              onSelect={(emoji) =>
                handleEmojiClick(emoji, currentUser.first_name)
              }
            />
          </div>
          <div style={{ marginRight: '4px' }} key={0}>
            <SlackCounterGroup
              emoji={'👍'}
              count={emojiNames[2].length}
              names={emojiNames[2]}
              active={true}
              onSelect={(emoji) =>
                handleEmojiClick(emoji, currentUser.first_name)
              }
            />
          </div>
          <div style={{ marginRight: '4px' }} key={0}>
            <SlackCounterGroup
              emoji={'❔'}
              count={emojiNames[3].length}
              names={emojiNames[3]}
              active={true}
              onSelect={(emoji) =>
                handleEmojiClick(emoji, currentUser.first_name)
              }
            />
          </div>
        </div>
      </div>
      <div className="messageInfo">
        <img src={getAvatar(user?.avatar_url)} alt="" />
        <span className="info-user">{currentUser.first_name}</span>
        <span>{getDateString(message.created_time)}</span>
        <span>{getTimeString(message.created_time)}</span>
      </div>
    </div>
  )
}

export default Message
