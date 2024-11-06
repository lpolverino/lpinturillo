import PropTypes from "prop-types"
import { useState } from "react"

const MessageInput = ({onClickHandler}) => {
  const [message, setMessage] = useState("")
  return (
    <div>
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
  onClickHandler: PropTypes.func
}

export default MessageInput