import TrendChartCard from "../components/cards/TrendChartCard";
import StatCard from "../components/cards/StatCard";
import AlertListCard from "../components/cards/AlertListCard";
import MapCard from "../components/cards/MapCard";
import TableCard from "../components/cards/TableCard";
import DynamicComponent from "../components/DynamicComponent";

export const componentMap: any = {
  trendChart: TrendChartCard,
  statCard: StatCard,
  alertList: AlertListCard,
  mapCard: MapCard,
  tableCard: TableCard,
  // AI Engine 动态生成的组件类型
  weather: DynamicComponent,
  chart: DynamicComponent,
  map: DynamicComponent,
  stat: DynamicComponent,
  table: DynamicComponent,
  alert: DynamicComponent,
  text: DynamicComponent,
  image: DynamicComponent,
  video: DynamicComponent,
  calendar: DynamicComponent,
  progress: DynamicComponent,
};
