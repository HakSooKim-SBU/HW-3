import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {
    const clickDisabled = () => { };
    const clickUndoDisabled = !props.canUndo();
    const clickRedoDisabled = !props.canRedo(); 

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoButtonStyle = (clickUndoDisabled) ? ' regular-button-disabled ' : 'regular-header-button ';
    const redoButtonStyle = (clickRedoDisabled) ? ' regular-button-disabled ' : 'regular-header-button ';
    
    // const handleDateSorting = (e) => {
    //     props.sortItems('due_date');
    // };

    // const handleCompletedSorting = (e) => {
    //     props.sortItems('completed');
    // };

    const handleDescriptionSorting = (e) => {
        props.sortItems('description');
    };

    const handleClose = () =>{
		props.tps.clearAllTransactions();
        props.setActiveList({})
    }




    return (
        <WRow className="table-header">
            <WCol size="4">
                <WButton className='table-header-section' onClick = {handleDescriptionSorting} wType="texted" >Task</WButton>
            </WCol>
            <WCol size="3">
                <WButton className='table-header-section' wType="texted">Due Date</WButton>
            </WCol>
            <WCol size="2">
                <WButton className='table-header-section'  wType="texted" >Status</WButton>
            </WCol>

            <WCol size="3" className="table-header-buttons">
                <WRow size="5" >
                    <WButton  onClick={ (props.disabled && clickUndoDisabled) ? clickDisabled : props.undo} wType="texted" shape="rounded" className={`${undoButtonStyle}`} >
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton  onClick={(props.disabled && clickRedoDisabled)? clickDisabled : props.redo} wType="texted"  shape="rounded" className={`${redoButtonStyle}`} >
                        <i className="material-icons">redo</i>
                    </WButton>
                </WRow>

                <WRow size="7" >
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : handleClose} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </WRow>

            </WCol>

        </WRow>
    );
};

export default TableHeader;