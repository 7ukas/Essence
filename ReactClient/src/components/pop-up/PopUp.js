import React from 'react';

import PropTypes from 'prop-types';

import './PopUp.css'

const PopUp = ({ notification, setPopUp }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => { 
            setPopUp({ 
                pop: false, 
                notification: ''
            }); 
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (<div className='pop-up'>{notification}</div>);
};

PopUp.propTypes = {
    notification: PropTypes.string.isRequired,
    setPopUp: PropTypes.func.isRequired
}

export default PopUp;