import { CreateEventComponent } from "../createEventComponent";
import { SearchAndMenuComponent } from "../seaerchAndMenuComponent";
import { SidebarComponent } from "../sidebarSomponent";
import { ToastContainer } from "react-toastify";

export default function DefaultLayout(props: any) {

    return (
        <div style={{backgroundColor: "#f3f3f3"}} className="h-screen overflow-auto flex">
            <ToastContainer />
            <SidebarComponent />
            <div className="w-full h-screen overflow-y-auto">
                <SearchAndMenuComponent />
                <div className="w-full md:w-[60%]">
                    {props.children}
                </div>
            </div>
            <CreateEventComponent />
        </div>
    );

}