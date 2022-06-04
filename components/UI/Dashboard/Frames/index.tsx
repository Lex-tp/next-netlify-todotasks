import React from 'react';
import TodayFrame from "./Today/TodayFrame";
import TagsFrame from "./Tags";
import CompleteFrame from "./Complete";
import NextFrame from "./Next";
import FailFrame from "./Fail";
import AllFrame from "./All";

interface MainFrameProps {
    selectFrame: number
}

function renderFrame(numberFrame:number) {
    switch(numberFrame) {
        case 1:
            return <AllFrame/>
        case 2:
            return <TodayFrame/>;
        case 3:
            return <NextFrame/>;
        case 4:
            return <CompleteFrame/>;
        case 5:
            return <FailFrame/>;
        case 6:
            return <TagsFrame/>;
        default:
            return <AllFrame/>
    }
}

const MainFrame = (props:MainFrameProps) => {

    return (
        <>
            {
                renderFrame(props.selectFrame)
            }
        </>
    );
};

export default MainFrame;