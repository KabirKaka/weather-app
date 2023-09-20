import styles from "./Card.module.css";

const Card = (props) => {
  const classes =  `${styles.card} ${props.classes}`
  return (
    <div className={classes}>
      {props.children}
    </div>
  )
}

export default Card; 
