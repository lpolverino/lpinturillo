import PropTypes from "prop-types"

const MessagesBoard = ({messages}) => {
  
  return (
    <>
      <ul>
        {
          messages.map(element => {
            return <li key={element.id}>
              <p>{element.id}:{element.message}</p>
            </li>
          })
        }
          
      </ul>
    </>
  )
}

MessagesBoard.propTypes = {
  messages: PropTypes.array
}

export default MessagesBoard