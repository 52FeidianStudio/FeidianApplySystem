import React from "react";
import "./ApplyTable.less";
import logoUrl from "../../assets/logo_text.png"
const ApplyTable:React.FC = function(){
    return(
        <div className="apply-table-content margin-center">
            <div className="feidian-logo margin-center">
                <img src={logoUrl}/>
            </div>
        </div>
    )
}
export default ApplyTable;
