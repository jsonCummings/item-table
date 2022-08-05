import React, {useCallback, useState} from 'react';
import './itemTable.css';

export const ItemTable = (props) => {
  const [itemsArray, setItems] = useState(props.itemsArray);
  const [selectedItems, setSelectedItems] = useState([]);

  const allSelected = () => {
    return itemsArray.every((item => item?.checked && item.checked))
  }
  const someSelected = () => {
    return !!(selectedItems.length && (itemsArray.length !== selectedItems.length));
  }
  const indeterminateState = useCallback( el => {
    console.log('flip table', el, someSelected());
    if (el && someSelected()) {
        el.indeterminate = someSelected();
    } 
    return false;
  }, [selectedItems]);

  const checkIfAvailable = (itemStatus) => {
    return itemStatus.toLowerCase().indexOf('available') > -1;
  }

  const selectAllItems = () => {
    if(allSelected()) {
      setItems(items => (
        items.map( item => {
          return {...item, checked: false};
        })
      ))
      setSelectedItems([]);
    } else {
        setItems(items => (
            items.map( item => {
                return {...item, checked: true};
            })
        ))
        setSelectedItems(itemsArray);
    }
  }

  const handleCheckEvent = (item) => {
    const {name, checked} = item;
    setItems(items => (
      items.map( item => {
        if (item.name === name) {
          return item?.checked ? {...item, checked: !checked} : {...item, checked: true};
        } else {
          return {...item};
        }
      })
    ))
    if (selectedItems.length > 0 && (selectedItems.findIndex(existing => existing.name === item.name) > -1)) {
      setSelectedItems(selectedItems.filter( existing => existing.name !== item.name));
      // console.log('duplicate', selectedItems);
    } else {
      setSelectedItems(items => [...items, item]);
    }

    // console.log('items after set', items, selectedItems);
  }

  console.log('render', itemsArray, selectedItems);
  return (
    <div>
        <table className="itemTable">
            <thead>
                <tr>
                    {/* needs all selected, some selected, none selected*/}
                    <th>
                        {someSelected() && (<input type="checkbox"
                        ref={indeterminateState}
                        onClick={() => selectAllItems()}/>)}
                        {!someSelected() && (<input type="checkbox"
                        checked={allSelected()}
                        onClick={() => selectAllItems()}/>)}
                    </th> 
                    <th></th>
                    <th>
                      <span>&#10515;</span> Download Selected
                    </th>
                </tr>
                <tr>
                    <th/>
                    <th>Name</th>
                    <th>Device</th>
                    <th>Path</th>
                    <th/>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {itemsArray && itemsArray.map((item) =>{
                    const {name, device, path, status, checked} = item;
                    return (
                        <tr key={name}>
                            <td>
                                <input type="checkbox"
                                    checked={checked}
                                    onChange={e => handleCheckEvent(item)} 
                                    value={name}
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
