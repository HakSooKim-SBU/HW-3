import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {
    const clickDisabled = () => { };
    const clickUndoDisabled = !props.canUndo();
    const clickRedoDisabled = !props.canRedo(); 

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const undoButtonStyle = (clickUndoDisabled) ? ' table-header-button-disabled ' : 'table-header-button ';
    const redoButtonStyle = (clickRedoDisabled) ? ' table-header-button-disabled ' : 'table-header-button ';
    // console.log(props.disabled)
    // console.log((clickUndoDisabled))
    // console.log(props.disabled && clickRedoDisabled)



    return (
        <WRow className="table-header">
            <WCol size="4">
                <WButton className='table-header-section' wType="texted" >Task</WButton>
            </WCol>
            <WCol size="3">
                <WButton className='table-header-section' wType="texted">Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" >Status</WButton>
            </WCol>

            <WCol size="3">
                <div className="table-header-buttons">
                    <WButton  onClick={ (props.disabled && clickUndoDisabled) ? clickDisabled : props.undo} wType="texted" shape="rounded" className={`${undoButtonStyle}`} >
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton  onClick={(props.disabled && clickRedoDisabled)? clickDisabled : props.redo} wType="texted"  shape="rounded" className={`${redoButtonStyle}`} >
                        <i className="material-icons">redo</i>
                    </WButton>

                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => props.setActiveList({})} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;