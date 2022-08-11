import React, {useCallback, useState} from 'react';
import './itemTable.css';

export interface ItemTableProps {
  itemsArray: ItemTableObject[]
};

export interface ItemTableObject {
  name: string, 
  device: string, 
  path: string, 
  status: string,
  checked?: boolean
};

const ItemTable = (props: ItemTableProps) => {
  const [itemsArray, setItems] = useState(props.itemsArray);
  const [selectedItems, setSelectedItems] = useState([] as ItemTableObject[]);

  const allSelected = () => {
    return itemsArray.every((item => item?.checked && item.checked))
  }
  const someSelected = () => {
    return !!(selectedItems.length && (itemsArray.length !== selectedItems.length));
  }
  const indeterminateState = useCallback( el => {
    if (el && someSelected()) {
        el.indeterminate = someSelected();
    } 
    return false;
  }, [selectedItems]);

  const checkIfAvailable = (itemStatus: string) => {
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

  const displayNumberSelected = useCallback(() => {
    const length = selectedItems.length;
    if (length === 0){
        return 'None Selected';
    } else {
        return `${length} Selected`;
    }
  }, [selectedItems, itemsArray]);

  const handleCheckEvent = (item: ItemTableObject) => {
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
    } else {
      setSelectedItems(items => [...items, item]);
    }
  }

  const downloadSelected = () => {
    // check if it can be downloaded, alert path & device
    if (selectedItems.length >= 1) {
      if (selectedItems.every(((item: ItemTableObject) => checkIfAvailable(item.status)))){
        let windowString = selectedItems.map((item => `path: ${item.path} device: ${item.device}\n`));
        alert(windowString);
      } else {
        alert('Not all selected files are available for download. Please unselect those with the status scheduled');
      }
    }
  }

  const selectedRow = (index: number) => {
    return itemsArray[index]?.checked && itemsArray[index].checked;
  }

  return (
    <table className="itemTable">
        <thead>
            <tr className='fontSize-22' >
                <td className='width-5'>
                    {someSelected() && (<input type="checkbox"
                    ref={indeterminateState}
                    onChange={() => selectAllItems()}/>)}
                    {!someSelected() && (<input type="checkbox"
                    checked={allSelected()}
                    onChange={() => selectAllItems()}/>)}
                </td> 
                <td className='fontWeight-normal width-20'>
                  {displayNumberSelected()}
                </td>
                <div className="inlineBlock overflowX-visible colspan-0">
                  <span className="fontWeight-bold clickable" onClick={() => downloadSelected()}>
                    &#10515; 
                  </span> 
                  <span className='fontWeight-normal'>
                      Download Selected
                  </span>
                </div>
            </tr>
            <tr className='fontSize-18 textAlign-left'>
                <th/>
                <th className='fontWeight-normal width-20'>Name</th>
                <th className='fontWeight-normal'>Device</th>
                <th className='fontWeight-normal'>Path</th>
                <th/>
                <th className='fontWeight-normal'>Status</th>
            </tr>
        </thead>
        <tbody className='fontSize-14 textAlign-left hoverTable'>
          {/* TODO: break this out into a separate component */}
            {itemsArray && itemsArray.map((item, index) =>{
                const {name, device, path, status, checked} = item;
                return (
                    <tr key={name} className={selectedRow(index) ? 'selectedRow' : ''} >
                        <td className='width-5 textAlign-center'>
                          {/* TODO: break this out into a separate component */}
                            <input type="checkbox"
                                checked={checked}
                                onChange={() => handleCheckEvent(item)} 
                                value={name}
                            />
                        </td>
                        <td>{name}</td>
                        <td>{device}</td>
                        <td>{path}</td>
                        <td className='textAlign-right'>{checkIfAvailable(status) ? <span className="green-dot"></span> : null}</td>
                        <td>{status[0].toUpperCase() + status.substring(1)}</td>
                    </tr>
                )
            })}
        </tbody>
    </table>
  )
};

export default ItemTable;
