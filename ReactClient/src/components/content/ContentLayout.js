import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

import PropTypes from 'prop-types';

const ContentLayout = ({ 
  layout, handleLayout, excludeLayout, 
  buttonGroupClass, buttonClass, iconClass
}) => {
  const LAYOUTS = [
    { icon: <RiIcons.RiLayoutGridFill size={24}/>, value: 1 },
    { icon: <MdIcons.MdOutlineStorage size={26}/>, value: 2 },
    { icon: <MdIcons.MdTableRows size={26}/>, value: 3 },
  ];

  if (excludeLayout !== undefined) {
    const index = LAYOUTS.findIndex(x => x.value === excludeLayout);
    LAYOUTS.splice(index, 1);
  }

  return (
    <>
      <ToggleButtonGroup className={buttonGroupClass} type='radio' name='options' defaultValue={layout}>
        {LAYOUTS.map((item, index) => (
          <ToggleButton 
            className={layout === item.value ? 
              `${buttonClass}-checked ms-1` : `${buttonClass}-unchecked ms-1`
            } 
            key={item.value}
            id={`layout-${index}`} value={item.value}
            onChange={() => handleLayout(item.value)}
          ></ToggleButton>
        ))}
      </ToggleButtonGroup>

      {LAYOUTS.map((item, index) => (
        <div key={index} className={iconClass} id={`${iconClass}-${index}`}>{item.icon}</div>
      ))}
    </>
  );
}

ContentLayout.propTypes = {
  layout: PropTypes.number.isRequired,
  handleLayout: PropTypes.func.isRequired,
  excludeLayout: PropTypes.number,
  buttonGroupClass: PropTypes.string,
  buttonClass: PropTypes.string,
  iconClass: PropTypes.string
}

ContentLayout.defaultProps = {
  buttonGroupClass: 'content-layout',
  buttonClass: 'layout-button',
  iconClass: 'layout-icon'
}

export default ContentLayout;