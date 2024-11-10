import PropTypes from "prop-types"
import { useState } from "react"

const MessageInput = ({ onClickHandler, userName, changeUserName }) => {
  const [message, setMessage] = useState("")
  return (
    <div>
      <label htmlFor="userName">User:</label>
      <input id="userName" type="text" value={userName} onChange={(e) => changeUserName(e.target.value)}/>
      <input type="text" value={message} onChange={ (e) => setMessage(e.target.value)}/>
      <button onClick={(e) => {
        e.preventDefault()
        onClickHandler(message)
      setMessage("")}
        }>Send</button>
    </div>
  )
}

MessageInput.propTypes = {
  onClickHandler: PropTypes.func,
  userName: PropTypes.string,
  changeUserName: PropTypes.func
}

export default MessageInput