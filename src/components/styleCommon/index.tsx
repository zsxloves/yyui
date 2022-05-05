
import './index.less'
import React from 'react';

const CommonStyle: React.FC<any>= () => {
    return (
        <>
            <div className="info_left opacities" />
            <div className="info_top opacities" />
            <div className="info_top_blocks">
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
                <div className="info_top_block solid" />
            </div>
            <div className="info_right opacities" />
            <div className="info_bottom opacities" />
            <div className="info_left_top_line solid" />
            <div className="info_left_bottom_line solid" />
            <div className="info_top_line solid" />
            <div className="info_right_bottom_line solid" />
        </>
    )
}
export default CommonStyle;