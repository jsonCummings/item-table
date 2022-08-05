import React from 'react';
import './itemTable.css';

export const ItemTable = (props) => {
    const itemsArray = props.itemsArray;

    const checkIfAvailable = (itemStatus) => {
        return itemStatus.toLowerCase().indexOf('available') > -1;
    }

    console.log('render', itemsArray);
    return (
        <div>
            <table className="itemTable">
                <thead>
                    <tr>
                        {/* needs all selected, some selected, none selected   value={selectAllInput}*/}
                        <th><input type="checkbox" /></th> 
                        <th></th>
                        <th><span>&#10515;</span> Download Selected</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Device</th>
                        <th>Path</th>
                        <th/>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsArray && itemsArray.map((item) =>{
                        const {name, device, path, status} = item;
                        return (
                            <tr key={name}>
                                <td>
                                    <input type="checkbox"
                                    />
                                </td>
                                <td>{name}</td>
                                <td>{device}</td>
                                <td>{path}</td>
                                <td>{checkIfAvailable(status) ? <span className="green-dot"></span> : null}</td>
                                <td>{status}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
