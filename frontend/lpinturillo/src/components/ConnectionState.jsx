import Proptypes from "prop-types"

const ConnectionState = ({isConnected}) => {
  
  return (
    <div>
    <p>State: {" " + isConnected}</p>
    </div>
  )
}

ConnectionState.propTypes = {
  isConnected: Proptypes.bool
}

export default ConnectionState