import React, { Component } from 'react';
import { Button } from 'antd';

const ButtonGroup = Button.Group;

class EditPopover extends Component {

    render() {
        const { popOverX, popOverY, addTextField, cancelPopUp, addSignField } = this.props;

        return (
            <div className="popover" style={{ position: 'absolute', zIndex: '9999', top: `${popOverY}%`, left: `${popOverX}%` }}>
                <ButtonGroup>
                    <Button onClick={addTextField} size='large' type="primary" icon="file-text" />
                    <Button onClick={addSignField} size='large' type="primary" icon="edit" />
                    <Button size='large' type="primary" icon="check-square-o" />
                    <Button size='large' type="primary" icon="calendar" />
                    <Button onClick={cancelPopUp} size='large' type="primary" icon="close" />
                </ButtonGroup>
            </div>
        );
    }
}

export default EditPopover;
