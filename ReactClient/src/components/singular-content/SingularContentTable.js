import React from 'react';

import PropTypes from 'prop-types';

const SingularContentTable = ({ content, icon }) => {
    let names = Object.keys(content);
    let values = Object.values(content);
    
    // if: track, else: (if: playlist, else: artist/album)
    if (content.ids !== undefined) {
        names = names.slice(1, -3);
        values = values.slice(1, -3);
    } else {
        if (content.visibility !== undefined) {
            names = names.slice(2, -1);
            values = values.slice(2, -1);
        } else {
            names = names.slice(2);
            values = values.slice(2);
        }
    }

    return (
      <>
        <table>
            <tbody>
                <tr>
                    <td>{icon}</td>
                </tr>
            </tbody>
        </table>

        <table>
            <tbody>
                {[...Array(names.length).keys()].map(i =>
                    <tr key={names[i]}>
                        <td>{names[i]?.charAt(0).toUpperCase()}{names[i]?.slice(1)}</td>
                        <td>{values[i]}</td>
                    </tr>
                )}
            </tbody>
        </table>
      </>
    );
}

SingularContentTable.propTypes = {
    icon: PropTypes.object.isRequired
}

export default SingularContentTable;