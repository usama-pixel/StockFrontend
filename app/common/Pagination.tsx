import React from 'react';

type propType = {
    totalPages: number,
    currentPage: number,
    handlePageChange: (i: number) => void
}

function Pagination({ totalPages, currentPage, handlePageChange }: propType) {

    const renderBtns = () => {
        const pagesBtn = [];
        if (totalPages >= 7) {
            for (let i = 1; i <= 3; i++) {
                pagesBtn.push(
                    <input
                        key={i}
                        onChange={() => handlePageChange(i)}
                        className="join-item btn btn-square"
                        type="radio"
                        name="options"
                        aria-label={i.toString()}
                        checked={i === currentPage}
                    />
                );
            }
            pagesBtn.push(
                <input
                    key="ellipsis"
                    className="join-item btn btn-square"
                    type="radio"
                    name="options"
                    aria-label={'...'}
                    disabled={true}
                />
            );
            let t = totalPages-3;
            for (let i = 0; i < 3; i++) {
                pagesBtn.push(
                    <input
                        key={t}
                        onChange={() => handlePageChange(t)}
                        className="join-item btn btn-square"
                        type="radio"
                        name="options"
                        aria-label={t.toString()}
                        checked={t === currentPage}
                    />
                );
                t++;
            }
        } else {
            for (let i = 1; i <= totalPages; i++) {
                pagesBtn.push(
                    <input
                        key={i}
                        onChange={() => handlePageChange(i)}
                        className="join-item btn btn-square"
                        type="radio"
                        name="options"
                        aria-label={i.toString()}
                        checked={i === currentPage}
                    />
                );
            }
        }

        return pagesBtn;
    };
    return (
        <div className="join">
            {renderBtns()}
        </div>
    );
}

export default Pagination;
