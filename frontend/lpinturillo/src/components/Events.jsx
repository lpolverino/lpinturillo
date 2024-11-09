import PropTypes from "prop-types"

const Events = ({events}) => {
  
  return (
    <ul>
      {
        events.map((event,index) => 
          <li key={index}>{event}</li>
        )
      }
    </ul>
  )
}

Events.propTypes = {
  events: PropTypes.array
}
export default Events