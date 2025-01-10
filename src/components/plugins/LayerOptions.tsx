import { IPluginProps } from 'src/utils/types';
import Top from '../../assets/layer.svg'
import Bottom from '../../assets/layer_1.svg'
import With from '../../assets/tuceng.svg'
import Next from '../../assets/tuceng_1.svg'

import { ElIcon } from 'element-plus';

const LAYER_LIST = [
    { icon: Top, title: '置于顶层', type: 'top' },
    { icon: With, title: '置于上一层', type: 'next' },
    { icon: Next, title: '置于下一层', type: 'with' },
    { icon: Bottom, title: '置于底层', type: 'bottom' },
]

const Index = ({ drawingBoard }: IPluginProps) => {
    const graphics = drawingBoard.getSelectedGraphics();

    const getActiveLayer = (type) => {
        const zIndex = graphics.value['zIndex']

        if (zIndex >= 999 && type === 'top') {
            return 'on'
        } else if (zIndex <= -999 && type === 'bottom') {
            return 'on'
        }

        return ''
    }

    return (
        <div className="toolbarMenuLayer">
            {
                LAYER_LIST.map(Layer => {
                    return (
                        <span
                            className={`theme-icon ${getActiveLayer(Layer.type)}`}
                            key={Layer.type}
                            title={Layer.title}
                            onClick={() => {
                                switch (Layer.type) {
                                    case 'top':
                                        graphics.value['zIndex'] = 999
                                        break;
                                    case 'next':
                                        graphics.value['zIndex'] += 1
                                        break;
                                    case 'with':
                                        graphics.value['zIndex'] -= 1
                                        break;
                                    case 'bottom':
                                        graphics.value['zIndex'] = -999
                                        break;
                                }
                            }}>
                            <ElIcon>
                                <Layer.icon />
                            </ElIcon>
                        </span>
                    )
                })
            }
        </div>
    )
};

export default Index;