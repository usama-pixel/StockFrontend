import React from 'react'

function Card({title, body}: {title: string, body: string}) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">{title}</h2>
            <p>{body}</p>
            {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
            </div> */}
        </div>
    </div>
  )
}

export default Card