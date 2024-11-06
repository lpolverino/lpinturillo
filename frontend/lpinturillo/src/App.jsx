import { useState } from "react"
import MessageInput from "./components/MessageInput"
import MessagesBoard from "./components/MessagesBoard"

function App() {
  const [messages, setMessages] = useState([])
  const addValue = (newValue) => {
    const newArray = messages.concat([{id:newValue, message:newValue}])
    setMessages(newArray)
  }

  return (
    <>
      <div>
        <MessagesBoard messages={messages}></MessagesBoard>
        <MessageInput onClickHandler={(newvalue) => addValue(newvalue)}></MessageInput>
      </div>
   </>
  )
}

export default App
