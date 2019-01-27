import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import { Input, Button, Popover } from 'antd';
import MyPopover from '../common/editPopover';
import BlankImage from '../../img/blank.jpg';
const ButtonGroup = Button.Group;

function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.pageNumber === props.pageNumber) {
            if (c.type === 'text') {
                theComp = <Input
                    id={c.id}
                    style={{ position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, zIndex: 1, height: `${c.height}%`, width: `${c.width}%` }}
                />;
            } else if (c.type === 'sign') {
                theComp = <img src={BlankImage}
                    className='signBox'
                    id={c.id}
                    alt='blank'
                    style={{ border: '1px solid', borderColor: '#C2C2C2', position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, width: `${c.width}%`, zIndex: 1 }}
                />;
            }

            return (
                <div key={i}>
                    <Popover placement="top" content={
                        <ButtonGroup>
                            <Button onClick={() => props.shiftLeft(c.id, c.type)} size='large' type="primary" icon="left" />
                            <Button onClick={() => props.ShiftUp(c.id, c.type)} size='large' type="primary" icon="up" />
                            <Button onClick={() => props.shiftDown(c.id, c.type)} size='large' type="primary" icon="down" />
                            <Button onClick={() => props.shiftRight(c.id, c.type)} size='large' type="primary" icon="right" />
                            <Button onClick={() => props.componentDelete(c.id)} size='large' type="danger" icon="delete" />
                            <Button onClick={() => props.shorten(c.id, c.type)} size='large' type="danger" icon="minus" />
                            <Button onClick={() => props.lengthen(c.id, c.type)} size='large' type="danger" icon="plus" />
                        </ButtonGroup>
                    } trigger="click">
                        {theComp}
                    </Popover>
                </div>
            );
        }
    });
    return test;
}

function Pages(props) {
    let pageComponents = [];
    const {
        onDocumentLoadSuccess,
        url,
        popOverX,
        popOverY,
        addSignField,
        addTextField,
        cancelPopUp,
        onItemClick,
        showPopup,
        componentList,
        shiftDown,
        ShiftUp,
        shiftLeft,
        shiftRight,
        numPages,
        componentDelete,
        shorten,
        lengthen
    } = props;
    pageComponents.push(
        <div>
            <Document
                file={url}
                onClick={onItemClick}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <MailBox
                    componentList={componentList}
                    shiftLeft={shiftLeft}
                    ShiftUp={ShiftUp}
                    shiftDown={shiftDown}
                    shiftRight={shiftRight}
                    pageNumber={"1"}
                    componentDelete={componentDelete} 
                    shorten={shorten} 
                    lengthen={lengthen} 
                />
                {showPopup ?
                    <MyPopover
                        popOverX={popOverX}
                        popOverY={popOverY}
                        addTextField={addTextField}
                        cancelPopUp={cancelPopUp}
                        addSignField={addSignField}
                    /> : null}
                <Page renderAnnotations={false} renderTextLayer={false} pageNumber={1} scale={1} />
            </Document>
            <br></br>
        </div>
    )
    for (var i = 1; i < numPages; i++) {
        if (i + 1 !== numPages) {
            pageComponents.push(
                <div>
                    <Document
                        file={url}
                        onClick={onItemClick}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <MailBox
                            componentList={componentList}
                            shiftLeft={shiftLeft}
                            ShiftUp={ShiftUp}
                            shiftDown={shiftDown}
                            shiftRight={shiftRight}
                            pageNumber={(i + 1).toString()}
                            componentDelete={componentDelete} 
                            shorten={shorten} 
                            lengthen={lengthen} 
                        />
                        {showPopup ?
                            <MyPopover
                                popOverX={popOverX}
                                popOverY={popOverY}
                                addTextField={addTextField}
                                cancelPopUp={cancelPopUp}
                                addSignField={addSignField}
                            /> : null}
                        <Page renderAnnotations={false} renderTextLayer={false} pageNumber={i + 1} scale={1} />
                    </Document>
                    <br></br>
                </div>
            )
        } else {
            pageComponents.push(
                <div>
                    <Document
                        file={url}
                        onClick={onItemClick}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <MailBox
                            componentList={componentList}
                            shiftLeft={shiftLeft}
                            ShiftUp={ShiftUp}
                            shiftDown={shiftDown}
                            shiftRight={shiftRight}
                            pageNumber={(i + 1).toString()}
                            componentDelete={componentDelete} 
                            shorten={shorten} 
                            lengthen={lengthen} 
                        />
                        {showPopup ?
                            <MyPopover
                                popOverX={popOverX}
                                popOverY={popOverY}
                                addTextField={addTextField}
                                cancelPopUp={cancelPopUp}
                                addSignField={addSignField}
                            /> : null}
                        <Page renderAnnotations={false} renderTextLayer={false} pageNumber={i + 1} scale={1} />
                    </Document>
                </div>
            )
        }
    }
    return pageComponents;
}

class Pager extends Component {

    render() {
        const { 
            url, 
            onDocumentLoadSuccess,
            onItemClick,
            popOverX,
            popOverY,
            addTextField,
            addSignField,
            cancelPopUp,
            showPopup,
            componentList,
            shiftDown,
            ShiftUp,
            shiftLeft,
            shiftRight,
            numPages,
            componentDelete,
            shorten,
            lengthen } = this.props;


        return (
            <div>
                <Pages
                    url={url}
                    onDocumentLoadSuccess={onDocumentLoadSuccess}
                    onItemClick={onItemClick}
                    popOverX={popOverX}
                    popOverY={popOverY}
                    addTextField={addTextField}
                    cancelPopUp={cancelPopUp}
                    addSignField={addSignField}
                    showPopup={showPopup}
                    componentList={componentList}
                    shiftDown={shiftDown}
                    ShiftUp={ShiftUp}
                    shiftLeft={shiftLeft}
                    shiftRight={shiftRight}
                    numPages={numPages} 
                    componentDelete={componentDelete} 
                    shorten={shorten}
                    lengthen={lengthen}
                    />
            </div>
        );
    }
}

export default Pager;
