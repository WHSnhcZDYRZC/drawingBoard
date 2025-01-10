import './Toolbar.scss';

import { toolBarOptions } from '../../utils/Tools'
import { ElIcon } from 'element-plus';
import App from '../../utils/App';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'Toolbar',
  setup() {
    const getClass = computed(() => (idx: number) => {
      if (!App.drawingBoardInstance) return '';

      return App.drawingBoardInstance?.tools?.toolbarActiveIndex.value === idx ? 'active' : ''
    })

    const clickHandler = (index: number) => {
      if (App.drawingBoardInstance?.tools?.toolbarActiveIndex.value === index) return;

      App.drawingBoardInstance.tools.toolbarActiveIndex.value = index;
    }

    return () => (
      <section className="toolbar">
        {
          toolBarOptions.map((item, index) => {
            return (
              <div className={`toolbar-item ${getClass.value(index)} theme-icon`} key={index} title={item.title} onClick={() => clickHandler(index)}>
                <ElIcon>
                  <item.icon />
                </ElIcon>
              </div>
            )
          })
        }
      </section>
    )
  }
})