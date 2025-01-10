import './Theme.scss';

import { defineComponent } from 'vue';

import { Moon, Sunny } from '@element-plus/icons-vue';

import App from '../../utils/App'
import { ElSwitch } from 'element-plus';

export default defineComponent({
    name: 'Theme',
    setup() {

        return () => (
            <section class="theme-container">
                <ElSwitch
                    modelValue={App.drawingBoardInstance.isSun.value}

                    onUpdate:modelValue={(val) => {
                        App.drawingBoardInstance.setIsSun(val)
                    }}
                    size='large' active-icon={Sunny} inactive-icon={Moon} />
            </section >
        )
    }
})
