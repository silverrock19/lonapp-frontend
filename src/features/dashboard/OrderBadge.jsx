import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { ORDER_STATUS } from '../../utils/statuses.js';

const OrderBadge = ({ status }) => {
  const s = ORDER_STATUS[status] ?? ORDER_STATUS.Pending;
  return <StatusBadge label={status} dot={s.dot} bg={s.bg} color={s.text} />;
};

export default OrderBadge;
