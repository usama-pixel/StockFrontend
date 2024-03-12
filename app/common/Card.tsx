import React from 'react'
import styles from './card.module.scss'
function Card({title, body}: {title: string, body: string}) {
  return (
    <div className={`${styles.myCard} card w-full bg-base-100 shadow-xl`} style={{minWidth: '295px'}}>
        <div className="card-body">
            
            <h2 className="card-title">
              {title}
              {title === 'Revenue' && <sup>(tax+disc.-sales = rev)</sup>}
            </h2>
            <p>{body}</p>
            {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
            </div> */}
        </div>
    </div>
  )
}

export default Card