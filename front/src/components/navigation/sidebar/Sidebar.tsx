import { Cookie, ExpandCircleDownOutlined, Menu } from "@mui/icons-material";
import { useState } from "react";
import { sidebarItems } from "../../../constant/menu/navigation";
import SidebarItem from "./sidebarItem/SidebarItem";
import './Sidebar.css'

export default function Sidebar() {

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);


    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };


    return <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="header" onClick={toggleSidebar}>
            {!isCollapsed && 
                <div className="logo">
                    <Cookie />
                    <span>Meal Planner</span>
                </div>
            }

            <div className="collapse-button">
                { isCollapsed ? <Menu/> : <ExpandCircleDownOutlined style={{rotate: '90deg'}}/> }
            </div>
        </div>

        <div className="menu-container">
            {sidebarItems
                .map((item, index) => {
                return <SidebarItem key={`sidebar-item-${index}`} isCollapsed={isCollapsed} item={item}/>
            })}
        </div>
    </div>;
}