import App from "../../utils/App"
import Toolbar from "./Toolbar"
import ToolbarMenu from "./ToolbarMenu"
import Menu from "./Menu"
import Tips from "./Tips"
import Theme from "./Theme"

const Index = () => {
    return (
        <div className="toolsIndex">
            <Toolbar />

            {
                App.drawingBoardInstance?.tools?.toolbarActiveIndex ? <ToolbarMenu /> : null
            }

            <Theme />
            <Menu />
            <Tips content="HUY 画板" />
        </div>
    )
}

export default Index