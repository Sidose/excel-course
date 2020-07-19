import {Excel} from '@/components/excel/Excel';
import {Header} from '@/components/header/Header';
import {Formula} from '@/components/formula/Formula';
import {rootReducer} from '@/redux/rootReducer';
import {storage, debounce} from '@core/utils';
import {Store} from '@core/Store';
import {Table} from '@/components/table/Table';
import {Toolbar} from '@/components/toolbar/Toolbar';
import './scss/index.scss'
import {initialState} from '@/redux/initialState';

const store = new Store(rootReducer, initialState)

const stateListener = debounce(state => {
  storage('excel-state', state)
}, 300)

store.subscribe(stateListener)

const excel = new Excel('#app', {
  components: [Header, Toolbar, Formula, Table],
  store
})

excel.render()


