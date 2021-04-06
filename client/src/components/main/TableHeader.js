import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {
    const clickDisabled = () => { };
    const clickUndoDisabled = !props.hasUndo;
    const clickRedoDisabled = !props.hasRedo; 

    const headerSectionStyle = props.disabled ? ' conditional-hover ' : ' ';
    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoButtonStyle = (clickUndoDisabled) ? ' regular-button-disabled ' : 'regular-header-button ';
    const redoButtonStyle = (clickRedoDisabled) ? ' regular-button-disabled ' : 'regular-header-button ';
    
    const handleDateSorting = (e) => {
        props.sortByColumn('due_date');
    };

    const handleAssignedToSorting = (e) => {
        props.sortByColumn('assigned_to');
    };

    const handleCompletedSorting = (e) => {
        props.sortByColumn('completed');
    };

    const handleDescriptionSorting = (e) => {
        props.sortByColumn('description');
    };

    const handleClose = () =>{
		props.tps.clearAllTransactions();
        props.setActiveList({})
        props.toggleHasRedo(props.tps.hasTransactionToRedo());
        props.toggleHasUndo(props.tps.hasTransactionToUndo());
    }

    const isEmpty = () =>{
        return (props.activeList.items.length === 0)
    }

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton className={`table-header-section ${headerSectionStyle}`} onClick = {props.disabled | isEmpty ? clickDisabled :handleDescriptionSorting} wType="texted" >Task</WButton>
            </WCol>
            <WCol size="2">
                <WButton className={`table-header-section ${headerSectionStyle}`}   onClick = {props.disabled ? clickDisabled :handleAssignedToSorting} wType="texted" >Assigned To</WButton>
            </WCol>
            <WCol size="2">
                <WButton className={`table-header-section ${headerSectionStyle}`}  onClick = {props.disabled ? clickDisabled :handleDateSorting} wType="texted">Due Date</WButton>
            </WCol>
            <WCol size="2">
                <WButton className={`table-header-section ${headerSectionStyle}`}   onClick = {props.disabled ? clickDisabled :handleCompletedSorting} wType="texted" >Status</WButton>
            </WCol>
            
            <WCol size="3" className="table-header-buttons">
                <WButton  onClick={ (props.disabled && clickUndoDisabled) ? clickDisabled : props.undo} wType="texted" shape="rounded"  className={`${undoButtonStyle}`} >
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton  onClick={(props.disabled && clickRedoDisabled)? clickDisabled : props.redo} wType="texted"  shape="rounded" className={`${redoButtonStyle}`} >
                        <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`} >
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`} >
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : handleClose} wType="texted" className={`${buttonStyle}`} >
                        <i className="material-icons">close</i>
                    </WButton>

            </WCol>

        </WRow>
    );
};

export default TableHeader;